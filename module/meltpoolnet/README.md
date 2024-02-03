### MeltPoolNet (AMUI Internal Repository)

The required python packages are listed in `requirements.txt`. The environment used should have python version 3.7 for optimal compatibility.
This repository contains code corresponding to the MeltPoolNet paper.

`meltpoolnet` contains the source code for this project.

`archive` contains older, more comprehensive versions of the jupyter notebooks used for this work. These can be referenced for details on hyperparameter choices, featurization choices, and model experiments. However, these notebooks have not been maintained to be compatible with the current version of the repository.

`notebooks\` contains demonstrations of the project's base functions.
- `AdditiveNet_ML_AM_classification_demo.ipynb` contains examples for the classification task. In this task, we classify the melt pool into either LoF, desirable, or keyhole defect classes.

- `AdditiveNet_ML_AM_regression_demo.ipynb` contains examples for the classification task. In this task, we regress to the dimensions of the melt pool.


- `AdditiveNet_ML_AM_draw_decision_boundaries.ipynb` contains examples for drawing process maps within P/V space. This code contains examples for regression-based process maps that plot the melt pool dimensions as a function of P and V, and classification bsaed examples for the defect scenario. For the classification task, the balling and spatter categories are removed because of (1) too few balling data points for meaningful classification, and (2) the potential for overlap between spatter and other defect classes.

- `initial_data_analysis.ipynb` contains information about the overall composition of the dataset.

Code for pre-processing the dataset can be found in the `utils/` folder.

* `atomic_featurization.py`: Extracts atomic information from the elemental composition of each alloy for featurization. 
* `plotting_utils.py`: Contains code to improve the appearance of the generated plots
* `utils.py`: Contains functions to extract specific subsets of the data

Code to train the shallow machine learning models can be found in the `ml` folder.

* `regression_ml.py` contains code to perform regression tasks.
* `classification_ml.py` contains code to perform classification tasks.

### General Notes
* As this dataset spans multiple metal AM processes, select a subset of the data that corresponds to one metal AM process before further analysis.
* You can specify an arbitrary set of features to be used as input to the ML models used in this work. With this, samples that do not have a value for a given feature will not be used during this process. Therefore, the more specific the feature set,  the less data points available for training.
* When filtering on specific data columns, some entries are stored as strings, and others are stored as numeric data types. This might require manual casting. A general solution to this issue is not currently implemented (but should be  straightforward to implement)


