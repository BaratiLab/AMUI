import numpy as np
from scipy import integrate, special
import numba 
from numba import njit
from numba import boolean, int_, float64,uint8
@njit
def _solve(xs, ys, zs, coeff, rxf, rxr, ry, rz, D, V, sigma, dt):
    """
    Solve one step of the Eagar-Tsai equation using the given parameters.

    Args:
        xs (array-like): Array of x-coordinates.
        ys (array-like): Array of y-coordinates.
        zs (array-like): Array of z-coordinates.
        coeff (float): Coefficient value.
        rxf (float): Lower bound for x-coordinate.
        rxr (float): Upper bound for x-coordinate.
        ry (float): Bound for y-coordinate.
        rz (float): Bound for z-coordinate.
        D (float): Diffusion coefficient.
        V (float): Velocity.
        sigma (float): Laser beam size.
        dt (float): Time step.

    Returns:
        array-like: Array of theta values.
    """

    theta = np.ones((len(xs), len(ys), len(zs)))*300

    for i in range(len(xs)):
        x = xs[i]
        if x > rxr or x < -rxf:
            continue
        for j in range(len(ys)):           
            y = ys[j]
            if y > ry or y < -ry:
                continue
            for k in range(len(zs)):
                z = zs[k]
                if z < -rz:
                    continue
                val = 0

                for taubar in np.arange(dt/5000, dt, step = dt/5000):
                    x = xs[i] - V*dt
                    y = ys[j]
                    z = zs[k]
                    start = taubar**(-0.5)/(sigma**2 + 2*D*taubar)
                    exponent = -1*(((x + V*taubar)**2 + y**2)/(2*sigma**2 + 4*D*taubar) + (z**2)/(4*D*taubar))                    
                    value = coeff*np.exp(exponent)*start*dt/5000
                    val += value
                theta[i, j, k] += val

    return theta


def _altsolve(xs, ys, zs, phi, coeff, rxf, rxr, ry, rz, D, V, sigma, dt):

    theta = np.ones((len(xs), len(ys), len(zs)))*300
    theta = np.ones((len(xs), len(ys), len(zs)))*300
    
    integral_result = integrate.fixed_quad(_freefunc, dt/50000, dt, args=(coeff, xs[:, None, None, None] , ys[None, :, None, None], zs[None, None, :, None], phi, V, D, sigma, dt), n =75)[0] 
    theta +=  integral_result
    return theta
 

@njit
def _freefunc(x, coeff, x_coord, y, z, phi, V, D, sigma, dt):
    xp = -V*x*np.cos(phi)
    yp = -V*x*np.sin(phi)
    lmbda  = np.sqrt(4*D*x)
    gamma  = np.sqrt(2*sigma**2 + lmbda**2)
    start = (4*D*x)**(-3/2)


    termy = sigma*lmbda*np.sqrt(2*np.pi)/(gamma)
    yexp1 = np.exp(-1*((y - yp)**2)/gamma**2)
    termx = termy
    xexp1 = np.exp(-1*((x_coord - xp)**2)/gamma**2)
    yintegral = termy*(yexp1)
    xintegral = termx*xexp1

    zintegral = 2*np.exp(-(z**2)/(4*D*x))
    value = coeff*start*xintegral*yintegral*zintegral
    return value


def _cornersolve(xs, ys, zs, coeff, rxf, rxr, ry, rz, D, V, sigma, dt, dx, dy, phi):
    theta = np.ones((len(xs), len(ys), len(zs)))*300
    theta = np.ones((len(xs), len(ys), len(zs)))*300
    theta +=  integrate.fixed_quad(_cornerfunc, dt/5000, dt, args=(coeff, xs[:, None, None, None] , ys[None, :, None, None], zs[None, None, :, None], dx, dy, V, phi, D, sigma, dt), n =50)[0] 
    return theta

@njit
def _cornerfunc(x, coeff, x_coord, y, z, dx,dy,  V, phi, D, sigma, dt):
    xp = dx - V*x*np.cos(phi)
    yp = dy -V*x*np.sin(phi)
    lmbda  = np.sqrt(4*D*x)
    gamma  = np.sqrt(2*sigma**2 + lmbda**2)
    start = (4*D*x)**(-3/2)

    term = sigma*lmbda*np.sqrt(np.pi)/(gamma*np.sqrt(2))

    exp1 = np.exp(-1*((x_coord - xp)**2/(gamma**2)))
    erfcarg1 = ((-x_coord/gamma)*(sigma*np.sqrt(2)/lmbda) + (-xp/gamma)*(lmbda/(sigma*np.sqrt(2))))
    exp2 = np.exp(-1*((-x_coord-xp)**2/(gamma**2)))
    erfcarg2 = ((x_coord/gamma)*(sigma*np.sqrt(2))/(lmbda) + (-xp/gamma)*(lmbda/(sigma*np.sqrt(2))))
    xintegral = term*(exp1*special.erfc(erfcarg1) + exp2*special.erfc(erfcarg2))
    
    yexp1 = np.exp(-1*((y - yp)**2)/gamma**2)
    yerfcarg1 = ((-y/gamma)*(sigma*np.sqrt(2)/lmbda) + (-yp/gamma)*(lmbda/(sigma*np.sqrt(2))))
    yexp2 = np.exp(-1*((-y-yp)**2/(gamma**2)))
    yerfcarg2 = ((y/gamma)*(sigma*np.sqrt(2))/(lmbda) + (-yp/gamma)*(lmbda/(sigma*np.sqrt(2))))
    yintegral = term*(yexp1*special.erfc(yerfcarg1) + yexp2*special.erfc(yerfcarg2))

    zintegral = 2*np.exp(-(z**2)/(4*D*x))
    value = coeff*start*xintegral*yintegral*zintegral
    return value
    

def _edgefunc(x, coeff, x_coord, y, z, dx, V, phi, D, sigma, dt):
    xp = dx - V*x*np.cos(phi) 
    yp = -V*x*np.sin(phi)
    lmbda  = np.sqrt(4*D*x)
    gamma  = np.sqrt(2*sigma**2 + lmbda**2)

    start = (4*D*x)**(-3/2)
    termy = sigma*lmbda*np.sqrt(2*np.pi)/(gamma)

    yexp1 = np.exp(-1*((y - yp)**2)/gamma**2)
    term = sigma*lmbda*np.sqrt(np.pi)/(gamma*np.sqrt(2))
    exp1 = np.exp(-1*((x_coord - xp)**2/(gamma**2)))
    erfcarg1 = ((-x_coord/gamma)*(sigma*np.sqrt(2)/lmbda) + (-xp/gamma)*(lmbda/(sigma*np.sqrt(2))))
    exp2 = np.exp(-1*((-x_coord - xp)**2/(gamma**2)))
    erfcarg2 = ((x_coord/gamma)*(sigma*np.sqrt(2))/(lmbda) + (-xp/gamma)*(lmbda/(sigma*np.sqrt(2))))

    xintegral = term*(exp1*special.erfc(erfcarg1) + exp2*special.erfc(erfcarg2))
    yintegral = termy*(yexp1)
    zintegral = 2*np.exp(-(z**2)/(4*D*x))
    value = coeff*start*xintegral*yintegral*zintegral
    return value

def _edgesolve(xs, ys, zs, coeff, rxf, rxr, ry, rz, D, V, sigma, dt, dx, phi):

    theta = np.ones((len(xs), len(ys), len(zs)))*300
    theta +=  integrate.fixed_quad(_edgefunc, dt/5000000, dt, args=(coeff, xs[:, None, None, None] , ys[None, :, None, None], zs[None, None, :, None], dx, V, phi, D, sigma, dt), n =50)[0] 

    return theta    




# @njit(boundscheck =  True)
def _graft(theta, sol_theta, xs, ys, zs, l_idx, l_idy, l_new_x, l_new_y):      
    y_offset = len(ys)//2
    x_offset = len(xs)//2
    x_min = np.argmin(np.abs(xs))
    y_min = np.argmin(np.abs(ys))

    x_roll = -(x_offset) + l_idx + l_new_x
    y_roll = -(y_offset) + l_idy + l_new_y

    theta += np.roll(sol_theta, (x_roll, y_roll, 0), axis = (0, 1, 2)) - 300

    return theta

@njit(boundscheck = True)
def _checkellipse(rxf, rxr, ry, rz, l_x, l_y, l_idx, l_idy, ellipse, xs, ys, phi, location_0, location_1):
    corner = False
    edge = False
    xleft = 0
    xright = 0
    yup = 0
    ydown = 0
    dx = -1
    dy = -1
    dxprime = -1
    dyprime = -1
    gamma = phi + np.pi/2
    for i in range(len(xs)):
        x = xs[i]
        for j in range(len(ys)):
            y = ys[j]
            x0 = location_0
            y0 = location_1
            
            b = ry
            a = rxr
            if (x-x0)*np.sin(gamma) - (y -y0)*np.cos(gamma) > 0:
                a = rxr  
            else:
                a = rxf

            if (((x- x0)*np.sin(gamma)- (y - y0)*np.cos(gamma))/a)**2 + (( (x- x0)*np.cos(gamma) + (y - y0)*np.sin(gamma))/b)**2 <= 1:
                ellipse[i, j] = 2
                # if i == 0 or i == len(self.xs) - 1 or j == 0 or j == len(self.ys) - 1:
                #     print("BOUNDARY COLLISION")
                if i == 0:
                    xleft = 1
                    dx = x0 + l_x - xs[0]
                    dxprime = x0  - xs[0]
                    # print("left")
                if i == len(xs) - 1:
                    xright = 1
                    dx =xs[-1] - (x0 + l_x)
                    dxprime = xs[-1] - x0
                    #   breakpoint()
                    # print("right")
                if j == 0:
                    ydown = 1
                    dy = y0 + l_y - ys[0]
                    dyprime = y0  - ys[0]
                    # print("down")
                if j == len(ys) - 1:
                    yup = 1
                    # print("up")
                    dy = ys[-1] - (y0 + l_y) 
                    dyprime = ys[-1] - (y0) 
                    ##  print(dy)

    total = xleft + xright + yup + ydown
   # if total == 0:
     #   print("free solution") 
    if total == 1:
      #  print("edge case")
        edge = True
    if total == 2:
        corner = True
        
    if total > 2:           
        print("More than two edges")
    ddim = [dx, dy] 
    edges = [xleft, xright, ydown, yup]
    distprime = [dxprime, dyprime]
    ellipse = ellipse - 1        
    return corner, edge, ddim, edges, distprime, ellipse