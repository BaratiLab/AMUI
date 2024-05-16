
from eagartsai_amui.simulation.eagartsai import EagarTsai
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import os
import argparse


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
            print(parameter, data_point[parameter])
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
def benchmark():    
    truth = EagarTsai(10e-6)
    truth.forward(3750e-6, 0)
    breakpoint()
    gtl, gtw, gtd = truth.meltpool()
    times = np.linspace(10e-6, 250e-6, num = 10)
    sizes = [5e-6, 10e-6, 20e-6]
    results = []

    for a in sizes:
        time_results = []
        for b in times:
            test = EagarTsai(a)
            step = b

            for iter in range(len(np.arange(3750e-6, step = step) + 1)):
                test.forward(step, 0)
            l, w, d = test.meltpool()

            time_results.append([l, w, d])
        results.append([time_results])

    sizes20 = np.array(results[2][0])
    plt.plot(times, np.abs((sizes20[:, 0] - gtl)/gtl), '.-', label = r"20 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes10 = np.array(results[1][0])
    plt.plot(times, np.abs((sizes10[:, 0] - gtl)/gtl), '.-', label = r"10 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes5 = np.array(results[0][0])
    plt.plot(times, np.abs((sizes5[:, 0] - gtl)/gtl), '.-', label = r"10 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")


    
    plt.title(r"Length Error, $l_0$ = " + str(311.59))
    plt.yscale('log')
    plt.legend()
    plt.show()

    sizes20 = np.array(results[2][0])
    plt.plot(times, np.abs((sizes20[:, 1] - gtw)/gtw), '.-', label = r"20 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes10 = np.array(results[1][0])
    plt.plot(times, np.abs((sizes10[:, 1] - gtw)/gtw), '.-', label = r"10 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes5 = np.array(results[0][0])
    plt.plot(times, np.abs((sizes5[:, 1] - gtw)/gtw), '.-', label = r"10 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")


    
    plt.title(r"Width Error, $w_0$ = " + str(133.58) + r"$\mu$m")
    plt.yscale('log')
    plt.legend()
    plt.show()


    sizes20 = np.array(results[2][0])
    plt.plot(times, np.abs((sizes20[:, 2] - gtd)/gtd), '.-', label = r"20 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes10 = np.array(results[1][0])
    plt.plot(times, np.abs((sizes10[:, 2] - gtd)/gtd), '.-', label = r"10 $\mu m$")
    plt.xlabel(r"$\Delta t$")
    plt.ylabel("Relative Error")

    sizes5 = np.array(results[0][0]) #breakpoint()
    plt.ylabel("Relative Error")


    
    plt.title(r"Depth Error, $d_0$ = " + str(52.88) + r"$\mu$m")
    plt.yscale('log')
    plt.legend()
    plt.show()
    breakpoint()

def square(plotting = False):
    c = 0
    test = EagarTsai(20e-6)
    time = 1000e-6
    test.forward(time, 0)
    test.plot()
    plt.savefig("newfixed" +  '%04d' % 0 + ".png")
    c = c+1
    print("Frame: " + str(c))
    plt.clf()


    time = 1000e-6
    test.forward(time, np.pi/2)
    test.plot()
    plt.savefig("newfixed" +  '%04d' % 1 + ".png")
    c = c+1
    print("Frame: " + str(c))
    plt.clf()


    time = 1000e-6
    test.forward(time, -np.pi)
    test.plot()
    plt.savefig("newfixed" +  '%04d' % 2 + ".png")
    c = c+1
    print("Frame: " + str(c))
    plt.clf()


    time = 1000e-6
    test.forward(time, -np.pi/2)
    test.plot()
    plt.savefig("newfixed" +  '%04d' %  3 + ".png")
    c = c+1
    print("Frame: " + str(c))
    plt.clf()
# def test():
#     test = EagarTsai(5e-6)
#     for dt in np.arange(0, 3750e-6, 250e-6):
#         test.forward(250e-6, 0)
#         print(np.max(test.theta))
#         test.meltpool(calc_length=True, calc_width=True)
def zigzag(plotting = False):
    zz = EagarTsai(10e-6, bc = 'temp')
    c = 0 
    depth = []
    depth.append(0) 
    c = 0
    # plotting = sys.argv[1] == 'True'

    for iter in range(21):
        if iter % 4 == 0:
            for dt in np.arange(0, 1200e-6, 125e-6):
                
                zz.forward(125e-6, 0)
                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig('zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig('zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig('zz_z' +  '%04d' % c + ".png")
                #plt.show()
                c += 1
                #depth.append(zz.meltpool())

        if iter % 4 == 1 or iter % 4 == 3:
            for dt in np.arange(0, 120e-6, 125e-6):
                zz.forward(125e-6, np.pi/2)
                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig('zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig('zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig('zz_z' +  '%04d' % c + ".png")
                c += 1 
                #depth.append(zz.meltpool())
        if iter % 4 == 2: 
            for dt in np.arange(0, 1200e-6, 125e-6):
                zz.forward(125e-6, np.pi)

                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig('zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig('zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig('zz_z' +  '%04d' % c + ".png")
                c += 1
              #  depth.append(zz.meltpool())
  #  breakpoint()

def closezigzag(plotting = False):
    zz = EagarTsai(20e-6, bc = 'flux')
    c = 0 
    depth = []
    depth.append(0) 
    c = 0
    # plotting = sys.argv[1] == 'True'
    testdirectory = 'testfigures/'
    if plotting:
        os.makedirs(testdirectory, exist_ok=True)
    for iter in range(21):

        print(iter, "ITER", zz.time, "TIME")
        if iter % 4 == 0:
            for dt in np.arange(0, 1200e-6, 125e-6):
                
                zz.forward(125e-6, 0)
                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig(testdirectory+'close20zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig(testdirectory+'close20zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig(testdirectory+'close20zz_z' +  '%04d' % c + ".png")
                #plt.show()
                c += 1
                depth.append(zz.meltpool())

        if iter % 4 == 1 or iter % 4 == 3:
            for dt in np.arange(0, 120e-6, 125e-6):
                zz.forward(125e-6, np.pi/2)
                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig(testdirectory+'close20zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig(testdirectory+'close20zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig(testdirectory+'close20zz_z' +  '%04d' % c + ".png")
                c += 1 
                depth.append(zz.meltpool())
        if iter % 4 == 2: 
            for dt in np.arange(0, 1200e-6, 125e-6):
                zz.forward(125e-6, np.pi)

                if plotting:            
                    figures = zz.plot()
                    figures[0].savefig(testdirectory+'close20zz_x' +  '%04d' % c + ".png")
                    figures[1].savefig(testdirectory+'close20zz_y' +  '%04d' % c + ".png")
                    figures[2].savefig(testdirectory+'close20zz_z' +  '%04d' % c + ".png")
                c += 1
                depth.append(zz.meltpool())
    breakpoint()
    
def diagonal(plotting = False):
    diag = EagarTsai(20e-6, bc = 'flux')
    c = 0 
    depth = []
    times = []
    depth.append(0) 
    # plotting = sys.argv[1] == 'True'
    times.append(0)
    V = 0.8
    h = (1000e-6)/7
    for i in range(27):
        if i < 14:
            idx = ((i + 1)/2)
            if i % 4 == 0:
                l = h
                angle = 0
                dtprime = 0
            if i % 4 == 1:            
                l = np.sqrt(2*(h**2)*idx**2)
                #breakpoint()
                dtprime = 0
                angle = 3*np.pi/4
            if i % 4 == 2:
                l = h
                dtprime = 0
                angle = np.pi/2
            if i % 4 == 3:

                l = np.sqrt(2*(h**2)*idx**2)
                dtprime = 0
                angle = 7*np.pi/4
        if i >= 14:
            idx = ((27-i)/2)
         #   breakpoint()
            if i % 4 == 0:
                l = h
                dtprime = 0
                angle = np.pi/2
                
            if i % 4 == 1:            
                l = np.sqrt(2*(h**2)*idx**2)
                #breakpoint()
                dtprime = 0
                angle = 3*np.pi/4
            if i % 4 == 2:
                l = h
                dtprime = 0
                angle = 0

            if i % 4 == 3:
                l = np.sqrt(2*(h**2)*idx**2)
                dtprime = 0
                angle = 7*np.pi/4

        for dt in np.arange(100e-6, l/V, 100e-6):
            diag.forward(100e-6, angle)
            dtprime += 100e-6
            times.append(diag.time)
            depth.append(diag.meltpool())
            #  breakpoint()
            print(dtprime)

            c += 1
            if plotting:
                figures = diag.plot()
                figures[0].savefig('diagaltdebug_20_x' +  '%04d' % c + ".png")
                figures[1].savefig('diagaltdebug_20_y' +  '%04d' % c + ".png")
                figures[2].savefig('diagaltdebug_20_z' +  '%04d' % c + ".png")
        diag.forward(l/V - dtprime, angle )
        times.append(diag.time)
        depth.append(diag.meltpool())
        c += 1
        if plotting:
            figures = diag.plot()
            figures[0].savefig('diagaltdebug_20_x' +  '%04d' % c + ".png")
            figures[1].savefig('diagaltdebug_20_y' +  '%04d' % c + ".png")
            figures[2].savefig('diagaltdebug_20_z' +  '%04d' % c + ".png")
    if not plotting:
        plt.plot(np.array(times)*1e3, np.array(depth)*1e6)
        plt.xlabel(r'Time, $t$ [ms]')
        plt.ylabel(r'Melt Depth, $d$, [$\mu$m]')
        np.savetxt('depth10', depth)
        np.savetxt('time10', times)
        plt.savefig('depthsdiag10.png')
        plt.show()
  

def test(bc = 'flux', V = 0.4, absorp = 1, cp = 561.5, k = 7.2, beamD = 50e-6, rho = 4470.5, P = 280, melt_T= 1649, hatchspacing = 140e-6, gtdepth = 84, entry =0, material = None):
    test = EagarTsai(20e-6, bc = bc, V = V, absorp = absorp, cp = cp, k = k, beamD = beamD, rho = rho, P = P, melt_T= melt_T) 
    #test = EagarTsai(5e-6)
    times = []
    depth = []
    for dt in np.arange(0, 3750e-6, 250e-6):
        test.forward(250e-6, 0)
        print(np.max(test.theta))
        times.append(test.time)
        depth.append(test.meltpool())
        test.plot()
        plt.show()
        # plt.pause(0.1)
        # plt.close('all')
def triangle(plotting = False):
    tri = EagarTsai(10e-6, bc = 'temp')
    c = 0 
    depth = []
    times = []
    depth.append(0) 
    times.append(0)
    # plotting = sys.argv[1] == 'True'
    for i in range(12):
        plt.close('all')
        V = 0.8
        idx = i -1
        if idx < 0:
            idx = 0
        h = 750e-6 - idx*70e-6
        dtprime = 0
        angle = (i % 3)*2*np.pi/3
        step = 50e-6
        P = 200
        if i == 11:
            P = 0
        for dt in np.arange(step, h/V, step):
            tri.forward(step, angle, V = 0.8, P = P)
            depth.append(tri.meltpool())
            times.append(tri.time)
            dtprime += step
            c += 1
            # print(c, "C", str(h/V) + "h/V", str(dt) + "dt")
            if plotting:
                figures = tri.plot()
                figures[0].savefig('newtriangle5_x' +  '%04d' % c + ".png")
                figures[1].savefig('newtriangle5_y' +  '%04d' % c + ".png")
                figures[2].savefig('newtriangle5_z' +  '%04d' % c + ".png")
        tri.forward(h/V - dtprime, angle, P = P)
        depth.append(tri.meltpool())
        times.append(tri.time)
        c += 1
        if plotting:
            figures = tri.plot()
            figures[0].savefig('newtriangle5_x' +  '%04d' % c + ".png")
            figures[1].savefig('newtriangle5_y' +  '%04d' % c + ".png")
            figures[2].savefig('newtriangle5_z' +  '%04d' % c + ".png")
    if not plotting:
        plt.plot(np.array(times)*1e3, np.array(depth)*1e6)
        plt.xlabel(r'Time, $t$ [ms]')
        plt.ylabel(r'Melt Depth, $d$, [$\mu$m]')
        plt.show()
        breakpoint()
  #  triangle()
def triangle_turnoff(plotting = False):
    tri = EagarTsai(10e-6, bc = 'temp')
    c = 0 
    depth = []
    times = []
    depth.append(0) 
    times.append(0)
    powers  = []
    # plotting = sys.argv[1] == 'True'
    plotting = True
    os.makedirs('sample_conduction_temperatures/figures/', exist_ok=True)

    for i in range(12):
        plt.close('all')
        V = 0.8
        idx = i -1
        if idx < 0:
            idx = 0
        h = 750e-6 - idx*70e-6
        dtprime = 0
        angle = (i % 3)*2*np.pi/3
        step = 50e-6
        P = 200
        if i == 11:
            P = 0
        if c > 5:
            P = 0
        
        for dt in np.arange(step, h/V, step):

            print('c = ', c)
                
            tri.forward(step, angle, V = 0.8, P = P)
            powers.append(P)
            times.append(tri.time)
            depth.append(tri.meltpool()[0])
            dtprime += step
            c += 1
            # print(c, "C", str(h/V) + "h/V", str(dt) + "dt")
            if plotting:
                figures = tri.plot()
                figures[0].savefig('sample_conduction_temperatures/figures/offnewtriangle5_x' +  '%04d' % c + ".png")
                figures[1].savefig('sample_conduction_temperatures/figures/offnewtriangle5_y' +  '%04d' % c + ".png")
                figures[2].savefig('sample_conduction_temperatures/figures/offnewtriangle5_z' +  '%04d' % c + ".png")
                np.save('sample_conduction_temperatures/temperature{:04d}.npy'.format(c), tri.theta)

        tri.forward(h/V - dtprime, angle, P = P)
        depth.append(tri.meltpool()[0])
        times.append(tri.time)
        powers.append(P)
        c += 1
        if plotting:
            figures = tri.plot()
            figures[0].savefig('sample_conduction_temperatures/figures/offnewtriangle5_x' +  '%04d' % c + ".png")
            figures[1].savefig('sample_conduction_temperatures/figures/offnewtriangle5_y' +  '%04d' % c + ".png")
            figures[2].savefig('sample_conduction_temperatures/figures/offnewtriangle5_z' +  '%04d' % c + ".png")
            np.save('sample_conduction_temperatures/temperature{:04d}.npy'.format(c), tri.theta)
    if not plotting:
        plt.plot(np.array(times)*1e3, np.array(depth)*1e6)
        plt.xlabel(r'Time, $t$ [ms]')
        plt.ylabel(r'Melt Depth, $d$, [$\mu$m]')
        plt.show()
        breakpoint()
    np.savetxt('sample_conduction_temperatures/times.txt', times)
    np.savetxt('sample_conduction_temperatures/powers.txt', powers)

def main():
    # Test cases: zigzag, square, triangle, diagonal
    csv = pd.read_csv('/home/cmu/CNN_AM_Project/meltpoolgeometrynew.csv')
    absorp = 0.5

    parameter_list = ['Velocity', 'Cp', 'k', 'beam D', 'density', 'Power', 'melting T', 'Hatch spacing', 'Material']
    parameter_list = ['Velocity', 'Cp','k', 'beam D', 'density', 'Power', 'melting T', 'Hatch spacing']
    label_col = 'depth of meltpool'
    data_list = []

    label_list = []
    process = 'LPBF'
    defect = 'desirable'
    # for defect in ['desirable']:
        #for absorp in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]:
        # for absorp in [0.3]:
            # etdepths = []
            # gtdepths = []
    for i in range(len(csv)):
        if csv['Material'].iloc[i] == 'SS316L':

    # for i in range(2):
            success, features, label = extract_features(csv.iloc[i], parameter_list, label_col)
            print(success)
            data_dict = {}
            #if success > -1:
            #$    breakpoint()
            if success < 0 or csv['meltpool shape'].iloc[i] != defect or csv['Process'].iloc[i] != process:
                
            #   print("CONTINUE")
                if success > -1:
                    print('here')
                    print(csv['Process'].iloc[i] == process)
                    print(success, csv['meltpool shape'].iloc[i] == defect,csv['Process'].iloc[i] != process)
                
                continue
            else:
                data_dict['V'] = features[0]/1000 
                data_dict['cp'] = features[1]
                data_dict['k'] = features[2]
                data_dict['beam D'] = features[3]*1e-6
                data_dict['rho'] =features[4]
                data_dict['P'] = features[5]
                data_dict['melt T'] =features[6]
                #data_dict['hatchspacing'] = features[7]*1e-6
                data_dict['material'] = csv['Material'].iloc[i]
                
                data_dict['gt']  = label
                break
    # breakpoint()
    # plt.title('P = {} W'.format(200))
    test(bc='temp', V=data_dict['V'], absorp=absorp, cp=data_dict['cp'], k=data_dict['k'], beamD=data_dict['beam D'], rho=data_dict['rho'],  P=data_dict['P'],
                                                melt_T=data_dict['melt T'],  gtdepth=data_dict['gt'], entry=i, material=data_dict['material'])
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--labels', type=str,
                        help='Test scenario')
    parser.add_argument('--sigma', type=float,
                        help='Laser beam diameter')
    parser.add_argument('--plotting', type=bool,
                        help='Whether to plot output')
    args = parser.parse_args()
    if args.labels == 'closezigzag':
        closezigzag(plotting = args.plotting)
    if args.labels == 'square':
        square(plotting = args.plotting)
    if args.labels == 'triangle':
        triangle(plotting = args.plotting)
    if args.labels == 'diagonal':
        diagonal(plotting = args.plotting)
    if args.labels == 'cond' or  args.labels == None:
        triangle_turnoff(plotting = args.plotting)


if __name__ == "__main__":
    main()