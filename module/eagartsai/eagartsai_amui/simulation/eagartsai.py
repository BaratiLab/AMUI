import matplotlib.pyplot as plt 
import numpy as np
from scipy import signal
import scipy.integrate as integrate
import numba
from tqdm import tqdm
# from numba import jitclass, njit
# from numba import boolean, int_, float64,uint8
import matplotlib.ticker as ticker
from scipy.ndimage import gaussian_filter
from scipy import optimize
from scipy.ndimage import interpolation as intp
from scipy import interpolate as interp
import time
import os
from scipy import special
import sys
import argparse
import pandas as pd
from eagartsai_amui.simulation.helper_functions import _altsolve, _cornersolve, _cornerfunc, _edgefunc, _solve, _freefunc, _cornerfunc, _edgesolve, _graft, _checkellipse
from eagartsai_amui.simulation.solution import Solution, CornerSolution, EdgeSolution


def plot(theta, nrows, ncols, xs, ys, zs):
    figure, axes = plt.subplots(nrows, ncols)
    nrows = 1
    ncols = 3
    xcurrent = np.argmax(theta[:,len(ys)//2, -1])
    
    pcm0 = axes[0].pcolormesh(ys, xs, theta[:, :, -1], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
    pcm1 = axes[1].pcolormesh(zs, xs, theta[:, len(ys)//2, :], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
    pcm2 = axes[2].pcolormesh(zs, ys, theta[xcurrent, :, :], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
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


class EagarTsai():

    "Produce an analytical E-T solution"
    # def __init__(self, dimstep, V = 0.8, bc = 'flux', absorp = 0.3, cp = 505, k = 21.5):
    def __init__(self,
                    dimstep, 
                    V = 0.8, 
                    bc = 'flux',
                    absorp = 1, 
                    cp = 455, 
                    k = 8.9,
                    beamD = 50e-6, 
                    rho = 7910,
                    P = 200, 
                    melt_T = 1673, 
                    bounds = {'x': [0, 1000e-6], 'y': [-300e-6, 300e-6], 'z': [-800e-6, 0]}
                 ):
        self.P = P 
        self.V = V
        self.sigma = beamD/4#13.75e-6
        self.A = absorp
        self.rho =  rho
        self.cp = cp
        self.k = k
        self.bc = bc
        self.step = 0
        self.dimstep = dimstep
        self.time = 0
        self.melt_T = melt_T
        b = 200e-6 # space around possible laser path


        # self.xs = np.arange(-1000e-6 -b, 1000e-6 + b ,step = self.dimstep)
        # self.ys = np.arange(-600e-6 - b, 600e-6 + b , step = self.dimstep)
        # self.zs = np.arange(-200e-6, 0 + self.dimstep, step = self.dimstep)

        # self.xs = np.arange(-b, 1000e-6 + b ,step = self.dimstep)
        # self.ys = np.arange(-300e-6 - b, 300e-6 + b , step = self.dimstep)
        # self.zs = np.arange(-800e-6, 0 + self.dimstep, step = self.dimstep)
        self.xs = np.arange(-b + bounds['x'][0], bounds['x'][1]+ b, step = self.dimstep)
        self.ys = np.arange(bounds['y'][0] - b, bounds['y'][1] + b, step = self.dimstep)
        self.zs = np.arange(bounds['z'][0], bounds['z'][1] + self.dimstep, step = self.dimstep)

        self.theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*300
        self.depths = np.zeros((len(self.xs), len(self.ys)))
        self.D = self.k/(self.rho*self.cp)
        self.depths_pcl = np.zeros((0, 3))
       # breakpoint()
        self.location = [0, 0]
        self.location_idx = [np.argmin(np.abs(self.xs)), np.argmin(np.abs(self.ys))]
        self.a = 4
        self.times = []
        self.T0 = 300
        self.oldellipse = np.zeros((len(self.xs), len(self.ys)))
        self.store_idx = {}
        self.store = []
        self.visitedx = []
        self.visitedy = []
        self.state = None
        params = {'P': self.P,
                  'V': self.V,
                  'sigma': self.sigma,
                  'A': self.A,
                  'rho': self.rho,
                  'cp': self.cp,
                  'k': self.k,
                  'dimstep': self.dimstep,
                  'xs': self.xs,
                  'ys': self.ys,
                  'zs': self.zs
                  }
    def reset_depthpcl(self):
        self.depths_pcl = np.zeros((0, 3))
    def edgegraft(self, sol, phi, orientation):


        l = sol.V*sol.dt
        l_idx = int(self.location[0]/self.dimstep)
        l_idy = int(self.location[1]/self.dimstep)           
        l_x_new = int(self.location_idx[0] + l*np.cos(phi)/self.dimstep)#int(self.location[0]/self.dimstep + l*np.cos(phi)/self.dimstep)
        l_y_new = int(self.location_idx[1] + l*np.sin(phi)/self.dimstep) #int(self.location[1]/self.dimstep + l*np.sin(phi)/self.dimstep)
        x_offset = len(self.xs)//2
        y_offset = len(self.ys)//2
        y_roll = (l_y_new - y_offset) 
        new_theta = np.roll(sol.theta, (-x_offset, y_roll), axis = (0,1))
        new_theta[-x_offset:, :, :] = 300

        if orientation == 1:
            new_theta = np.flip(new_theta, axis = 0)
        if orientation == 2:
            new_theta = np.roll(sol.theta, (-x_offset, 0), axis = (0,1))
            new_theta[-x_offset:, :, : ] = 300
            offset = (len(self.xs) - len(self.ys)) //2
            midpoint = len(self.ys)//2
            midx = len(self.xs)//2
            rot_theta = np.rot90(new_theta, k = 1, axes = (0,1))
            cut_theta = rot_theta[:, :-offset*2 or None, :]
            pad_theta = np.pad(cut_theta, ((offset, offset),(0, 0), (0, 0)), mode = 'minimum')
            x_min = np.argmin(np.abs(self.xs))
            new_theta = np.roll(pad_theta, (x_min+l_x_new+x_offset, 0, 0), axis = (0, 1, 2))
            new_theta[x_min+l_x_new+x_offset:, :, :] = 300

        if orientation == 3:
            new_theta = np.roll(sol.theta, (-x_offset, 0), axis = (0,1))
            new_theta[-x_offset:, :, : ] = 300
            offset = (len(self.xs) - len(self.ys)) //2
            midpoint = len(self.ys)//2
            midx = len(self.xs)//2
            rot_theta = np.rot90(new_theta, k = 3, axes = (0,1))
            cut_theta = rot_theta[:, offset*2 or None:, :]
            pad_theta = np.pad(cut_theta, ((offset, offset),(0, 0), (0, 0)), mode = 'minimum')
            x_min = np.argmin(np.abs(self.xs))
            new_theta = np.roll(pad_theta, (x_min+l_x_new+x_offset, 0, 0), axis = (0, 1, 2))
            new_theta[x_min+l_x_new+x_offset:, :, :] = 300

        self.theta += new_theta - 300
        if self.theta.shape == (0 , 0, 0):
            breakpoint()
        
        self.location[0] += l*np.cos(phi)
        self.location[1] += l*np.sin(phi)

        self.location_idx[0] += int(np.rint(l*np.cos(phi)/self.dimstep))
        self.location_idx[1] += int(np.rint(l*np.sin(phi)/self.dimstep))

        self.visitedx.append(self.location_idx[0])
        self.visitedy.append(self.location_idx[1])


    def cornergraft(self, sol, phi, orientation):
        c = np.where(np.array(orientation) > 0)
 
        l = sol.V*sol.dt
        l_idx = int(self.location[0]/self.dimstep)
        l_idy = int(self.location[1]/self.dimstep)           
        x_offset = len(self.xs)//2
        y_offset = len(self.ys)//2
        new_theta = np.roll(sol.theta, (-x_offset, -y_offset), axis = (0,1))

        new_theta[-x_offset or None:,:, : ] = 300
        new_theta[:,-y_offset or None:, : ] = 300
        if np.all(c[0] == [0, 3]):
            new_theta = np.flip(new_theta, axis = 1)
        if np.all(c[0] == [1, 2]):
            new_theta = np.flip(new_theta, axis = 0)
        if np.all(c[0] == [1, 3]):
            new_theta = np.flip(new_theta, axis = 0)
            new_theta = np.flip(new_theta, axis = 1)
        
        self.theta += new_theta - 300

        self.location[0] += l*np.cos(phi)
        self.location[1] += l*np.sin(phi)
      #  print("UPDATE_x",int(np.rint(l*np.cos(phi)/self.dimstep)) )
        
        self.location_idx[0] += int(np.rint(l*np.cos(phi)/self.dimstep))
        self.location_idx[1] += int(np.rint(l*np.sin(phi)/self.dimstep))

        # self.location[0] += l*int(np.cos(phi))
        # self.location[1] += l*int(np.sin(phi))
        # self.location_idx[0] += int(np.rint(l*int(np.cos(phi))/self.dimstep))
        # self.location_idx[1] += int(np.rint(l*int(np.sin(phi))/self.dimstep))  
        self.visitedx.append(self.location_idx[0])
        self.visitedy.append(self.location_idx[1])

        
    def forward(self, dt, phi, V = 0.8, P = 200):
        # print(P)
        if self.P is None:
            self.P = P
        if self.V is None:
            self.V = V
        params = {'P': self.P,
            'V': V,
            'sigma': self.sigma,
            'A': self.A,
            'rho': self.rho,
            'cp': self.cp,
            'k': self.k,
            'dimstep': self.dimstep,
            'xs': self.xs,
            'ys': self.ys,
            'zs': self.zs
            }

  #      check if boundary condition is needed:
        corner, edge, ddim, edges, distprime = self.check(dt, phi, V)

        if edge:
            # breakpoint()
            # if P != 200:
                # breakpoint()
            self.state = 'edge'
            c = np.argmax(np.array(edges))
            if c == 0: 
                alpha = phi
            if c == 1:
                alpha = np.pi - phi
            if c == 3:
                alpha = phi + np.pi/2
            if c == 2:
                alpha = phi - np.pi/2
                
            ddim =  np.array(ddim)
            dx =  ddim[np.where(ddim > -1)[0][0]]
            sol = EdgeSolution(dt, alpha, dx, self.T0, params)
            # print("max theta", np.max(sol.theta))
            # breakpoint()
            sol.generate()
            self.diffuse(sol.dt)

            orientation = c
            # breakpoint()
            self.edgegraft(sol, phi, orientation)
            
        if corner: 
            self.state = 'corner'
            side = -1
            ddim = np.array(ddim)
            dx = ddim[np.where(ddim > -1)[0][0]]
            dy = ddim[np.where(ddim > -1)[0][1]]
          

            c = np.where(np.array(edges) > 0)
            if distprime[1] < distprime[0]:
                side = np.max(c)
            else:
                side = np.min(c)
            assert(side > -1)
            if np.all(c[0] == [0, 2]):
                alpha = phi
            alpha = phi 
            mid_y = np.argmin(np.abs(self.ys))
            mid_x = np.argmin(np.abs(self.xs))
            if np.all(c[0] == [0, 3]):
                alpha = 2*np.pi - phi 
               
              
            if np.all(c[0] == [1, 2]):
                alpha = np.pi - phi
             
            if np.all(c[0] == [1, 3]):  
                alpha = phi + np.pi
            if (len(c[0]) > 2):
                alpha = phi
           
                              
            
            sol = CornerSolution(dt, alpha, dx, dy, self.T0, params)
            sol.generate()
            self.diffuse(sol.dt)
            orientation = edges
            self.cornergraft(sol, phi, orientation)
        
        if not edge and not corner:
            self.state = 'free'
            # if (dt, phi) in self.store_idx.keys():
            #     sol = self.store[self.store_idx[dt, phi]]
            # else:
            #     
            sol = Solution(dt, self.T0, phi, params)
            sol.generate()
            # print('POWER', self.P, P)
                # self.store_idx.update({(dt, phi): len(self.store)})
                # self.store.append(sol)

            self.diffuse(sol.dt)
            self.graft(sol, phi)

        self.time += dt
       

    def check(self, dt, phi, V):

        rxf = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt)
        rxr = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt) + self.V*dt   
        ry = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt)  
        rz  = self.a*np.sqrt(2*self.D*dt)
        l_x = V*dt*np.cos(phi)
        l_y = V*dt*np.sin(phi)

        l_idx = V*dt*np.cos(phi)//self.dimstep
        l_idy = V*dt*np.sin(phi)//self.dimstep
        ellipse = self.oldellipse
        corner, edge, ddim, edges, distprime, ellipse =  _checkellipse(rxf, rxr, ry, rz, l_x, l_y, l_idx, l_idy, ellipse, self.xs, self.ys, phi, self.location[0], self.location[1])
        
        self.oldellipse = ellipse       
        return corner, edge, ddim, edges, distprime

    def solve(self, dt):
        "Solves E-T for dt amount of time"
        coeff = self.A*self.P/(self.rho*self.cp*np.sqrt(self.D*4*np.pi**3)) 
        rxf = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt)
        rxr = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt) + self.V*dt   
        ry = self.a*np.sqrt(self.sigma**2 + 2*self.D*dt)  
        rz  = self.a*np.sqrt(2*self.D*dt)
        params = {'rxf': rxf,
                  'rxr': rxr,
                   'ry': ry,
                   'rz': rz,
                   'coeff': coeff,
                    'D': self.D,
                    'V': self.V,
                    'sigma': self.sigma,
                    'dt': dt}
        
        return _solve(self.xs, self.ys, self.zs, coeff, rxf, rxr, ry, rz, self.D, self.V, self.sigma, dt)

    def graft(self, sol, phi):
        l = sol.V*sol.dt
        l_new_x = int(np.rint(sol.V*sol.dt*np.cos(phi)/self.dimstep))
        l_new_y = int(np.rint(sol.V*sol.dt*np.sin(phi)/self.dimstep))
        l_idx = int(self.location[0]/self.dimstep)
        l_idy = int(self.location[1]/self.dimstep)
        y = len(self.ys)//2

       # breakpoint()
        self.theta = _graft(self.theta, sol.theta, sol.xs, sol.ys, sol.zs, self.location_idx[0], self.location_idx[1], l_new_x, l_new_y)
        # plt.pcolormesh(self.ys, self.xs, self.theta[:, :, -1], shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 1673)
        # #sol.plot()
        # plt.pause(1)
        # plt.close('all')
        if self.theta.shape == (0, 0, 0):
            breakpoint()

        self.location[0] += l*(np.cos(phi))
        self.location[1] += l*(np.sin(phi))
      #  print("UPDATE_x",int(np.rint(l*np.cos(phi)/self.dimstep)) )
        self.location_idx[0] += int(np.rint(l*np.cos(phi)/self.dimstep))
        self.location_idx[1] += int(np.rint(l*np.sin(phi)/self.dimstep)) 
        self.visitedx.append(self.location_idx[0])
        self.visitedy.append(self.location_idx[1])

    def reset(self):
        self.theta = np.ones((len(self.xs), len(self.ys), len(self.zs)))*self.T0
        self.location = [0, 0]
        
        self.location_idx = [np.argmin(np.abs(self.xs)), np.argmin(np.abs(self.ys))]
       # print(self.location_idx, "LOCATION")
        self.oldellipse = np.zeros((len(self.xs), len(self.ys)))
        self.store_idx = {}
        self.store = []
        self.visitedx = []
        self.visitedy = []
        self.state = None
        self.time = 0
        self.depths_pcl = np.zeros((0, 3))

    def func(self, x, h, y , z):
        coeff = self.A*self.P/(self.rho*self.cp*np.sqrt(self.D*4*np.pi**3))
        start = x**(-0.5)/(self.sigma**2 + 2*self.D*x)
        exponent = -1*(((h + self.V*x)**2 + y**2)/(2*self.sigma**2 + 4*self.D*x) + (z**2)/(4*self.D*x))
        value = coeff*np.exp(exponent)*start
        return value

    def get_coords(self):
        return self.xs, self.ys, self.zs
    # Plot cross sections of domain
    def plot(self):
        nrows = 3 
        ncols = 1 
        figures = []
        axes = []
        for i in range(3):
            fig = plt.figure()
            figures.append(fig)
            axes.append(fig.add_subplot(1, 1, 1))
        xcurrent = np.argmax(self.theta[:, len(self.ys)//2, -1])

        pcm0 = axes[0].pcolormesh(self.xs, self.ys, self.theta[:, :, -1].T, cmap = 'jet', vmin = 300, vmax = 1923)
        # print(self.location, "Location")
        # print(self.location_idx)
        axes[0].plot(self.location[0], self.location[1] ,'r.')
        axes[0].plot(self.xs[self.location_idx[0]], self.ys[self.location_idx[1]], 'k.')
        pcm1 = axes[1].pcolormesh(self.xs, self.zs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcm2 = axes[2].pcolormesh(self.ys, self.zs, self.theta[xcurrent, :, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        pcms = [pcm0, pcm1, pcm2]
        scale_x = 1e-6
        scale_y = 1e-6
        ticks_x = ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale_x))
        ticks_y = ticker.FuncFormatter(lambda y, pos:'{0:g}'.format(y/scale_y) )
        iter = 0
        titles = ["X - Y plane","X - Z plane", "Y - Z plane"]
        axes[0].set_xlabel(r"x [$\mu$m]")
        axes[0].set_ylabel(r"y [$\mu$m]")
        axes[1].set_xlabel(r"x [$\mu$m]")
        axes[1].set_ylabel(r"z [$\mu$m]")
        axes[2].set_xlabel(r"y [$\mu$m]")
        axes[2].set_ylabel(r"z [$\mu$m]")
        
        for axis, pcm, fig in zip(axes, pcms, figures):
            axis.set_aspect('equal')
            axis.xaxis.set_major_formatter(ticks_x)
            axis.yaxis.set_major_formatter(ticks_y)

            axis.title.set_text(str(round(self.time*1e6)) + r'[$\mu$s] ' + self.state + " Power: " + str(np.around(self.P, decimals = 2)) + "W" + " Velocity: " + str(np.around(self.V, decimals = 2)) + r" [m/s]")
            clb = fig.colorbar(pcm, ax = axis)
            clb.ax.set_title(r'T [$K$]')
            iter += 1
        return figures

    def plot_video(self):
        fig = plt.gcf()
        ax = plt.gca()     
        scale_x = 1e-6
        scale_y = 1e-6
        ticks_x = ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale_x))
        ticks_y = ticker.FuncFormatter(lambda y, pos:'{0:g}'.format(y/scale_y) )
        pcm1 =  ax.pcolormesh(self.xs, self.ys, self.theta[:, :, -1].T, cmap = 'jet', vmin = 300, vmax = 1923)
        #ax.pcolormesh(self.xs, self.zs, self.theta[:, len(self.ys)//2, :].T, shading = 'gouraud', cmap = 'jet', vmin = 300, vmax = 4000)
        ax.set_xlabel(r"x [$\mu$m]")
        ax.set_ylabel(r"y [$\mu$m]")
        ax.set_aspect('equal')
        ax.xaxis.set_major_formatter(ticks_x)
        ax.yaxis.set_major_formatter(ticks_y)

        ax.title.set_text(str(round(self.time*1e6)) + r'[$\mu$s] ' + self.state + " Power: " + str(np.around(self.P, decimals = 2)) + "W" + " Velocity: " + str(np.around(self.V, decimals = 2)) + r" [m/s]")
        clb = fig.colorbar(pcm1, ax = ax)
        clb.ax.set_title(r'T [$K$]')
        plt.savefig('temp_{}.png'.format(self.time))
        plt.pause(1)
        plt.clf()


    def diffuse(self, dt):
        diffuse_sigma = np.sqrt(2*self.D*dt)
        if dt < 0:
            breakpoint()
        padsize = int((4*diffuse_sigma)//(self.dimstep*2))
        if self.bc == 'temp':
            padsize = int((4*diffuse_sigma)//(self.dimstep*2))
            if padsize == 0:
                padsize = 1
            theta_pad = np.pad(self.theta, ((padsize, padsize), (padsize, padsize), (padsize, padsize)), mode = 'reflect') - 300
            theta_pad_flip = np.copy(theta_pad)
            theta_pad_flip[-padsize:, :, :]  = -theta_pad[-padsize:, :, :]
            theta_pad_flip[:padsize, :, :]  = -theta_pad[:padsize, :, :]
            theta_pad_flip[:, -padsize:, :] = -theta_pad[:, -padsize:, :]
            theta_pad_flip[:, :padsize, :] = -theta_pad[:, :padsize, :]
            theta_pad_flip[:, :, :padsize] = -theta_pad[:, :, :padsize]
            theta_pad_flip[:, :, -padsize:] = theta_pad[:, :, -padsize:]

            theta_diffuse = gaussian_filter(theta_pad_flip, sigma = diffuse_sigma/self.dimstep)[padsize:-padsize, padsize:-padsize, padsize:-padsize]  + 300
        if self.bc == 'flux':
            if padsize == 0:
                padsize = 1
        
            theta_pad = np.pad(self.theta, ((padsize, padsize), (padsize, padsize), (padsize, padsize)), mode = 'reflect') - 300
            theta_pad_flip = np.copy(theta_pad)
            theta_pad_flip[-padsize:, :, :]  = theta_pad[-padsize:, :, :]
            theta_pad_flip[:padsize, :, :]  = theta_pad[:padsize, :, :]
            theta_pad_flip[:, -padsize:, :] = theta_pad[:, -padsize:, :]
            theta_pad_flip[:, :padsize, :] = theta_pad[:, :padsize, :]
            theta_pad_flip[:, :, :padsize] = -theta_pad[:, :, :padsize]
            theta_pad_flip[:, :, -padsize:] = theta_pad[:, :, -padsize:]

            theta_diffuse = gaussian_filter(theta_pad_flip, sigma = diffuse_sigma/self.dimstep)[padsize:-padsize, padsize:-padsize, padsize:-padsize]  + 300

        if (self.theta.shape == (0, 0, 0)):
            breakpoint()
        
        self.theta = theta_diffuse
        return theta_diffuse
    

    def meltpool(self, calc_length = False, calc_width = False, verbose = False):
        y_center = np.unravel_index(np.argmax(self.theta[:, :,-1 ]), self.theta[:, :, -1].shape)[1]
        #  breakpoint()
        if not np.array(self.theta[:,:,-1]>self.melt_T).any():
            print(f"Energy Density too low to melt material, melting temperature: {self.melt_T} K, max temperature: {np.max(self.theta[:,:,-1])} K")
            prop_l = 0
            prop_w = 0
            depth = 0
            if calc_length and calc_width:
                return prop_w, prop_l, depth
            elif calc_length:
                return prop_l, depth
            elif calc_width:
                return prop_w, depth
            else:
                return  depth, depths
        else:
            if calc_length:
                f = interp.CubicSpline(self.xs, self.theta[:, y_center, -1] - self.melt_T)
                try:
                    root = optimize.brentq(f, self.xs[1], self.location[0] - self.dimstep)

                    root2 = optimize.brentq(f, self.location[0] - self.dimstep, self.xs[-1])
                    length = root2 - root
                    if verbose:
                        print("Length: " + str((root2 - root)*1e6))
                    prop = measure.regionprops(np.array(self.theta[:,:,-1]>self.melt_T, dtype = 'int'))
                    prop_l = prop[0].major_axis_length*self.dimstep
                    # length =  prop_l
                    print("Length: " + str(prop_l*1e6))

                except:

                    from skimage import measure
                    prop = measure.regionprops(np.array(self.theta[:,:,-1]>self.melt_T, dtype = 'int'))
                    if not np.array(self.theta[:,:,-1]>self.melt_T).any():
                        prop_l = 0
                    else:
                        prop_l = prop[0].major_axis_length*self.dimstep
                    length =  prop_l
                    if verbose:
                        print("Length: {:.04} ± {:.04}".format(prop_l*1e6, self.dimstep*1e6))

                
            if calc_width:
                
                widths = []
                for i in range(len(self.xs)):
                    g = interp.CubicSpline(self.ys, self.theta[i, :, -1] - self.melt_T)
                    if self.theta[i,y_center,-1] > self.melt_T:
                        root = optimize.brentq(g, self.ys[1],0)
                        root2 = optimize.brentq(g,0, self.ys[-1])
                        widths.append(np.abs(root2-root))
                from skimage import measure
                prop = measure.regionprops(np.array(self.theta[:,:,-1]>self.melt_T, dtype = 'int'))
                prop_w = prop[0].minor_axis_length*self.dimstep
                if verbose:
                    print("Width: {:.04} ± {:.04}".format(prop_w*1e6, self.dimstep*1e6))


            depths = []
            # breakpoint()
            for j in range(len(self.ys)):
                for i in range(len(self.xs)):               
                    if self.theta[i, j, -1] > self.melt_T:
                        g = interp.CubicSpline(self.zs, self.theta[i, j, :] - self.melt_T)
                        root = optimize.brentq(g, self.zs[0],self.zs[-1])
                        depths.append(root)
                        self.depths[i, j] = -1*root
                        self.depths_pcl = np.vstack((self.depths_pcl, np.array([self.xs[i], self.ys[j], root])))
            # breakpoint()
            if len(depths) == 0:
                depth = 0
            else:
                depth = np.min(depths)
                print("Depth: " + str(-1*depth*1e6))
            # breakpoint()
            if calc_length and calc_width:
                return prop_w, prop_l, depth
            elif calc_length:
                return prop_l, depth
            elif calc_width:
                return prop_w, depth
            else:
                return  depth, depths

    def rotate(self, sol, phi):

        new_theta = np.copy(sol.theta)
        x_offset = len(self.xs)//2
        y_offset = len(self.ys)//2
        origin = np.array([x_offset, y_offset])    

        new_theta = np.copy(sol.theta)
        new_theta = np.roll(new_theta, (len(self.xs)//2 - origin[0], len(self.ys)//2 - origin[1]), axis = (0,1))
        rot_theta = intp.rotate(new_theta, angle = np.rad2deg(phi), reshape = False, cval = self.T0)
        new_theta = np.roll(rot_theta, (-len(self.xs)//2 + origin[0], -len(self.ys)//2 + origin[1]), axis = (0,1))

        return new_theta



def run_sample(bc = 'flux', 
               V = 0.4, # Velocity [m/s]
               absorp = 1, # Absorptivity
               cp = 561.5,  # Specific Heat [J/kgK]
               k = 7.2, # Thermal Conductivity [W/mK]
               beamD = 50e-6,  # Beam Diameter [m]
               rho = 4470.5, # Density [kg/m^3]
               P = 280, # Power [W]
               melt_T= 1649, # Melting Temperature [K]
               save = False, 
               resolution = 5e-6, # Resolution [m]
               bounds = {'x': [0, 1000e-6], 'y': [-300e-6, 300e-6], 'z': [-400e-6, 0]}, output_folder = None, show = False
               ):
    
    test = EagarTsai(resolution,
                      bc = bc, 
                      V = V, 
                      absorp = absorp, 
                      cp = cp, 
                      k = k, 
                      beamD = beamD, 
                      rho = rho,
                      P = P, 
                      melt_T= melt_T,
                      bounds = bounds) 
    #test = EagarTsai(5e-6)
    times = []
    depth = []
    widths_text = []
    lengths_text = []
    depths_text = []
    widths = []
    lengths = []
    depths = []
    default_time = 1500e-6
    if default_time*V > 800e-6: # Length of domain (default)
        time = 800e-6/V
        # Don't run off the side of the domain
        time = (time//250e-6)*250e-6

        print(f"Path too long, reducing time to {time}")
    else:
        time = default_time
    if time < 250e-6:
        print(f'Velocity {V} m/s is too high to simulate, either expand the domain or reduce the velocity to a max of {800e-6/250e-6} m/s')
        return
    # breakpoint()
    for i, dt in tqdm(enumerate(np.arange(0, time, 250e-6)), total = int(time/250e-6)):
        test.forward(250e-6, 0, V = V, P = P)
        times.append(test.time)
        # width = 
        # breakpoint()
        w,l, d = test.meltpool(calc_width = True, calc_length = True)
        widths.append(w)
        # lengths.append(l)
        depths.append(d)
        lengths.append(l)
        depth.append(d)

        if save:
            if output_folder is not None:
                
                os.makedirs(output_folder, exist_ok = True)
            else:
                output_folder = 'output'
                os.makedirs(output_folder, exist_ok = True)
            
            np.save(os.path.join(output_folder, 'meltpool_timestep_{}.npy'.format(i)), test.theta)
            np.savetxt(os.path.join(output_folder, 'times.txt'),times)
            np.savetxt(os.path.join(output_folder, 'widths.txt'),widths)
            np.savetxt(os.path.join(output_folder, 'lengths.txt'),lengths)
            np.savetxt(os.path.join(output_folder, 'depths.txt'),depths)
            if show:
                test.plot_video()

    return test


def run_from_data(data_dict, absorp = 0.5, resolution  = 5e-6):

    run_sample(bc='temp', 
                V=data_dict['V'], #  Velocity [m/s]
                absorp=absorp, # Absorptivity
                cp=data_dict['cp'],  # Specific Heat [J/kgK]
                k=data_dict['k'], # Thermal Conductivity [W/mK]
                beamD=data_dict['beam D'], # Beam Diameter [m]
                rho=data_dict['rho'],  # Density [kg/m^3]
                P=data_dict['P'],       # Power [W]
                melt_T=data_dict['melt T'], # Melting Temperature [K]
                resolution=resolution # Resolution [m]
                )


if __name__ == "__main__":
    # main()
    # breakpoint()
    data_dict = {}
    data_dict['V'] = 1#features[0]/1000 
    data_dict['cp'] = 470#features[1]
    data_dict['k'] = 13.4#features[2]
    data_dict['beam D'] = 200e-6#features[3]*1e-6
    data_dict['rho'] = 7950#features[4]
    data_dict['P'] = 280#features[5]
    data_dict['melt T'] =1424+293#features[6]
    run_from_data(data_dict, absorp = 0.4)
    # query_lof(data_dict)
