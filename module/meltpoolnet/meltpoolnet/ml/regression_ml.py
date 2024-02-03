
import numpy as np
from matplotlib import pyplot as plt
from pylab import * # For adjusting frame width only
from sklearn.model_selection import train_test_split
import sklearn.gaussian_process as gp 
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import Lasso
from sklearn.utils import shuffle
from sklearn.linear_model import Ridge 
from sklearn.model_selection import KFold
from sklearn.neural_network import MLPRegressor
from sklearn import metrics
from meltpoolnet.utils.plotting_utils import frame_tick


def learn(data, 
        depth, 
        material = None, 
        parameters = None, 
        title = None, 
        plot = False, 
        materials_ohe = None, 
        paper_ID= None, 
        elemental_features = None,
        dpi = 300, 
        model_name = 'all'):
    
    '''
    
    
    Iterate over the models, performing training/cross-validation and plotting regression results

    
    Arguments:
    data: Matrix array of data, n samples x m features, numpy array
    depth: vector of depth values, n samples x 1 feature, numpy array
    
    (Optional, only displayed on figure)
    material: Material that is trained on (string)
    parameters: parameters contained in data (list of strings)
    title: Any additional information (e.g. process, paper ID) to be specified (string)
    plot: Whether to produce plots
    
    Returns:
    fit_models: List of fit models
    train_accuracy: List of CV Pearson R^2
    train_accuracy_std: List of standard deviation of Pearson R^2
    test_accuracy: List of test Pearson R^2
    test_accuracy_std: List of standard deviation of Pearson R^2
    model_name: Name of the model used (string)
   
    
    
    '''
    
    labels = depth

    params = { #'font.family'      : 'serif',
               'font.size'        : 12,
               'xtick.labelsize'  : 'small',
               'ytick.labelsize'  : 'small',
               #'axes.labelsize'   : 'large',
               'axes.linewidth'   : 1.3 }
    plt.rcParams.update(params)


    y  = labels
    X = data
    
    # transpose if shape of label and data do not match
    if len(X) != len(labels):
        X = X.T
        print(len(labels), len(X))
        print('transposed to ' + str(X.shape[0]) + ', ' + str(X.shape[1]))
        
    # If elemental feautures are provided, append it
    if elemental_features is not None:
        try:
            X = np.hstack((X, elemental_features))
            
        except:
            breakpoint()  
    idx_normalize = len(X[0])
    # If material one hot encoding info is provided, append it
    if materials_ohe is not None:
        X = np.hstack((X, materials_ohe))
    
            
        
    fit_models = []
    train_accuracy = []
    train_accuracy_std = []
    test_accuracy = []
    test_accuracy_std = []
    if model_name == 'all':
        model_list = ['RF', 'GPR', 'SVR', 'Ridge', 'Lasso', 'GB', 'NN']
    else:
        model_list = [model_name]
    
    # Iterate over implemented models
    for modeltoggle in model_list:

        if modeltoggle == 'RF':
            model = RandomForestRegressor(n_estimators = 500,random_state = 0)
            
        elif modeltoggle == 'GPR':
            kernel = gp.kernels.ConstantKernel(1.0, (1e-1, 1e3))*gp.kernels.RBF(1.0, (1e-3, 1e3))
            
            model = gp.GaussianProcessRegressor(kernel = kernel, n_restarts_optimizer = 10, alpha = 0.5, normalize_y = True)
            
        elif modeltoggle == 'SVR':
            model = SVR()
        elif modeltoggle == 'Ridge':
            model = Ridge(alpha = 0.1)

        elif modeltoggle == 'Lasso':
            model = Lasso(alpha = 0.1)
            #model = Lasso()
        elif modeltoggle == 'GB':
            model = GradientBoostingRegressor()
        elif modeltoggle == 'NN':
             model = MLPRegressor(hidden_layer_sizes=(256, 256, 512), activation='relu', solver='adam', alpha=0.002, max_iter = 20000)
       
        
        # Perform cross validation for each model
        kf = KFold(n_splits=5)
        trains = []
        tests = []
        train_maes = []
        test_maes = []
        # Perform cross validation for each model
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
        for train, test in kf.split(X_train):
            
            
            # Shuffle data points before prediction
            X_shuffle, y_shuffle = shuffle(X_train, y_train, random_state=0)

            X_cv_train_before = X_shuffle[train]
            X_cv_test_before = X_shuffle[test]
            y_cv_train_before = y_shuffle[train]
            y_cv_test_before = y_shuffle[test]
            
            
            # Rescale the data to fit standard normal distribution
            # data is rescaled on indices before idx_normalize because indices after may include one-hot-encoded data
            X_train_cv_firsthalf = (X_cv_train_before[:,:idx_normalize] - np.mean(X_cv_train_before[:,:idx_normalize], axis = 0))/(np.std(X_cv_train_before[:,:idx_normalize], axis = 0) + 1e-10)
            X_test_cv_firsthalf = (X_cv_test_before[:,:idx_normalize] - np.mean(X_cv_train_before[:,:idx_normalize], axis = 0))/(np.std(X_cv_train_before[:,:idx_normalize], axis = 0) + 1e-10)
            y_train_cv = (y_cv_train_before - np.mean(y_cv_train_before))/(np.std(y_cv_train_before) + 1e-10)
            y_test_cv = (y_cv_test_before - np.mean(y_cv_train_before))/(np.std(y_cv_train_before) + 1e-10)
            
            # put normalized numerical data with categorical data if present
            X_train_cv = np.hstack((X_train_cv_firsthalf, X_cv_train_before[:, idx_normalize:]))
            X_test_cv = np.hstack((X_test_cv_firsthalf, X_cv_test_before[:, idx_normalize:]))
                
            model.fit(X_train_cv, y_train_cv)
            
            # Calculate MAE and R^2
            
            y_predtrain = model.predict(X_train_cv)
            y_predtest = model.predict(X_test_cv)

            trains.append(model.score(X_train_cv, y_train_cv))
            tests.append(model.score(X_test_cv, y_test_cv))

            
            y_test_pred = model.predict(X_test_cv)
            y_original_scaled = y_test_cv*np.std(y_cv_train_before)+np.mean(y_cv_train_before)
            pred_original_scaled = y_predtest*np.std(y_cv_train_before)+np.mean(y_cv_train_before)
            mae_test = metrics.mean_absolute_error(y_original_scaled, pred_original_scaled)

            y_train_pred = model.predict(X_train_cv)
            train_y_original_scaled = y_train_cv*np.std(y_cv_train_before)+np.mean(y_cv_train_before)
            train_pred_original_scaled = y_predtrain*np.std(y_cv_train_before)+np.mean(y_cv_train_before)
            
            
            mae_train = metrics.mean_absolute_error(train_y_original_scaled, train_pred_original_scaled)
            train_maes.append(mae_train)
            test_maes.append(mae_test)
            
        # Aggregate information
        trains = np.array(trains)
        tests = np.array(tests)
        train_maes = np.array(train_maes)
        test_maes = np.array(test_maes)
        r2_mean = tests.mean()
        r2_std = tests.std()
        r2_train_mean = trains.mean()
        r2_train_std =  trains.std()
        
        
        
        mae_mean_train = train_maes.mean()
        mae_mean_test = test_maes.mean()
        
        mae_mean_train_std = train_maes.std()
        mae_mean_test_std = test_maes.std()
        
        train_accuracy.append(r2_train_mean)
        test_accuracy_std.append(r2_std)
        test_accuracy.append(r2_mean)
        train_accuracy_std.append(r2_train_std)
     
        print(modeltoggle, ' Train R^2: {:.5f} ± {:.5f}, Test R^2: {:.5f} ± {:.5f}'.
                format( r2_train_mean, r2_train_std, r2_mean, r2_std))

        # Plot results: everything scaled back to original values by multiplying by std and adding mean of training labels
        if plot:
            fig = plt.figure(figsize = [4,3], dpi = dpi)
            plt.plot(np.sort(y_test_cv)*np.std(y_cv_train_before)+np.mean(y_cv_train_before), y_predtest[np.argsort(y_test_cv)]*np.std(y_cv_train_before)+np.mean(y_cv_train_before), 'r.', ms = 6)
            plt.plot(np.arange(-4*np.std(y_cv_train_before)+np.mean(y_cv_train_before), 4*np.std(y_cv_train_before)+np.mean(y_cv_train_before)), np.arange(-4*np.std(y_cv_train_before)+np.mean(y_cv_train_before),4*np.std(y_cv_train_before)+np.mean(y_cv_train_before)), 'k-')
            plt.xticks(fontsize = 8)
            plt.yticks(fontsize = 8)
        
        
# Uncomment this to display parameters on figure
#         if material is None:
#             label = "Parameters: " + '\n'
#             for parameter in parameters:
#                 paramstring = "•" + parameter+ '\n'
#                 label += paramstring
       
            plt.title(modeltoggle + " - Test Set: "+ str(title))
            plt.xlabel("Actual Melt Pool Depth")
            plt.ylabel("Predicted Melt Pool Depth")
            s_cv =  'Test CV $R^2$: {:.3f} ± {:.3f}'.format(r2_mean, r2_std)
            plt.text(50, 2*np.std(y_cv_train_before)+np.mean(y_cv_train_before), s_cv, fontsize=8)
            s =  'Test $MAE$: {:.3f}'.format(mae_mean_test)
            plt.text(50, 2.5*np.std(y_cv_train_before)+np.mean(y_cv_train_before), s, fontsize=10)

            plt.ylim(0, 3*np.std(y_cv_train_before)+np.mean(y_cv_train_before))
            plt.xlim(0, 3*np.std(y_cv_train_before)+np.mean(y_cv_train_before))

            plt.gca().set_aspect('equal')
            frame_tick()
           # savefig(title+modeltoggle + "test"+".png")
            plt.show()
            plt.clf()

            fig = plt.figure(figsize = [4,3], dpi = dpi)
            plt.plot(np.sort(train_y_original_scaled), train_pred_original_scaled[np.argsort(train_y_original_scaled)], 'r.', ms = 6)
            plt.plot(np.arange(-4*np.std(y_cv_train_before)+np.mean(y_cv_train_before), 4*np.std(y_cv_train_before)+np.mean(y_cv_train_before)), np.arange(-4*np.std(y_cv_train_before)+np.mean(y_cv_train_before),4*np.std(y_cv_train_before)+np.mean(y_cv_train_before)), 'k-')
            plt.xlabel("Actual Melt Pool Depth")
            plt.ylabel("Predicted Melt Pool Depth")
            plt.title(modeltoggle + " - Train Set: "+ str(title))
            s_cv =  'Train CV $R^2$: {:.3f} ± {:.3f}'.format(r2_train_mean, r2_train_std)
            plt.text(50, 2*np.std(y_cv_train_before)+np.mean(y_cv_train_before), s_cv, fontsize=8)

            
# Uncomment this to display parameters on figure           
            
#         if material is None:
#             label = "Parameters: " + '\n'
#             for parameter in parameters:
#                 paramstring = "•" + parameter+ '\n'
#                 label += paramstring
        #plt.text(1, -2.5, label, fontsize = 6)
    
     
            r2_train = model.score(X_train_cv, y_train_cv)
            s =  'Train $MAE$: {:.3f}'.format(mae_mean_train)
            plt.ylim(0, 3*np.std(y_cv_train_before)+np.mean(y_cv_train_before))
            plt.xlim(0, 3*np.std(y_cv_train_before)+np.mean(y_cv_train_before))
            plt.text(50, 2.5*np.std(y_cv_train_before)+np.mean(y_cv_train_before), s, fontsize=10)


            plt.gca().set_aspect('equal')
            frame_tick()

          #  savefig(title+modeltoggle + "train"+".png")
            plt.show()
            plt.clf()
        fit_models.append(model)
    return fit_models, train_accuracy, train_accuracy_std, test_accuracy, test_accuracy_std 