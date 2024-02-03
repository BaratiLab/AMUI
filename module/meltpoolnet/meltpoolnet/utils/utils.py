import pandas as pd 
import numpy as np
def select_material(csv, material):
    material_csv = csv.loc[csv['Material'] == material]

    return material_csv

def select_process(csv, process):
    process_csv = csv.loc[csv['Process'] == process]
    return process_csv

def select_subset(csv, feature, value):
    select_csv = csv.loc[csv[feature] == value]
    return select_csv


def extract_features(data_point, parameters, label):
    '''
    Given a sample in the dataset, determine if it has all of the features listed in parameters and a valid label
    If it does, return the data point as a single sample, if not, return -1
    
    Arguments:
    data_point: row of Pandas DataFrame
    parameters: list of strings
    label: string
    
    Returns:
    success: -1 if not all parameters found, 1 if all parameters found
    features: list of floats if all parameters found
    data_point[label]: float corresponding to the label of the datapoint
    '''
    
    features = []
    success = 0
    for parameter in parameters:
        
        if pd.isnull(data_point[parameter]) or pd.isnull(data_point[label]):
            success = -1
            return success, features, data_point[label]
        else:
            success = 1
            try:
                features.append(float(data_point[parameter]))
            except:
                success = -1
                return success, features, data_point[label]
    return success, features, data_point[label]
        
    
def select_parameters(new_csv, parameter_list, label_col):
    '''
    Select data with valid values for each parameter in parameter_list, and
    select the feature in label_col as the prediction feature
    
    Arguments:
    new_csv: data csv to be processed (Pandas DataFrame)
    parameter_list: list of strings corresponding to feature names
    label_col: string corresponding to feature name
    
    Returns:
    X: n x m numpy array of data features with n samples and m features
    y: n x 1 numpy array of data labels
    '''
    data_list = []
    label_list = []
    for i in range(len(new_csv)):
        success, features, label = extract_features(new_csv.iloc[i], parameter_list, label_col)
        
        if success < 0:
            continue
        else:
            data_list.append(features)
            label_list.append(label)
    X = np.array(np.squeeze(data_list))  
    
    y = np.array(label_list)
    
    return(X, y)

