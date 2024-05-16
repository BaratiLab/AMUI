import numpy as np
import re
from mendeleev import element as elem
import pandas as pd

print("Creating list of elements from periodic table...")
elements = [elem(i+1).symbol for i in range(117)]
print("Done")

orbitals = {"s1": 0, "s2": 1, "p1": 2, "p2": 3, "p3": 4, "p4": 5, "p5": 6, "p6": 7, "d1": 8, "d2": 9, "d3": 10, "d4": 11,
            "d5": 12, "d6": 13, "d7": 14, "d8": 15, "d9": 16, "d10": 17, "f1": 18, "f2": 19, "f3": 20, "f4": 21,
            "f5": 22, "f6": 23, "f7": 24, "f8": 25, "f9": 26, "f10": 27, "f11": 28, "f12": 29, "f13": 30, "f14": 31}

groups = ['IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIIIB',
          'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA']

group_dict = {}
k = 0
for group in groups:
    group_dict[group] = k
    k += 1
#print(orbitals)
hv = np.zeros(shape=(32, 1))
hvs = {}

for key in elements:
    element = key
    hv = np.zeros(shape=(32, 1))
    #hvs[element] = hv
    #print('-----')

    #print(key)
    
    if element != 'H':
        s = elem(element).ec.get_valence().to_str()
    #print("S:",s)

    
    #print("SP:",sp)
    if key == "H":
        hv[0] = 1
    if key != "H":
        sp = (re.split('(\s+)', s))
        for j in range(0, len(sp)):
            if sp[j] != ' ' and sp[j]!= '':
                #a = re.findall('.{1,2}', sp[j])
                n = sp[j][:1]
                orb = sp[j][1:]
                #print(n,orb)
                hv[orbitals[orb]] = 1
    hvs[element] = hv

    
def barcode(element):
     # Calculate orbital features

    s_orbital = np.reshape(hvs[element][:2], len(hvs[element][:2]))
    p_orbital = np.reshape(hvs[element][2:8], len(hvs[element][2:8]))
    d_orbital = np.reshape(hvs[element][8:18], len(hvs[element][8:18]))
    f_orbital = np.reshape(hvs[element][18:], len(hvs[element][18:]))

    orbitals = [s_orbital, p_orbital, d_orbital, f_orbital]
    orbital_info = []
    for orbital in orbitals:
        if np.sum(orbital) < 1:
            # if empty, put 0
            sum_orbital = 0
            orbital_info.append(sum_orbital)
        else:
            sum_orbital = np.where(orbital > 0)[0][0]
            orbital_info.append(sum_orbital)
    return orbital_info


csv = pd.read_csv('meltpoolgeometry.csv')
atomic_features = []
for col in csv.columns:
   # print('%' in col)
    if '%' in col:
        atomic_features.append(col)
# atomic_features
barcode(element)
element_list = [atom.split(' (')[0].split(' ')[0] for atom in atomic_features]


def element_from_feature(feature):
    return feature.split(' (')[0].split(' ')[0]


def atomic_featurize(element_list, element_comps):
    # takes in list of elements, produces features for each element
    result = []
    group_avg = 0
    period_avg = 0
    atomic_number_avg = 0
    eneg_avg = 0
    ele_avg = 0
    ionenergy_avg = 0
    orbits_avg = [0, 0, 0, 0]
    fusion_heat_avg = 0
    electron_affin_avg = 0
    rad_avg = 0
    atom_vol_avg = 0
    sum_comp = 0
    idx = 0
    for element in element_list:
        
        #composition
        comp = element_comps[idx]
        sum_comp += comp * 0.01
        
        # Define element object in mendeleev
        el_obj = elem(element)

        atomic_number = el_obj.atomic_number * comp * 0.01

        eneg = el_obj.electronegativity(scale='pauling')  * comp * 0.01      

        ele = el_obj.electrons * comp * 0.01

        # get first ionization energy
        key = np.min([key for key in el_obj.ionenergies.keys()])
        ionenergy = el_obj.ionenergies[key] * comp * 0.01
        
        # Heat of fusion
        fusion_heat = el_obj.fusion_heat * comp * 0.01

        # Electron affinity
        electron_affin = el_obj.electron_affinity
        if electron_affin is None:
           # breakpoint()
            electron_affin = 0
        else:
            electron_affin = electron_affin * comp * 0.01

        
        # Metalic radius
        rad = el_obj.metallic_radius * comp * 0.01
        
        # Atomic volume
        atom_vol = el_obj.atomic_volume * comp * 0.01

        idx = idx + 1
        
        atomic_number_avg += atomic_number
        eneg_avg += eneg
        ele_avg += ele
        ionenergy_avg += ionenergy
        fusion_heat_avg += fusion_heat
        electron_affin_avg += electron_affin
        rad_avg += rad
        atom_vol_avg += atom_vol 
   
    result.extend([atomic_number_avg, eneg_avg, rad_avg, ele_avg,
                   atom_vol_avg, electron_affin_avg, ionenergy_avg, fusion_heat_avg])
    
    # divided by the sum of composition
    for i in range(len(result)):
        result[i] = result[i] / sum_comp

    return result

def test_csv():
    # get features for the entire dataset
    all_atomic_features = []
    length_alloys = []
    for i in range(len(csv)):

        # iterate over datapoints
        elem_names = []
        elem_comps = []
        for feature in atomic_features:
            # iterate over elements to find non-zero entries
            comp = csv.iloc[i][feature]

            try:
                alloy_elem = float(comp)
            except:

                alloy_elem = 0
            if alloy_elem > 0:
                elem_names.append(feature)
                elem_comps.append(alloy_elem)

        # sort by composition
        elem_sort_idx = np.argsort(elem_comps)[::-1][:6]
        elem_sort_names = np.array(elem_names, dtype='object')[elem_sort_idx]
        elem_sort_comps = np.array(elem_comps)[elem_sort_idx]
        length_alloys.append(len(elem_comps))
        # get features for each of the three elements
        elem_features = [element_from_feature(el) for el in elem_sort_names]
        features = atomic_featurize(elem_features, elem_sort_comps)
        if i % 100 == 0:
            print("sample feature ", atomic_featurize(elem_features, elem_sort_comps))

        all_atomic_features.append(features)
    return np.array(all_atomic_features)

def featurize_datapoint(csv, index):
    # get features for a single data point
    elem_names = []
    elem_comps = []
    
    for feature in atomic_features:
        # iterate over elements to find non-zero entries
        comp = csv.iloc[index][feature]

        try:
            alloy_elem = float(comp)
        except:

            alloy_elem = 0
        if alloy_elem > 0:
            elem_names.append(feature)
            elem_comps.append(alloy_elem)

    #print(len(elem_comps))
    # sort by composition
    elem_sort_idx = np.argsort(elem_comps)[::-1][:6]
    
    elem_sort_names = np.array(elem_names, dtype='object')[elem_sort_idx]
    elem_sort_comps = np.array(elem_comps)[elem_sort_idx]

    # get features for each of the three elements
    elem_features = [element_from_feature(el) for el in elem_sort_names]
    all_features = atomic_featurize(elem_features, elem_sort_comps)

    return all_features

def atomic_featurize_rp(element_list, element_comps):
    # takes in list of elements, produces features for each element
    result = []
    den_avg = 0
    meltT_avg = 0
    specheat_avg = 0
    k_avg = 0
    sum_comp = 0
    idx = 0
    for element in element_list:
        
        #composition
        comp = element_comps[idx]
        sum_comp += comp * 0.01
        # Define element object in mendeleev
        el_obj = elem(element)
        
        # Density
        den = el_obj.density * comp * 0.01
        # melting temperature
        meltT = el_obj.melting_point * comp * 0.01

        # Specific heat
        specheat = el_obj.specific_heat * comp * 0.01
        
        # Thermal conductivity
        k = el_obj.thermal_conductivity
        if k == None:
            k = 0
        else:
            k = k * comp * 0.01
        
        
        den_avg += den
        meltT_avg += meltT
        specheat_avg += specheat
        k_avg += k
        
    result.extend([den_avg, meltT_avg, specheat_avg, k_avg])
    
    for i in range(len(result)):
        result[i] = result[i] / sum_comp

    return result

def featurize_datapoint_rp(csv, index):
    # get features for a single data point
    elem_names = []
    elem_comps = []
    
    for feature in atomic_features:
        # iterate over elements to find non-zero entries
        comp = csv.iloc[index][feature]

        try:
            alloy_elem = float(comp)
        except:

            alloy_elem = 0
        if alloy_elem > 0:
            elem_names.append(feature)
            elem_comps.append(alloy_elem)

    #print(len(elem_comps))
    # sort by composition
    elem_sort_idx = np.argsort(elem_comps)[::-1][:6]
    
    elem_sort_names = np.array(elem_names, dtype='object')[elem_sort_idx]
    elem_sort_comps = np.array(elem_comps)[elem_sort_idx]

    # get features for each of the three elements
    elem_features = [element_from_feature(el) for el in elem_sort_names]
    all_features = atomic_featurize_rp(elem_features, elem_sort_comps)

    return all_features


def convert_elements(csv, index, num_atoms = 3):
    # get features for a single data point
    elem_names = []
    elem_comps = []
    
    for feature in atomic_features:
        # iterate over elements to find non-zero entries
        comp = csv.iloc[index][feature]

        try:
            alloy_elem = float(comp)
        except:

            alloy_elem = 0
        if alloy_elem > 0:
            elem_names.append(feature)
            elem_comps.append(alloy_elem)

    return len(elem_comps)
