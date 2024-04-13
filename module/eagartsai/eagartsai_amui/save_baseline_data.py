from eagartsai_amui.simulation.eagartsai import run_sample
import numpy as np
import pandas as pd
import os
from eagartsai_amui.save_data import save_sample


material_properties = pd.read_csv('../material_properties/final_merged_alloys.csv')
additive_net = pd.read_csv('../material_properties/meltpoolgeometry.csv')


data_dict = {}
for material in ['SS316L', 'Ti-6Al-4V']:
    row = material_properties[material_properties['material'] == material]
    additive_net_row = additive_net[additive_net['Material'] == material]
    data_dict['cp'] = float(row['specific_heat_capacity_j_kg_k'])
    data_dict['k'] = float(row['thermal_conductivity_w_m_k'])
    data_dict['rho'] = float(row['density_g_cm_3'])*1000 # Density in kg/m^3
    data_dict['melt T'] = float(additive_net_row['melting T'].iloc[0]) # Melt Temperature in K
    data_dict['beam D'] = 100e-6 # Beam Diameter in m
    resolution = 10e-6 # Mesh Resolution of simulation -> lower is more accurate at the cost of computational time
    absorptivity = 1
    data_dict['P'] = 1 # Power in W

    for V in [0.1, 0.3]:

        data_dict['V'] = V # Laser Velocity in m/s

        save_sample(data_dict, 
                    absorptivity,
                    resolution = resolution, 
                    material_name=material,
                    baseline_mode=True)