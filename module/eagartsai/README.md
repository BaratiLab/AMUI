This program simulates the heat conduction induced by a moving heat source 
Dependencies: numba, scipy
Class: Eagar-Tsai implements collective strategy for solving heat source by arranging solutions of the ET equation
Function =  Graft: Paste new solution onto domain in the correct location
Function = Forward: Call necessary functions to move heat source for a given time, power and angle
Function = Check: Determine which boundary conditions are necessary
Function = Diffuse: Simulate conduction further away from the heat source as a gaussian blur
Function =  Meltpool: Calculate depth of meltpool 
Class: Solution implements ET solution for a short distance
Class: Corner solution - Boundary condition where heat source reaches two different walls
Class: Edge solution - Boundary condition where heat source reaches a single wall
Certain functions are accelerated with numba and call helper functions (which are indicated with an underscore, e.g. "_solve()")

#### To Query the LoF boundary
The function ```query_lof``` within query_lof_ET.py will return a boolean value indicating the Lack-of-Fusion boundary corresponding to a specific power-velocity combination. Take care to correctly specify the material properties, and modify the simulation domain if needed (i.e., if simulating melt pools deeper than 400 microns, make sure the z-bound is at least 800 microns deep). To visually see the simulation, set the `save` argument to True. 

The `simulation` folder contains all the code to calculate the Eagar-Tsai solution.