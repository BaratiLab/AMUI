from eagartsai_amui.simulation.eagartsai import run_sample
import numpy as np
def query_defects(data_dict, 
              hatch_spacing = 100e-6, 
              layer_thickness = 50e-6, 
              absorp = 0.4, 
              resolution = 5e-6, 
              save = False):
    """
    Calculates and evaluates the likelihood of defects in a 3D printing process based on the given parameters.

    Args:
        data_dict (dict): A dictionary containing the necessary data for the simulation.
        hatch_spacing (float, optional): The spacing between hatch lines in the printing process. Defaults to 100e-6.
        layer_thickness (float, optional): The thickness of each layer in the printing process. Defaults to 50e-6.
        absorp (float, optional): The absorption coefficient of the material. Defaults to 0.4.
        resolution (float, optional): The resolution of the simulation. Defaults to 5e-6.
        save (bool, optional): Flag indicating whether to save the simulation results. Defaults to False.

    Returns:
        tuple: A tuple containing three boolean values indicating the likelihood of defects:
            - True if the likelihood of defects is high (LoF), False otherwise.
            - True if the keyhole condition is met, False otherwise.
            - True if the balling condition is met, False otherwise.
    """
    
    # Designed to fit a typical melt pool -- increase this as needed for very deep melt pools, at the cost of time
    # I've gotten away with using a domain depth (z) of 400e-6 for most melt pools, but 800e-6 may be necessary for very deep melt pools
    simulation_bounds = {'x': [0, 1000e-6], 'y': [-300e-6, 300e-6], 'z': [-400e-6, 0]}


    simulation = run_sample(bc='temp', 
               V=data_dict['V'], 
               absorp=absorp, 
               cp=data_dict['cp'], 
               k=data_dict['k'], 
               beamD=data_dict['beam D'], 
               rho=data_dict['rho'],  
               P=data_dict['P'],
               melt_T=data_dict['melt T'],
               resolution=resolution,
               bounds=simulation_bounds,
               save = save)
    
    width, length, depth = simulation.meltpool(calc_width = True, calc_length = True)
    depth = np.abs(depth)
    if width == 0 or depth == 0:
        print("Warning: No melt pool formed")
    aspect_ratio_hw = (hatch_spacing/(width + 1e-10))**2
    aspect_ratio_ld = (layer_thickness/(depth + 1e-10))**2
    print(f"LoF criterion: {aspect_ratio_hw+aspect_ratio_ld}")
    keyhole_criterion = width/depth
    balling_criterion = length/width
    print("Keyhole Criterion: {:.05}".format(keyhole_criterion))
    print("Balling Criterion: {:.05}".format(balling_criterion))

    print("Aspect Ratio (h/w): {:.05}".format(aspect_ratio_hw))
    print("Aspect Ratio (l/d): {:.05}".format(aspect_ratio_ld))
    print(f'Total LoF Criterion: {aspect_ratio_hw+aspect_ratio_ld}')
    print(f'LoF Condition Met?: {"Yes" if not (aspect_ratio_hw+aspect_ratio_ld) < 1 else "No"}')
    print(f'Keyhole Condition Met?: {"Yes" if not keyhole_criterion > 1.5 else "No"}')
    print(f'Balling Condition Met?: {"Yes" if balling_criterion > 2.3 else "No"}')
    return aspect_ratio_hw+aspect_ratio_ld > 1, keyhole_criterion < 1.5, balling_criterion > 2.3 # True -> LoF, False -> Desirable

data_dict = {}
data_dict['P'] = 100 # Power in W
hatch_spacing = 50e-6
layer_thickness = 50e-6
data_dict['V'] = 0.1 # Laser Velocity in m/s


data_dict['cp'] = 470 # Specific Heat in J/kgK
data_dict['k'] = 13.4 # Conductivity in W/m
data_dict['rho'] = 7950 # Density in kg/m^3
data_dict['melt T'] = 1424+273 # Melt Temperature in K
absorptivity = 0.4


data_dict['beam D'] = 100e-6 # Beam Diameter in m
resolution = 5e-6 # Mesh Resolution of simulation -> lower is more accurate at the cost of computational time
print(query_defects(data_dict, 
                hatch_spacing, 
                layer_thickness, 
                absorptivity,
                resolution = 5e-6, 
                save = True)) # False