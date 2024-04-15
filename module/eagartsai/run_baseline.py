import argparse
import numpy as np
import pandas as pd

from datasets import Dataset
from eagartsai_amui.simulation.eagartsai import run_baseline_sample
from eagartsai_amui.scaling_meltpool import rescale_baseline
from tqdm import tqdm
from skimage import measure
from scipy import optimize
from scipy import interpolate as interp

def calculate_dimensions(theta, mesh, melt_T, dimstep, verbose = False):
    """
    Calculate the dimensions of a melt pool based on temperature data.

    Args:
        theta (ndarray): 3D numpy array representing the temperature distribution.
        mesh (tuple): Tuple containing the x, y, and z coordinates of the mesh. 
        Each entry is a numpy array in ascending order containing the unique x, y, or z coordinates of the mesh respectively.
        melt_T (float): Melting temperature of the material.
        dimstep (float): Step size of the mesh.

    Returns:
        dict: Dictionary containing the calculated dimensions of the melt pool.
            - 'length': Length of the melt pool.
            - 'width': Width of the melt pool.
            - 'depth': Depth of the melt pool.
    """
    
    xs, ys, zs = mesh
    # center of the melt pool is where it's the hottest
    print("max_theta", np.max(theta))
    dimensions = {}
    if not np.array(theta[:,:,-1] > melt_T).any():
        print(f"Energy Density too low to melt material, melting temperature: {melt_T} K, max temperature: {np.max(theta[:,:,-1])} K")
        length = 0
        width = 0
        depth = 0
        dimensions['length'] = float(length)
        dimensions['width'] = float(width)
        dimensions['depth'] = float(depth)
        return dimensions
    else:

        # Calculate length and width the easy way
        # Create object to calculate the dimensions of the binarized melt pool
        prop = measure.regionprops(np.array(theta[:,:,-1]>melt_T, dtype = 'int'))
        length = prop[0].major_axis_length*dimstep

        if verbose:
            print("Length: {:.04} ± {:.04}".format(length*1e6, dimstep*1e6))
        width = prop[0].minor_axis_length*dimstep
        if verbose:
            print("Width: {:.04} ± {:.04}".format(width*1e6, dimstep*1e6))

        depths = []
        for j in range(len(ys)):
            for i in range(len(xs)):     
                # Calculate depth the hard way
                if theta[i, j, -1] > melt_T:
                    g = interp.CubicSpline(zs, theta[i, j, :] - melt_T)
                    root = optimize.brentq(g, zs[0],zs[-1])
                    depths.append(root)

        depth = np.min(depths)
        dimensions['length'] = float(length)
        dimensions['width'] = float(width)
        dimensions['depth'] = -float(depth)
        if verbose:
            print("Calculated dimensions. Length: {:.04}µm, Width: {:.04}µm, Depth: {:.04}µm".format(length*1e6, width*1e6, -depth*1e6))
        return dimensions
    

def replace_special_characters(text):
    """
    Replace special characters "-", ".", " ", and "/" with an empty string.
    
    Args:
    text (str): The input text.
    
    Returns:
    str: The text with special characters replaced.
    """
    special_characters = ["-", ".", " ", "/"]
    for char in special_characters:
        text = text.replace(char, "")
    return text

materials = pd.read_csv('./materials.csv')

#############
# Arguments #
#############

parser = argparse.ArgumentParser()
parser.add_argument("material", type=str, help="i.e. Ti-6Al-4V")

# Power
parser.add_argument("--power_start", type = int, default = 0, required = False)
parser.add_argument("--power_step", type = int, default = 20, required = False)
parser.add_argument("--power_stop", type = int, default = 480, required = False)

# Velocity
parser.add_argument(
    "--velocity_start",
    type = float,
    default = 0.0,
    required = False,
)
parser.add_argument(
    "--velocity_step", 
    type = float, 
    default = 0.1, 
    required = False,
)
parser.add_argument(
    "--velocity_stop", 
    type = float, 
    default = 2.9, 
    # default = 0.1, 
    required = False,
)

# Machine Parameters
parser.add_argument(
    "--d_beam",
    type = float,
    default = 100e-6,
    required = False,
    help = "Beam diameter in m"
)

# Simulation Parameters
parser.add_argument(
    "--mesh_resolution",
    type = float,
    default = 10e-6,
    required = False,
    help = "Mesh resolution of simulation"
)
parser.add_argument(
    "--bound_x_start",
    type = float,
    default = -1000e-6,
    required = False,
    help = "Start bound for X of simulation"
)
parser.add_argument(
    "--bound_x_stop",
    type = float,
    default = 5000e-6,
    required = False,
    help = "Stop bound for X of simulation"
)
parser.add_argument(
    "--bound_y_start",
    type = float,
    default = -500e-6,
    required = False,
    help = "Start bound for Y of simulation"
)
parser.add_argument(
    "--bound_y_stop",
    type = float,
    default = 500e-6,
    required = False,
    help = "Stop bound for Y of simulation"
)

# Note: I've gotten away with using a domain depth (z) of 400e-6 for most melt
# pools, but 800e-6 may be necessary for very deep melt pools
parser.add_argument(
    "--bound_z_start",
    type = float,
    default = -400e-6,
    required = False,
    help = "Start bound for Z of simulation"
)
parser.add_argument(
    "--bound_z_stop",
    type = float,
    default = 0,
    required = False,
    help = "Stop bound for Z of simulation"
)

# Debug
parser.add_argument("--verbose", type = bool, default = True, required = False)

args = parser.parse_args()

VERBOSE = args.verbose

#########
# Power #
#########

power_start = args.power_start
power_step = args.power_step
power_stop = args.power_stop

power_range = np.linspace(
    start = power_start,
    stop = power_stop,
    num = (power_stop // power_step) + 1,
    dtype = int
)

if VERBOSE: print(f"powers: {power_range}")

############
# Velocity #
############

velocity_start = args.velocity_start
velocity_step = args.velocity_step
velocity_stop = args.velocity_stop
velocity_range = np.linspace(
    start = velocity_start,
    stop = velocity_stop,
    num = round(velocity_stop / velocity_step) + 1,
)
velocity_range = [round(x, 2) for x in velocity_range]

if VERBOSE: print(f"velocities: {velocity_range}")

##############
# Parameters #
##############

# Material Parameters
material = args.material
materials_row = materials[materials["material"] == material]
material_name = replace_special_characters(material)

cp = float(materials_row['specific_heat_capacity_j_kg_k'])
k = float(materials_row['thermal_conductivity_w_m_k'])
rho = float(materials_row['density_g_cm_3'])*1000 # Density in kg/m^3
t_melt = float(materials_row['melting_temperature'])
absorptivity = float(materials_row['absorptivity']) 
absorptivity = 0.57
if VERBOSE: print(f"Absorptivity: {absorptivity}")

# Machine Parameters
d_beam = args.d_beam

# Simulation Parameters
mesh_resolution = args.mesh_resolution
simulation_bounds = {
    "x": [args.bound_x_start, args.bound_x_stop],
    "y": [args.bound_y_start, args.bound_y_stop],
    "z": [args.bound_z_start, args.bound_z_stop],
}

b = 200e-6
# bounds = {'x': [-1000e-6, 1000e-6], 'y': [-300e-6, 300e-6], 'z': [-400e-6, 0]}
bounds = simulation_bounds
# dimstep = 5e-6
xs = np.arange(-b + bounds['x'][0], bounds['x'][1]+ b, step = mesh_resolution)
ys = np.arange(bounds['y'][0] - b, bounds['y'][1] + b, step = mesh_resolution)
zs = np.arange(bounds['z'][0], bounds['z'][1] + mesh_resolution, step = mesh_resolution)
mesh = (xs, ys, zs)

if VERBOSE:
    print(cp, k, rho, t_melt, absorptivity, d_beam, mesh_resolution, simulation_bounds)
###############
# Run Samples #
###############

velocity_baseline_times = []
velocity_baseline_thetas = []

for velocity in tqdm(velocity_range):
    if VERBOSE: print(f"Velocity: {velocity}")
    test, times, thetas = run_baseline_sample(
        bc="flux",
        V=velocity,
        absorp=1,
        cp=cp,
        k=k,
        beamD=d_beam,
        rho=rho,
        melt_T=t_melt,
        resolution=mesh_resolution,
        bounds=simulation_bounds,
    )
    print(np.max(np.array(thetas)))

    # test.plot()

    if VERBOSE:
        print(f"times: {times}")
        print(f"thetas: {np.array(thetas).shape}")

    velocity_baseline_times.append(times)
    velocity_baseline_thetas.append(thetas)

power_rescaled_thetas = []

power_velocity_widths_map = []
power_velocity_depths_map = []
power_velocity_lengths_map = []

for power in tqdm(power_range):
    velocity_rescaled_thetas = []
    velocity_widths_map = []
    velocity_depths_map = []
    velocity_lengths_map = []
    for velocity_theta in velocity_baseline_thetas:
        print("theta", np.max(np.array(velocity_theta)))
        rescaled_theta = rescale_baseline(np.array(velocity_theta), power, absorptivity)
        print("rescaled", np.max(np.array(rescaled_theta)))
        dimensions = calculate_dimensions(rescaled_theta, mesh, t_melt, dimstep=mesh_resolution, verbose=True)
        velocity_widths_map.append(dimensions["width"])
        velocity_lengths_map.append(dimensions["length"])
        velocity_depths_map.append(dimensions["depth"])
    power_velocity_widths_map.append(velocity_widths_map)
    power_velocity_depths_map.append(velocity_depths_map)
    power_velocity_lengths_map.append(velocity_lengths_map)
    #     velocity_rescaled_thetas.append(rescaled_theta)
    # power_rescaled_thetas.append(velocity_rescaled_thetas)

process_map_name = f"m_{material_name}_p_{power_start}_{power_stop}_{power_step}_v_{velocity_start}_{velocity_stop}_{velocity_step}"

process_map_data = {
    "args": [args.__dict__],
    "widths": [power_velocity_widths_map],
    "depths": [power_velocity_depths_map],
    "lengths": [power_velocity_lengths_map],
    "powers": [power_range],
    "velocities": [velocity_range],
}

print(args.__dict__)
print(process_map_name)

Dataset.from_dict(process_map_data).push_to_hub(
    "baratilab/Eagar-Tsai",
    config_name = "process_maps",
    split = process_map_name,
    commit_message = process_map_name
)

