
#### To Query the LoF boundary
The function ```query_lof``` within query_lof_ET.py will return a boolean value indicating the Lack-of-Fusion, Keyhole, and Balling conditions for a specific power-velocity combination. Take care to correctly specify the material properties, and modify the simulation domain if needed (i.e., if simulating melt pools deeper than 400 microns, make sure the z-bound is at least 800 microns deep). To visually see the simulation, set the `save` argument to True. 
#### Other
The `simulation` folder contains all the code to calculate the Eagar-Tsai solution.