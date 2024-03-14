from eagartsai_amui.simulation.eagartsai import run_sample
def query_lof(data_dict, 
              hatch_spacing = 100e-6, 
              layer_thickness = 50e-6, 
              absorp = 0.4, 
              resolution = 5e-6, 
              save = False):
    print("HEREx1")
    # Designed to fit a typical melt pool -- increase this as needed for very deep melt pools, at the cost of time
    # I've gotten away with using a domain depth (z) of 400e-6 for most melt pools, but 800e-6 may be necessary for very deep melt pools
    simulation_bounds = {'x': [0, 1000e-6], 'y': [-300e-6, 300e-6], 'z': [-400e-6, 0]}


    meltpool = run_sample(bc='temp', 
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
    
    width, depth = meltpool.meltpool(calc_width = True, calc_length = False)
    if width == 0 or depth == 0:
        print("Warning: No melt pool formed")
    aspect_ratio_hw = (hatch_spacing/(width + 1e-10))**2
    aspect_ratio_ld = (layer_thickness/(depth + 1e-10))**2
    print(f"LoF criterion: {aspect_ratio_hw+aspect_ratio_ld}")
    return aspect_ratio_hw+aspect_ratio_ld > 1 # True -> LoF, False -> Desirable

data_dict = {}
data_dict['V'] = 0.1 # Laser Velocity in m/s
data_dict['cp'] = 470 # Specific Heat in J/kgK
data_dict['k'] = 13.4 # Conductivity in W/m
data_dict['beam D'] = 200e-6 # Beam Diameter in m
data_dict['rho'] = 7950 # Density in kg/m^3
data_dict['P'] = 100 # Power in W
data_dict['melt T'] = 1424+273 # Melt Temperature in K
resolution = 5e-6
hatch_spacing = 50e-6
layer_thickness = 50e-6
absorptivity = 0.4
print(query_lof(data_dict, 
                hatch_spacing, 
                layer_thickness, 
                absorptivity,
                resolution = 10e-6, 
                save = False)) # False