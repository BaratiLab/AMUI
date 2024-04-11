from eagartsai_amui.simulation.eagartsai import run_sample, run_baseline_sample
import numpy as np
import pandas as pd
import os
def save_sample(data_dict, 
              absorp = 0.4, 
              resolution = 5e-6, 
              material_name = None, 
              baseline_mode = True):
    """
    Saves the results of the Eagar-Tsai simulation based on the given parameters.

    Args:
        data_dict (dict): A dictionary containing the necessary data for the simulation.
        absorp (float, optional): The absorption coefficient of the material. Defaults to 0.4.
        resolution (float, optional): The resolution of the simulation. Defaults to 5e-6.
        material_name (str, optional): The name of the material. Defaults to None.
        baseline_mode (bool, optional): Whether to only save melt pools for P = 1, A = 1, that can be rescaled later.
    Returns:
        None
    """
    
    # Designed to fit a typical melt pool -- increase this as needed for very deep melt pools, at the cost of time
    # I've gotten away with using a domain depth (z) of 400e-6 for most melt pools, but 800e-6 may be necessary for very deep melt pools
    simulation_bounds = {'x': [-2000e-6, 5000e-6], 'y': [-1000e-6, 1000e-6], 'z': [-400e-6, 0]}
    file_path = os.path.abspath(__file__)
    folder_path = os.path.dirname(file_path)
    
    if baseline_mode:
        parent_folder = os.path.join(folder_path, '../output_data_baseline_melt_pool')
        child_folder = f'material_{material_name}/velocity_{data_dict["V"]}/'
    else:
        parent_folder = os.path.join(folder_path, '../output_data_full_melt_pool')

        child_folder = f'material_{material_name}/power_{data_dict["P"]}_velocity_{data_dict["V"]}/absorp_{absorp}/'
    output_folder = os.path.join(parent_folder, child_folder)
    print(f'Now running...{output_folder}')
    if baseline_mode:
        simulation = run_baseline_sample(bc='flux', 
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
            save = True, show = False, output_folder  = output_folder)
    
    else:
        simulation = run_sample(bc='flux', 
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
                save = True, show = False, output_folder  = output_folder)
    data_dict['resolution'] = resolution
    data_dict['absorp'] = absorp
    pd.DataFrame(data_dict, index = [0]).to_csv(output_folder + 'config.csv')

def main():
    data_dict = {}
    data_dict['cp'] = 470 # Specific Heat in J/kgK
    data_dict['k'] = 13.4 # Conductivity in W/m
    data_dict['rho'] = 7950 # Density in kg/m^3
    data_dict['melt T'] = 1424+273 # Melt Temperature in K
    data_dict['beam D'] = 100e-6 # Beam Diameter in m
    resolution = 5e-6 # Mesh Resolution of simulation -> lower is more accurate at the cost of computational time
    absorptivity = 0.4

    for P in [100, 200]:
        for V in [0.1, 0.3]:

            data_dict['P'] = P # Power in W
            data_dict['V'] = V # Laser Velocity in m/s

            save_sample(data_dict, 
                            absorptivity,
                            resolution = resolution, 
                            material_name='Ti64')
if __name__ == '__main__':
    main()
    