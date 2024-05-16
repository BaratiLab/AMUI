from matplotlib import pyplot as plt
import numpy as np
import sklearn.gaussian_process as gp 
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.utils import shuffle
from sklearn.model_selection import KFold
from sklearn.neural_network import MLPClassifier


def classify_learn(data, labels, label_names, material = None, parameters = None,  materials_ohe = None, title = None, plot = False, prefix = None, elemental_features = None, parameter_list = None, model_name = 'all'):
    
    '''
    
    
    
   Iterate over the models, performing training/cross-validation and plotting confusion matrices

    
    Arguments:
    data: Matrix array of data, n samples x m features, numpy array
    labels: vector of defect labels, n samples x 1 feature, numpy array
    label_names: string label of each class
    
    (Optional, only displayed on figure)
    material: Material that is trained on (string)
    parameters: parameters contained in data (list of strings)
    title: Any additional information (e.g. process, paper ID) to be specified (string)
    plot: Whether to produce plots
    prefix: string prefix of figure filename 

    
    Returns:
    fit_models: List of fit models
    train_accuracy: List of CV accuracies
    train_accuracy_std: List of standard deviation of CV accuracy
    test_accuracy: List of test CV accuracies
    test_accuracy_std: List of standard deviation of CV accuracy 
    '''

    y  = labels
    X = data
    
    # transpose if shape of label and data do not match
    if len(X) != len(labels):
        X = X.T
        print(len(labels), len(X))
        print('transposed to ' + str(X.shape[0]) + ', ' + str(X.shape[1]))
        
        
    # Rescale the data to fit standard normal distribution  
    idx_normalize = len(X[0])
    
    
    # If elemental feautures are provided, append it
    if elemental_features is not None:
        try:
            X = np.hstack((X, elemental_features))
            idx_normalize = len(X[0])
        except:
            breakpoint()
            
            
            
    # If material one hot encoding info is provided, append it
    if materials_ohe is not None:
        X = np.hstack((X, materials_ohe))
       

    fit_models = []
    train_accuracy = []
    train_accuracy_std = []
    test_accuracy = []
    test_accuracy_std = []
    

    # Iterate over implemented models
    if model_name == 'all':
        model_list = ['RF', 'GPC', 'SVC', 'Logistic Regression', 'GB', 'NN']
    else:
        model_list = [model_name]
    for modeltoggle in model_list:
    
        if modeltoggle == 'RF':
            model = RandomForestClassifier()
        elif modeltoggle == 'GPC':
            model = gp.GaussianProcessClassifier()
        elif modeltoggle == 'SVC':
            model = SVC()
        elif modeltoggle == 'Logistic Regression':
            model = LogisticRegression(C =0.00045)
        elif modeltoggle == 'GB':
            model = GradientBoostingClassifier()
        elif modeltoggle == 'NN':
             model = MLPClassifier(hidden_layer_sizes=(32, 64, 64), activation='relu', solver='adam', alpha=0.0001, max_iter = 20000)
       
        # Perform cross validation for each model
        kf = KFold(n_splits=5)
        trains = []
        tests = []

        # Perform cross validation for each model
        for train, test in kf.split(X):
            X_shuffle, y_shuffle = shuffle(X, y, random_state=0)

            X_cv_train_before = X_shuffle[train]
            X_cv_test_before = X_shuffle[test]
            y_train_cv = y_shuffle[train]
            y_test_cv = y_shuffle[test]
            
            
            # Rescale the data to fit standard normal distribution
            # data is rescaled on indices before idx_normalize because indices after may include one-hot-encoded data
            X_train_cv_firsthalf = (X_cv_train_before[:,:idx_normalize] - np.mean(X_cv_train_before[:,:idx_normalize], axis = 0))/(np.std(X_cv_train_before[:,:idx_normalize], axis = 0) + 1e-10)
            X_test_cv_firsthalf = (X_cv_test_before[:,:idx_normalize] - np.mean(X_cv_train_before[:,:idx_normalize], axis = 0))/(np.std(X_cv_train_before[:,:idx_normalize], axis = 0) + 1e-10)
            
            
            # put normalized numerical data with categorical data if present
            X_train_cv = np.hstack((X_train_cv_firsthalf, X_cv_train_before[:, idx_normalize:]))
            X_test_cv = np.hstack((X_test_cv_firsthalf, X_cv_test_before[:, idx_normalize:]))
            
            model.fit(X_train_cv, y_train_cv)
               
            trains.append(model.score(X_train_cv, y_train_cv))
            tests.append(model.score(X_test_cv, y_test_cv))
            if model == 'SVC':
                print(trains, 'SVC')
            if model == 'Logistic Regression':
                print(trains, 'LR')

        trains = np.array(trains)
        tests = np.array(tests)

        r2_mean = tests.mean()
        r2_std = tests.std()

        r2_train_mean = trains.mean()
        r2_train_std =  trains.std()


        train_accuracy.append(r2_train_mean)
        test_accuracy_std.append(r2_std)
        test_accuracy.append(r2_mean)
        train_accuracy_std.append(r2_train_std)
        print(modeltoggle,  'Train Accuracy: {:.5f} ± {:.5f}, Test Accuracy: {:.5f} ± {:.5f}'.
                format(r2_train_mean, r2_train_std, r2_mean, r2_std))
        # Fit on a single train/validation partition
        
        if plot:
            X_train = X_train_cv
            y_train = y_train_cv
            X_test = X_test_cv
            y_test = y_test_cv


            # Compute confusion matrix for classification algorithm

            label_id = np.arange(len(label_names))
            confusion_train = np.zeros((len(label_id), len(label_id)))
            
            for idx, sample in enumerate(y_train):
              
                curr_sample = X_train[idx,:].reshape(1,-1)
                predicted = model.predict(curr_sample)
                confusion_train[int(sample), int(predicted)] += 1
            
                
            fig = plt.figure(figsize = (4,4), dpi = 300)
            ax = fig.gca()

            plt.imshow(confusion_train/np.sum(confusion_train, axis = 0).reshape(1,-1), cmap = 'binary')
#             breakpoint()

            r2_train = model.score(X_train, y_train)
            s =  'Train Accuracy:\n {:.3f}'.format(r2_train)

            plt.text(1.0, 0, s, fontsize=10)

            s_train_cv =  'Train CV Acc: {:.3f} ± {:.3f}'.format(r2_train_mean, r2_train_std)
            plt.text(1.0, 0.4, s_train_cv, fontsize=8)


            plt.title(modeltoggle + ', '+ title)
            label = "Parameters: " + '\n'
            for parameter in parameter_list:
                paramstring = "•" + parameter+ '\n'
                label += paramstring
            plt.xlabel('Ground Truth')
            plt.ylabel('Predicted')
            cbar = plt.colorbar()
            cbar.ax.get_yaxis().labelpad = 15
            cbar.ax.set_ylabel('Proportion of samples', rotation=270)

            label_id = np.arange(len(label_names))
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)

            fig = plt.figure(figsize = (4,4), dpi = 300)
            ax = fig.gca()
            
            for m in range(4):
                for n in range(4):
                    plt.text(m, n  + 0.3, confusion_train[m, n])
            
            plt.title(modeltoggle + ', '+ title)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.xlabel('Ground Truth')
            plt.ylabel('Predicted')
            plt.imshow(np.zeros((4,4)), cmap = 'binary')
            label = "Parameters: " + '\n'
            for parameter in parameter_list:
                paramstring = "•" + parameter+ '\n'
                label += paramstring
            r2_test = model.score(X_test, y_test)
            s =  'Train Accuracy:\n {:.3f}'.format(r2_train)

            
            #plt.text(1.0, 0, s, fontsize=10)
            s_cv =  'Train CV Acc: {:.3f} ± {:.3f}'.format(r2_train, r2_train_std)
            plt.text(1.0, -0.15, s_cv, fontsize=8)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)

          #  savefig(prefix + title+modeltoggle + "num_train"+".png")
            plt.title(modeltoggle)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.show()
            
            confusion_test = np.zeros((len(label_id), len(label_id)))
            
            
            for idx, sample in enumerate(y_test):
                curr_sample = X_test[idx,:].reshape(1,-1)
                predicted = model.predict(curr_sample)             
            
                confusion_test[int(sample), int(predicted)] += 1
            fig = plt.figure(figsize = (4,4), dpi = 300)
            ax = fig.gca()

            plt.imshow(confusion_test/np.sum(confusion_test, axis = 0).reshape(1,-1), cmap = 'binary')
   
            plt.title(modeltoggle + ', '+ title)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.xlabel('Ground Truth')
            plt.ylabel('Predicted')
            
            label = "Parameters: " + '\n'
            for parameter in parameter_list:
                paramstring = "•" + parameter+ '\n'
                label += paramstring
            r2_test = model.score(X_test, y_test)
            s =  'Test Accuracy:\n {:.3f}'.format(r2_test)

            
            #plt.text(1.0, 0, s, fontsize=10)
            s_cv =  'Test CV Acc: {:.3f} ± {:.3f}'.format(r2_mean, r2_std)
            plt.text(1.0, -0.15, s_cv, fontsize=8)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            cbar = plt.colorbar()
            cbar.ax.get_yaxis().labelpad = 15
            cbar.ax.set_ylabel('Proportion of samples', rotation=270)
        #    savefig(prefix + title+modeltoggle + "test"+".png")
            plt.title(modeltoggle + ', ' + title)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.show()
            
            
            
            fig = plt.figure(figsize = (4,4), dpi = 300)
            ax = fig.gca()
            
            for m in range(4):
                for n in range(4):
                    plt.text(m, n  + 0.3, confusion_test[m, n])
            
            plt.title(modeltoggle + ', '+ title)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.xlabel('Ground Truth')
            plt.ylabel('Predicted')
            plt.imshow(np.zeros((4,4)), cmap = 'binary')
            label = "Parameters: " + '\n'
            for parameter in parameter_list:
                paramstring = "•" + parameter+ '\n'
                label += paramstring
            r2_test = model.score(X_test, y_test)
            s =  'Test Accuracy:\n {:.3f}'.format(r2_test)

            
            #plt.text(1.0, 0, s, fontsize=10)
            s_cv =  'Test CV Acc: {:.3f} ± {:.3f}'.format(r2_mean, r2_std)
            plt.text(1.0, -0.15, s_cv, fontsize=8)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)

       #     savefig(prefix + title+modeltoggle + "num_test"+".png")
            plt.title(modeltoggle)
            plt.xticks(label_id, label_names, fontsize = 4)
            plt.yticks(label_id, label_names, fontsize = 4)
            plt.show()

            
        fit_models.append(model)
    return fit_models, train_accuracy, train_accuracy_std, test_accuracy, test_accuracy_std 
