import argparse
import numpy as np

from datasets import Dataset
from eagartsai_amui.simulation.eagartsai import run_sample

#############
# Arguments #
#############

parser = argparse.ArgumentParser()
parser.add_argument("material", type=str, help="Ti64")

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
    required = False,
)

# Material Parameters
parser.add_argument(
    "--cp",
    type = float,
    default = 470.0,
    required = False,
    help = "Specific Heat in J/kg * K"
)
parser.add_argument(
    "--k",
    type = float,
    default = 13.4,
    required = False,
    help = "Conductivity in W/m"
)
parser.add_argument(
    "--rho",
    type = float,
    default = 7950.0,
    required = False,
    help = "Density in kg/m^3"
)
parser.add_argument(
    "--t_melt",
    type = float,
    default = 1424.0 + 273.0,
    required = False,
    help = "Melting temperature in K"
)
parser.add_argument(
    "--absorptivity",
    type = float,
    default = 0.4,
    required = False,
    help = "Absorptivity of material"
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
    default = 5e-6,
    required = False,
    help = "Mesh resolution of simulation"
)
parser.add_argument(
    "--bound_x_start",
    type = float,
    default = 0.0,
    required = False,
    help = "Start bound for X of simulation"
)
parser.add_argument(
    "--bound_x_stop",
    type = float,
    default = 1000e-6,
    required = False,
    help = "Stop bound for X of simulation"
)
parser.add_argument(
    "--bound_y_start",
    type = float,
    default = -300e-6,
    required = False,
    help = "Start bound for Y of simulation"
)
parser.add_argument(
    "--bound_y_stop",
    type = float,
    default = 300e-6,
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
parser.add_argument("--verbose", type = bool, default = False, required = False)

args = parser.parse_args()

VERBOSE = args.verbose

##########
# Powers #
##########

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
cp = args.cp
k = args.k
rho = args.rho
t_melt = args.t_melt
absorptivity = args.absorptivity

# Machine Parameters
d_beam = args.d_beam

# Simulation Parameters
mesh_resolution = args.mesh_resolution
simulation_bounds = {
    "x": [args.bound_x_start, args.bound_x_stop],
    "y": [args.bound_y_start, args.bound_y_stop],
    "z": [args.bound_z_start, args.bound_z_stop],
}

###############
# Run Samples #
###############
material = args.material

power_velocity_widths_map = []
power_velocity_depths_map = []
power_velocity_lengths_map = []

for power in power_range:

    velocity_widths_map = []
    velocity_depths_map = []
    velocity_lengths_map = []

    for velocity in velocity_range:
        if VERBOSE: print(f"Power: {power} W, Velocity: {velocity}")
        _, widths, depths, lengths, times, thetas = run_sample(
            bc="temp",
            V=velocity,
            absorp=absorptivity,
            cp=cp,
            k=k,
            beamD=d_beam,
            rho=rho,
            P=power,
            melt_T=t_melt,
            resolution=mesh_resolution,
            bounds=simulation_bounds,
        )

        if VERBOSE: print(len(widths), len(depths), len(lengths), len(times), len(thetas))

        width = widths[-1]
        depth = depths[-1]
        length = lengths[-1]
        time = times[-1]
        theta = thetas[-1]

        simulation_data = {
            "args": [args.__dict__] * len(times),
            "width": widths,
            "depth": depths,
            "length": lengths,
            "time": times,
            "theta": thetas,
            "power": [power] * len(times),
            "velocity": [velocity] * len(times),
        }

        # Dataset.from_dict(simulation_data).push_to_hub(
        #     "baratilab/Eagar-Tsai",
        #     config_name = "simulations",
        #     split = f"m_{material}_p_{power}_v_{velocity}",
        #     commit_message = f"m_{material}_p_{power}_v_{velocity}_a_{absorptivity}"
        # )

        velocity_widths_map.append(width)
        velocity_depths_map.append(depth)
        velocity_lengths_map.append(length)

    power_velocity_widths_map.append(velocity_widths_map)
    power_velocity_depths_map.append(velocity_depths_map)
    power_velocity_lengths_map.append(velocity_lengths_map)

process_map_data = {
    "args": [args.__dict__],
    "widths": [power_velocity_widths_map],
    "depths": [power_velocity_depths_map],
    "lengths": [power_velocity_lengths_map],
    "powers": [power_range],
    "velocities": [velocity_range],
}

process_map_name = f"m_{material}_p_{power_start}_{power_stop}_{power_step}_v_{velocity_start}_{velocity_stop}_{velocity_step}_a_{absorptivity}"

Dataset.from_dict(process_map_data).push_to_hub(
    "baratilab/Eagar-Tsai",
    config_name = "process_maps",
    split = process_map_name,
    commit_message = process_map_name
)

