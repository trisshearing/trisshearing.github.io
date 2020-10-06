#!/usr/bin/env python
# coding: utf-8

# Imports

# In[1]:


import matplotlib
matplotlib.use('TkAgg')
import csv
import matplotlib.pyplot as plt
from tkinter import *
import tkinter

import numpy as np


# Creation of global variables

# In[2]:


geology = []
transport = []
population = []
reranged=[]


# Take in data and user-defined weightings and give reranged totals

# In[3]:


def weightings():
    reranged.clear() 
    
    gfac=geol.get()
    tfac=trans.get()
    pfac=pop.get()
    #print (gfac,tfac,pfac) 
    
    #iterate through list of lists of values in each image to multiply values by the weights
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
                col = abs(255-col) #display inverted to give higher values closer to transport links. Gives high values for
                                    #sea area hence need to mask these areas.
                weighted_trans.append(col*tfac)
    
    with open('population.txt') as p:
        reader = csv.reader(p, quoting=csv.QUOTE_NONNUMERIC)
        
        for row in reader:
            weighted_pop = []
            population.append(weighted_pop)
            for col in row:
                weighted_pop.append(col*(pfac))
                
       
    #sum the weighted values in corresponding positions in each image, masked by geology image where 0=sea.  
    sum_values = []       
    for row in range(len(geology)):
        rowlist = []
        sum_values.append(rowlist)     
        for col in range(len(geology[0])):
        
            if (geology[row][col] != 0):
            
                rowlist.append(transport[row][col] + geology[row][col] + population[row][col])
            else:
                rowlist.append(0)
    
    #find largest value  
    max_value = np.max(sum_values)
    max_value = np.max(max_value)
    print (max_value)

    #rerange the totals from 0 to 255
    for row in sum_values:
        value = []
        reranged.append(value)
        for col in row:
            value.append((255*col)/max_value)
    return [reranged]


# Create tkinter window to display plot

# In[4]:


def plot():
    #create window
    mapplot = tkinter.Tk()
    mapplot.wm_title("Site Location Map based on parameters given")
    
    #create mapplotlib figure displaying reranged data
    fig = plt.figure(figsize=(7, 7), clear=True)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.imshow(reranged, cmap='gray', vmin=0, vmax=255)
    
    canvas = matplotlib.backends.backend_tkagg.FigureCanvasTkAgg(fig, master=mapplot)
    canvas._tkcanvas.pack(side=tkinter.TOP, fill=tkinter.BOTH, expand=1)

    Button(mapplot, text='Save this file as CSV', command=save_map).pack() #save map
    
    Button(mapplot, text='Close', command=lambda:[plt.close, mapplot.destroy()]).pack() #close map
    
    mapplot.mainloop() 


# Run functions in order when 'Submit' button pressed

# In[5]:


def run():
    weightings()
    plot()
    


# Create txt document when save_map command button on plot window is pressed

# In[6]:


def save_map():
    #creates txt document in same location as program files 
    with open('SiteLocation.txt', 'w', newline='') as m:
        writer = csv.writer(m)
        writer.writerows(reranged)


# Create tkinter window with sliders to define weightings
#    
#         

# In[ ]:


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


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




