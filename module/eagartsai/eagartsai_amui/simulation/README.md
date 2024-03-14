### General
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
