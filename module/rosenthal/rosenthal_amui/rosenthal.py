import numpy as np
import matplotlib.pyplot as plt
def calculate_width(data_dict, absorp = 0.5):
    '''
    Calculate width of Rosenthal equation using analytical solution
    '''
    absorp = absorp
    P = data_dict['P']
    rho = data_dict['rho'] 
    Cp = data_dict['cp']
    k = data_dict['k']
    V = data_dict['V']
    deltaT= data_dict['melt T'] - 293
    term1 = absorp*P/(rho*Cp*V*deltaT)*(8/(np.pi*np.exp(1)))
    # print(np.sqrt(term1)*1e6)
    width = np.sqrt(term1)
    return width
def run_rosenthal(data_dict, absorp =0.4):
    '''
    Simulate rosenthal equation given processing parameters
    '''
    absorp = absorp
    P = data_dict['P'] # W
    rho = data_dict['rho'] # kg/m^3 
    Cp = data_dict['cp'] # J/kgK
    k = data_dict['k']# W/mK
    V = data_dict['V'] # m/s
    deltaT= data_dict['melt T'] - 293 # K
    # x = np.linspace()
    dimstep = 5e-6 # m
    b = 200e-6 # m
    xs = np.arange(-500e-6, 500e-6 ,step = dimstep)
    ys = np.arange(-100e-6 - b, 100e-6 + b , step = dimstep)
    zs = np.arange(-400e-6, 0 + dimstep, step = dimstep)
    alpha = k/(rho*Cp)
    x, y, z = np.meshgrid(xs, ys, zs, indexing='ij')
    r = np.sqrt(x**2 + y**2 + z**2)
    temp = 293 + (absorp*P/(2*np.pi*k*r))*np.exp(-(V*(r+x))/(2*alpha))
    return temp

def calc_dimensions(meltpool, mesh_size = 5e-6, verbose = False):
    '''
    Calculate dimensions of melt pool given thermal distribution
    '''
    binarized = meltpool > 1923
    indices_binarized = np.where(binarized)
    width = mesh_size*(np.max(indices_binarized[1]) - np.min(indices_binarized[1]))
    if verbose:
        print("Width = {:.05} microns".format(width*1e6))
    depth = mesh_size*(binarized.shape[2] - np.min(indices_binarized[2]))
    if verbose:
        print("Depth = {:.05} microns".format(depth*1e6))
    length = mesh_size*(np.max(indices_binarized[0]) - np.min(indices_binarized[0]))
    # breakpoint()
    return width, depth, length
def query_defect(data_dict, hatch_spacing = 100e-6, layer_thickness = 50e-6, absorp = 0.4, verbose = False):
    """
    Calculates the aspect ratio of a melt pool and determines if it meets the criterion for a defect.

    Args:
        data_dict (dict): A dictionary containing the data for the melt pool.
        hatch_spacing (float, optional): The spacing between hatch lines in meters. Defaults to 100e-6.
        layer_thickness (float, optional): The thickness of each layer in meters. Defaults to 50e-6.
        absorp (float, optional): The absorptivity of the material. Defaults to 0.4.
        verbose (bool, optional): If True, prints detailed information. Defaults to False.

    Returns:
        float: The sum of the aspect ratios (h/w) and (l/d).

    """

    if verbose:
        print(f"Hatch Spacing: {hatch_spacing*1e6} microns")
        print(f"Layer Thickness: {layer_thickness*1e6} microns")
        print(f"Absorptivity: {absorp}")

    meltpool = run_rosenthal(data_dict, absorp  = absorp)
    width,depth, length = calc_dimensions(meltpool, mesh_size=5e-6)
    if verbose:
        print("Melt Pool Width: {:.05} microns".format(width*1e6))
        print("Melt Pool Depth: {:.05} microns".format(depth*1e6))
    aspect_ratio_hw = (hatch_spacing/width)**2
    aspect_ratio_ld = (layer_thickness/depth)**2
    if verbose:
        print("Aspect Ratio (h/w): {:.05}".format(aspect_ratio_hw))
        print("Aspect Ratio (l/d): {:.05}".format(aspect_ratio_ld))
        print(f'Total Criterion: {aspect_ratio_hw+aspect_ratio_ld}')
        print(f'LoF Condition Met?: {"Yes" if not (aspect_ratio_hw+aspect_ratio_ld) < 1 else "No"}')
    lof_condition = aspect_ratio_hw+aspect_ratio_ld
    balling_condition = length/width
    keyhole_condition = width/depth
    return lof_condition > 1, balling_condition > 2.3, keyhole_condition < 1.5  # True -> Defect, False -> Desirable
def pv_grid(bounds = {'Power': [100, 500], 'Velocity': [0.1, 1]}, steps = {'Power': 10, 'Velocity': 10}): 
    """
    Generate a power-velocity grid and plot the level of fusion (LOF) contour.

    Args:
        bounds (dict): A dictionary specifying the lower and upper bounds for power and velocity.
            Example: {'Power': [100, 500], 'Velocity': [0.1, 1]}
        steps (dict): A dictionary specifying the number of steps for power and velocity.
            Example: {'Power': 10, 'Velocity': 10}

    Returns:
        None
    """
    
    data_dict = {}
    data_dict['V'] = 1#0.4
    data_dict['cp'] = 470 #546
    data_dict['k'] = 13.4
    data_dict['rho'] = 7950
    data_dict['P'] = 280
    data_dict['melt T'] =1700
    hatch_spacing = 50e-6
    layer_thickness = 50e-6
    power = np.linspace(bounds['Power'][0], bounds['Power'][1], steps['Power'])
    velocity = np.linspace(bounds['Velocity'][0], bounds['Velocity'][1], steps['Velocity'])
    grid_xx, grid_yy = np.meshgrid(power, velocity)
    # print(grid.shape)
    lof_grid = np.zeros_like(grid_xx)
    for i, p in enumerate(power):
        for j, v in enumerate(velocity):
            data_dict['P'] = p
            data_dict['V'] = v
            lof_grid[i,j] = query_defect(data_dict, hatch_spacing = 100e-6, layer_thickness = 50e-6, absorp = 0.4, verbose = False)[0]
    plt.contour(grid_xx, grid_yy, lof_grid, levels = [1])
    plt.imshow(lof_grid, cmap = 'viridis')
    plt.show()
        
    # query_lof(data_dict, hatch_spacing = 100e-6, layer_thickness = 50e-6, absorp = 0.4, verbose = False)
    # return power, velocity
def main():
    '''
    Test rosenthal simulation
    '''
    # pv_grid()
    data_dict = {}
    data_dict['V'] = 1#0.4
    data_dict['cp'] = 470 #546
    data_dict['k'] = 13.4
    data_dict['rho'] = 7950
    data_dict['P'] = 280
    data_dict['melt T'] =1700
    hatch_spacing = 50e-6
    layer_thickness = 50e-6
    print("Analytical width: {:.05} microns".format(1e6*calculate_width(data_dict=data_dict)))
    meltpool = run_rosenthal(data_dict, absorp  = 0.4)
    width,depth, length = calc_dimensions(meltpool, mesh_size=5e-6)
    print("Melt Pool Width: {:.05} microns".format(width*1e6))
    print("Melt Pool Depth: {:.05} microns".format(depth*1e6)) 
    aspect_ratio_hw = (hatch_spacing/width)**2
    aspect_ratio_ld = (layer_thickness/depth)**2
    keyhole_criterion = width/depth
    balling_criterion = length/width
    print("Keyhole Criterion: {:.05}".format(keyhole_criterion))
    print("Balling Criterion: {:.05}".format(balling_criterion))

    print("Aspect Ratio (h/w): {:.05}".format(aspect_ratio_hw))
    print("Aspect Ratio (l/d): {:.05}".format(aspect_ratio_ld))
    print(f'Total Criterion: {aspect_ratio_hw+aspect_ratio_ld}')
    print(f'LoF Condition Met?: {"Yes" if not (aspect_ratio_hw+aspect_ratio_ld) < 1 else "No"}')
    print(f'Keyhole Condition Met?: {"Yes" if not keyhole_criterion > 1.5 else "No"}')
    print(f'Balling Condition Met?: {"Yes" if balling_criterion > 2.3 else "No"}')

    # print(f'Keyhole Condition Met?')

if __name__ == "__main__":
    main()