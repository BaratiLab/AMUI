import numpy as np
from eagartsai_amui.simulation.helper_functions import _altsolve, _cornersolve, _cornerfunc, _edgefunc, _solve, _freefunc, _cornerfunc, _edgesolve, _graft
from scipy.ndimage import interpolation as intp
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
#@jitclass(spec)
class Solution():
    
    def __init__(self, dt, T0, phi,  params):
        self.P = params['P']
        self.V = params['V']
        self.sigma = params['sigma']
        self.A = params['A']
        self.rho = params['rho']
        self.cp = params['cp']
        self.k = params['k']
        self.D = self.k/(self.rho*self.cp)        
        self.dimstep = params['dimstep']
        self.xs = params['xs']
        self.ys = params['ys']
        self.zs = params['zs']
        self.dt = dt
        self.T0 = T0
        self.a = 4
        self.phi = phi
        self.theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        

    def solve(self):
        
        coeff = self.P*self.A/(2*np.pi*self.rho*self.cp*(self.sigma**2)*(np.pi)**(3/2))
        rxf = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)
        rxr = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt) + self.V*self.dt   
        ry = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)  
        rz  = self.a*np.sqrt(2*self.D*self.dt)
        self.theta = _altsolve(self.xs - self.xs[len(self.xs)//2], self.ys - self.ys[len(self.ys)//2], self.zs, self.phi, coeff, rxf, rxr, ry, rz, self.D, self.V, self.sigma, self.dt)
        old_idx = len(self.xs)//2
        old_idy = len(self.ys)//2
        return self.theta

    def rotate(self):
        new_theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        orig_x = np.argmin(np.abs(self.xs))
        orig_y = np.argmin(np.abs(self.ys))
        origin = np.array([orig_x, orig_y])    

        new_theta = np.roll(self.theta, (len(self.xs)//2 - origin[0], len(self.ys)//2 - origin[1]), axis = (0,1))
        rot_theta = intp.rotate(new_theta, angle = np.rad2deg(self.phi), reshape = False, cval = self.T0)
        new_theta = np.roll(rot_theta, (-len(self.xs)//2 + origin[0], -len(self.ys)//2 + origin[1]), axis = (0,1))
        self.theta = new_theta
        return self.theta

    def generate(self):
        return self.solve()

    def plot(self):
        nrows = 1 
        ncols = 3 
        figure, axes = plt.subplots(nrows, ncols)
        nrows = 1
        ncols = 3
        xcurrent = np.argmax(self.theta[:, len(self.ys)//2, -1])

        pcm0 = axes[0].pcolormesh(self.ys, self.xs, self.theta[:, :, -1].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        pcm1 = axes[1].pcolormesh(self.zs, self.xs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        pcm2 = axes[2].pcolormesh(self.zs, self.ys, self.theta[xcurrent, :, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        pcms = [pcm0, pcm1, pcm2]
        scale_x = 1e-6
        scale_y = 1e-6
        ticks_x = ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale_x))
        ticks_y = ticker.FuncFormatter(lambda y, pos:'{0:g}'.format(y/scale_y) )
        iter = 0
        for ax, pcm in zip(axes, pcms):
            ax.set_aspect('equal')
            ax.xaxis.set_major_formatter(ticks_x)
            ax.yaxis.set_major_formatter(ticks_y)
            figure.colorbar(pcm, ax = ax)
            if iter > 0:
                plt.sca(ax)
                plt.xticks([-300e-6, 0])
            iter += 1
        figure.tight_layout()


#@jitclass(spec)
class CornerSolution():
    def __init__(self, dt, phi, dx, dy, T0, params):
        self.P = params['P']
        self.V = params['V']
        self.sigma = params['sigma']
        self.A = params['A']
        self.rho = params['rho']
        self.cp = params['cp']
        self.k = params['k']
        self.D = self.k/(self.rho*self.cp)        
        self.dimstep = params['dimstep']
        self.xs = params['xs']
        self.ys = params['ys']
        self.zs = params['zs']
        self.dt = dt
        self.phi = phi
        self.T0 = T0
        self.a = 4
        self.dx = dx
        self.dy = dy
        self.theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        
    def cornersolve(self):

        coeff = self.P*self.A/(2*np.pi*self.rho*self.cp*(self.sigma**2)*(np.pi)**(3/2))
        rxf = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)
        rxr = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt) + self.V*self.dt   
        ry = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)  
        rz  = self.a*np.sqrt(2*self.D*self.dt)
        x_offset = self.xs[len(self.xs)//2]
        y_offset = self.ys[len(self.ys)//2]
        self.theta = _cornersolve(self.xs- x_offset, self.ys - y_offset, self.zs, coeff, rxf, rxr, ry, rz, self.D, self.V, self.sigma, self.dt, self.dx, self.dy, self.phi)
        return self.theta

    def rotate(self):
        new_theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        orig_x = np.argmin(np.abs(self.xs))
        orig_y = np.argmin(np.abs(self.ys))
        
        origin = np.array([orig_x, orig_y])    
        breakpoint()
        new_theta = np.roll(self.theta, (len(self.xs)//2 - origin[0], len(self.ys)//2 - origin[1]), axis = (0,1))
        rot_theta = intp.rotate(new_theta, angle = np.rad2deg(self.phi), reshape = False, cval = self.T0)
        new_theta = np.roll(rot_theta, (-len(self.xs)//2 + origin[0], -len(self.ys)//2 + origin[1]), axis = (0,1))
        breakpoint()
        self.theta = new_theta
        return self.theta

    def generate(self):
        return self.cornersolve()

    def plot(self):
        nrows = 1 
        ncols = 3 
        figure, axes = plt.subplots(nrows, ncols)
        nrows = 1
        ncols = 3
        xcurrent = np.argmax(self.theta[:, len(self.ys)//2, -1])

        # pcm0 = axes[0].pcolormesh(self.ys, self.xs, self.theta[:, :, -1].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        # pcm1 = axes[1].pcolormesh(self.zs, self.xs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        # pcm2 = axes[2].pcolormesh(self.zs, self.ys, self.theta[xcurrent, :, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)

        pcm0 = axes[0].pcolormesh(self.xs, self.ys, self.theta[:, :, -1].T, cmap = 'jet', vmin = 300, vmax = 1923)
        pcm1 = axes[1].pcolormesh(self.xs, self.zs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcm2 = axes[2].pcolormesh(self.ys, self.zs, self.theta[xcurrent, :, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcms = [pcm0, pcm1, pcm2]
        scale_x = 1e-6
        scale_y = 1e-6
        ticks_x = ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale_x))
        ticks_y = ticker.FuncFormatter(lambda y, pos:'{0:g}'.format(y/scale_y) )
        iter = 0
        for ax, pcm in zip(axes, pcms):
            ax.set_aspect('equal')
            ax.xaxis.set_major_formatter(ticks_x)
            ax.yaxis.set_major_formatter(ticks_y)
            figure.colorbar(pcm, ax = ax)
            if iter > 0:
                plt.sca(ax)
                plt.xticks([-300e-6, 0])
            iter += 1
        figure.tight_layout()

class EdgeSolution():
    def __init__(self, dt, alpha, dx, T0, params):
        self.P = params['P']
        self.V = params['V']
        self.sigma = params['sigma']
        self.A = params['A']
        self.rho = params['rho']
        self.cp = params['cp']
        self.k = params['k']
        self.D = self.k/(self.rho*self.cp)        
        self.dimstep = params['dimstep']
        self.xs = params['xs']
        self.ys = params['ys']
        self.zs = params['zs']
        self.dt = dt
        self.phi = alpha
        self.T0 = T0
        self.a = 4
        self.dx = dx
        self.theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        

    def edgesolve(self):
        coeff = self.P*self.A/(2*np.pi*self.rho*self.cp*(self.sigma**2)*(np.pi)**(3/2))
        rxf = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)
        rxr = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt) + self.V*self.dt   
        ry = self.a*np.sqrt(self.sigma**2 + 2*self.D*self.dt)  
        rz  = self.a*np.sqrt(2*self.D*self.dt)
        x_offset = self.xs[len(self.xs)//2]
        y_offset = self.ys[len(self.ys)//2]
        self.theta = _edgesolve(self.xs - x_offset, self.ys - y_offset, self.zs, coeff, rxf, rxr, ry, rz, self.D, self.V, self.sigma, self.dt, self.dx, self.phi)
        return self.theta

    def rotate(self):
        new_theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        orig_x = np.argmin(np.abs(self.xs))
        orig_y = np.argmin(np.abs(self.ys))
        
        origin = np.array([orig_x, orig_y])    

        new_theta = np.roll(self.theta, (len(self.xs)//2 - origin[0], len(self.ys)//2 - origin[1]), axis = (0,1))
        rot_theta = intp.rotate(new_theta, angle = np.rad2deg(self.phi), reshape = False, cval = self.T0)
        new_theta = np.roll(rot_theta, (-len(self.xs)//2 + origin[0], -len(self.ys)//2 + origin[1]), axis = (0,1))
        self.theta = new_theta
        return self.theta

    def generate(self):
        self.edgesolve()
        return self.theta

    def plot(self):
        nrows = 1 
        ncols = 3 
        figure, axes = plt.subplots(nrows, ncols)
        nrows = 1
        ncols = 3
        xcurrent = np.argmax(self.theta[:, len(self.ys)//2, -1])

        # pcm0 = axes[0].pcolormesh(self.ys, self.xs, self.theta[:, :, -1], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        # pcm1 = axes[1].pcolormesh(self.zs, self.xs, self.theta[:, len(self.ys)//2, :], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        # pcm2 = axes[2].pcolormesh(self.zs, self.ys, self.theta[xcurrent, :, :], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        pcm0 = axes[0].pcolormesh(self.xs, self.ys, self.theta[:, :, -1].T, cmap = 'jet', vmin = 300, vmax = 1923)
        pcm1 = axes[1].pcolormesh(self.xs, self.zs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcm2 = axes[2].pcolormesh(self.ys, self.zs, self.theta[xcurrent, :, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcms = [pcm0, pcm1, pcm2]
        scale_x = 1e-6
        scale_y = 1e-6
        ticks_x = ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale_x))
        ticks_y = ticker.FuncFormatter(lambda y, pos:'{0:g}'.format(y/scale_y) )
        iter = 0
        for ax, pcm in zip(axes, pcms):
            ax.set_aspect('equal')
            ax.xaxis.set_major_formatter(ticks_x)
            ax.yaxis.set_major_formatter(ticks_y)
            figure.colorbar(pcm, ax = ax)
            if iter > 0:
                plt.sca(ax)
                plt.xticks([-300e-6, 0])
            iter += 1
        figure.tight_layout()

