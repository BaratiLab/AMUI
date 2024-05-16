from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from matplotlib.lines import Line2D
from io import BytesIO
from matplotlib.figure import Figure

import numpy as np
import pandas as pd
import pickle
import os
import torch

room = 293
nt = 99
mkdir = lambda path: os.mkdir(path) if not os.path.exists(path) else None
get_vp = lambda x: (int(x.split('_')[-1]), int(x.split('_')[-3]))

def prep_input(X, data_dir='Ti64-5m', include_d=False):
    # X should contain p, v, t in its last dimension
    x = torch.as_tensor(X, dtype=torch.float)
    d = x[..., 0]/x[..., 1]/0.5
    dd = data_dir.split('-')[0]
    if dd == 'Ti64':
        mx = torch.tensor([500, 1500, 100])
    elif dd == 'SS316L':
        mx = torch.tensor([320, 400, 100])
    x /= mx
    if include_d:
        x = torch.cat([x, d.squeeze(-1)], dim=-1)
    return x

def cross_section(T, x=None, y=None, z=None):
    """
    returns a cross section of T
    specify either x, y or z (float between 0 and 1)
    """
    nx, ny, nz = np.array(T.shape) - 1
    if sum([x is None, y is None, z is None]) != 2:
        print('Specify either x, y, z in [0,1]')
    elif x is not None:
        return T[round(x*nx), :, :].T
    elif y is not None:
        return T[:, round(y*ny), :].T
    elif z is not None:
        return T[:, :, round(z*nz)].T

def get_meshes(data_dir):
    dr = './surrogate/Results/'+data_dir
    mesh_x = np.load(dr+'/mesh_x.npy', allow_pickle=True)
    mesh_y = np.load(dr+'/mesh_y.npy', allow_pickle=True)
    mesh_z = np.load(dr+'/mesh_z.npy', allow_pickle=True)
    return mesh_x, mesh_y, mesh_z

meshes = [
    get_meshes(data_dir) for data_dir in 
    ['Ti64-5m', 'Ti64-10m', 'Ti64-10m-powder', 'SS316L']
]

def rollout(x):
    roll = []
    lx, ly, lz = x.shape
    for i in range(lx):
        for j in range(ly):
            for k in range(lz):
                roll.append(f'({i},{j},{k}):{x[i,j,k]}')
    return roll

def numpy_to_csv(T):
    df_dict = {}
    for i, Tt in enumerate(T):
        df_dict[f't={i}'] = rollout(Tt)
    df = pd.DataFrame(df_dict)
    return df

Device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
room = 293
nt = 99

class GenClass():
    # Initialization
    def __init__(self, name, data_dir='Ti64-5m', Tmax=6500, include_d=False):
        mkdir('./surrogate/Results/'+data_dir)
        self.result_dir = './surrogate/Results/'+data_dir+'/'+name
        self.outputs_dir = self.result_dir + '/outputs'
        mkdir(self.result_dir)
        mkdir(self.outputs_dir)
        self.prep_x = lambda x: prep_input(x, data_dir, include_d)
        self.prep_T = lambda T: (T-room)/(Tmax-room)
        self.post_T = lambda T: room + (Tmax-room)*T
        self.Tmax = Tmax

    # Loading the state_dict
    def load_state_dict(self, path=None, masked=False):
        if path is None:
            path = self.result_dir + '/State_dict'
            if masked:
                path += '_masked'
        if masked:
            self.load_state_dict_masker()
        with open(path+'.pickle', 'rb') as f:
            state_dict = pickle.load(f)
        for key, value in state_dict.items():
            setattr(self, key, value)

    # Loading the state_dict of the masker
    def load_state_dict_masker(self, path=None):
        if path is None:
            path = self.result_dir + '/State_dict_masker.pickle'
        with open(path, 'rb') as f:
            print(f)
            state_dict = pickle.load(f)
        for key, value in state_dict.items():
            setattr(self, key, value)

    # Setting the models to test mode
    def test_mode(self, device=Device):
        for model in ['model', 'masker']:
            try:
                getattr(self, model).requires_grad_(False).eval().to(device)
            except:
                pass

    # Get the output of the model for a whole process with parameters p, v
    def test_process(self, p, v, masked=False, device=Device):
        Ts_pred = []
        for t in range(nt):
            x = self.prep_x([p, v, t]).unsqueeze(0).to(device)
            T_pred = self.model(x)
            if masked:
                mask = self.masker(x, mask=True) < 0.5
                T_pred.masked_fill_(mask, 0)
            Ts_pred.append(T_pred)
        Ts_pred = torch.cat(Ts_pred)
        Ts_pred = self.post_T(Ts_pred)
        return Ts_pred.squeeze().cpu().numpy()

class Container:
    def __init__(self):
        self.room = 293
        self.nt = 99
        self.m = 0
        self.t = 0
        self.z = 0.9
        self.y = 0.5
        self.fig = None
        self.ax = None
        # Loading the Models
        info = [
            ('FC[]_CNN[128, 64, 32, 16, 8, 4]', 'Ti64-5m'),
            ('FC[]_CNN[128, 64, 32, 16, 8, 4]', 'Ti64-10m'),
            ('FC[]_CNN[128, 64, 32, 16, 8, 4]', 'Ti64-10m-powder'),
            ('FC[]_CNN[128, 64, 32, 16, 8, 4]', 'SS316L'),
        ]
        self.meshes = meshes
        self.Models_masked = []
        self.Models = []
        for i in range(4):
            name, result_dir = info[i]

            Model_masked = GenClass(name, result_dir)
            Model_masked.load_state_dict(masked=True)
            Model_masked.test_mode()
            for j in range(5):
                Model_masked.masker.cnn[j][0].recompute_scale_factor = None
                Model_masked.model.cnn[j][0].recompute_scale_factor = None
            self.Models_masked.append(Model_masked)

            Model = GenClass(name, result_dir)
            Model.load_state_dict(masked=False)
            Model.test_mode()
            for j in range(5):
                Model.model.cnn[j][0].recompute_scale_factor = None
            self.Models.append(Model)


class Simulation(APIView):
    """
    Runs simulation page for surrogate model for creating melt pool.
    """

    permission_classes = (AllowAny, )
    def __init__(self):
        self.obj = Container()

    def get(self, request):
        print("called surrogate with new app")
        self.obj.t = 0
        self.obj.z = 0.9
        self.obj.y = 0.5
        self.obj.P = int(request.query_params.get("power"))
        self.obj.V = int(request.query_params.get("velocity"))
        self.obj.i = int(request.query_params.get("simulation_id"))
        self.obj.mesh = self.obj.meshes[self.obj.i]
        self.obj.melt = 1900 if self.obj.i < 3 else 1660
        self.obj.T = np.stack([
            self.obj.Models_masked[self.obj.i].test_process(self.obj.P, self.obj.V, masked=True),
            self.obj.Models[self.obj.i].test_process(self.obj.P, self.obj.V, masked=False)
        ])

        nx, ny, nz = np.array(self.obj.T.shape[2:]) - 1
        self.obj.mesh_x, self.obj.mesh_y, self.obj.mesh_z = self.obj.mesh
        self.obj.xlim = [self.obj.mesh_x[0], self.obj.mesh_x[-1]]

        interp = lambda x, m: np.interp(x, np.linspace(0, 1, len(m)), m)
        self.obj.yline = lambda y: interp(y, self.obj.mesh_y)
        self.obj.zline = lambda z: interp(z, self.obj.mesh_z)

        self.obj.fig = Figure(figsize=(6.4, 6.4))
        self.obj.ax = self.obj.fig.subplots(2, 2, sharex='all', sharey='row')

        return Response()
