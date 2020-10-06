
import matplotlib
matplotlib.use('TkAgg')

import csv

import matplotlib.pyplot as plt
from tkinter import *
import tkinter
import sys
import numpy as np 




geology = []
transport = []
population = []
reranged=[]





def weightings():
    print (geol.get(), trans.get(), pop.get())
    gfac=geol.get()
    tfac=trans.get()
    pfac=pop.get()
    print (gfac,tfac,pfac)
    
    
    with open('geology.txt') as g:
        reader = csv.reader(g, quoting=csv.QUOTE_NONNUMERIC)
        for row in reader:
            weighted_geol = []
            geology.append(weighted_geol)
            for col in row:
               weighted_geol.append(col*gfac)

    with open('transport.txt') as t:
        reader = csv.reader(t, quoting=csv.QUOTE_NONNUMERIC)
        
        for row in reader:
            weighted_trans= []
            transport.append(weighted_trans)
            for col in row:
                col = abs(255-col)
                weighted_trans.append(col*tfac)
    
    with open('population.txt') as p:
        reader = csv.reader(p, quoting=csv.QUOTE_NONNUMERIC)
        
        for row in reader:
            weighted_pop = []
            population.append(weighted_pop)
            for col in row:
                weighted_pop.append(col*(pfac))
                
       
     
    suitability = []       
    for row in range(len(geology)):
        rowlist = []
        
        suitability.append(rowlist)     
        for col in range(len(geology[0])):
        
            if (geology[row][col] != 0):
            
                rowlist.append(transport[row][col] + geology[row][col] + population[row][col])
            else:
                rowlist.append(0)
    
    max_value = np.max(suitability)
    max_value = np.max(max_value)
    #print (type(max_value))
    print (max_value)

    #print(suitability)
    #reranged = []
    for row in suitability:
        value = []
        reranged.append(value)
    
        for col in row:
            value.append((255*col)/max_value)
    return [reranged]       



def plot():
    mapplot = tkinter.Tk()
    mapplot.wm_title("Site Location Map based on parameters given")
    
    fig = plt.figure(figsize=(7, 7))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.imshow(reranged, cmap='gray', vmin=0, vmax=255)
   
    canvas = matplotlib.backends.backend_tkagg.FigureCanvasTkAgg(fig, master=mapplot)
    canvas._tkcanvas.pack(side=tkinter.TOP, fill=tkinter.BOTH, expand=1)

    Button(mapplot, text='Save this file as CSV', command=save_map).pack()
    #Button(mapplot, text="Try again", command = plt.close()).pack()
    Button(mapplot, text='Close', command=lambda:[plt.close, mapplot.destroy()]).pack()

    mapplot.mainloop()
      
    
    
   

   
      
def run():
    weightings()
    plot()
    #try_again()
    

    

    

def save_map():
    #reranged=weightings()
    with open('SiteLocation.txt', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(reranged)

#def _quit():
#   master.quit()     # stops mainloop
#   master.destroy()
#   plt.close()



master = Tk()

master.wm_title("Adjust Factor Weighting")


label = Label(master, padx=10, text="Set relative importance of each factor (10 = most important):")
label.pack()

geol = Scale(master, from_=1, to=10, label= "Geology", tickinterval=9, orient=HORIZONTAL)
geol.set(5)
geol.pack()


trans = Scale(master, from_=1, to=10, label= "Transport", tickinterval=9, orient=HORIZONTAL)
trans.set(5)
trans.pack()

pop = Scale(master, from_=1, to=10, label= "Population", tickinterval=9, orient=HORIZONTAL)
pop.set(5)
pop.pack()

Button(master, text='Submit', command=run).pack()
#Button(master, text='Save Map', command=save_map).pack()
 
Button(master, text='Close', command=master.destroy).pack()



mainloop()


