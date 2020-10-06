# -*- coding: utf-8 -*-
"""
Created on Tue Jul 28 14:39:20 2020

@author: Tris
"""

import requests
import bs4

r = requests.get('http://www.geog.leeds.ac.uk/courses/computing/practicals/python/agent-framework/part9/data.html')
content = r.text
soup = bs4.BeautifulSoup(content, 'html.parser')
td_ys = soup.find_all(attrs={"class" : "y"})
td_xs = soup.find_all(attrs={"class" : "x"})



import matplotlib
matplotlib.use('TkAgg')

import tkinter
import csv
import matplotlib.pyplot
import matplotlib.animation
import agentframework
import random



environment = []
agents =[]


num_of_agents = int(input ("How many sheep? "))
num_of_iterations = int(input ("How many mouthfuls? "))
neighbourhood = 20

#import environment
with open('in.txt') as f:
    reader = csv.reader(f, quoting=csv.QUOTE_NONNUMERIC)
    
    for row in reader:
        rowlist = []
        environment.append(rowlist)
        for value in row:
            rowlist.append(value)

#matplotlib.pyplot.imshow(environment)
#matplotlib.pyplot.show()              

#a = agentframework.Agent(agents, environment)
#print(a.y, a.x)
#a.move()
#print(a.y,a.x)

#create pyplot
fig = matplotlib.pyplot.figure(figsize=(7, 7))
ax = fig.add_axes([0, 0, 1, 1])
#ax.set_autoscale_on(False)



#make the agents
for i in range(num_of_agents):
    y = int(td_ys[i].text)
    x = int(td_xs[i].text)
    agents.append(agentframework.Agent(agents, environment, y, x))
    #print (y,x,(environment[y][x]))
   

#carry_on = True

def update(frame_number):
    
    fig.clear() 
    #global carry_on
    

    #shuffle order of agent movements
    for i in random.sample(range(num_of_agents), k=(num_of_agents)): 
        
        agents[i].move()
        agents[i].eat()
        agents[i].share_with_neighbours(neighbourhood)
    
    matplotlib.pyplot.ylim(0, 99)
    matplotlib.pyplot.xlim(0, 99)
    matplotlib.pyplot.imshow(environment)
    
    for i in range (num_of_agents):
        matplotlib.pyplot.scatter(agents[i].x, agents[i].y)

#def gen_function(b = [0]):
#    a = 0
#    global carry_on #Not actually needed as we're not assigning, but clearer
#    while (a < 10) & (carry_on) :
#        yield a			# Returns control and waits next call.
#        a = a + 1
    
        
   

def run():
    animation = matplotlib.animation.FuncAnimation(fig, update, 
    frames=num_of_iterations, repeat=False)
    canvas.draw()
    
def input_gui():#build input GUI
    agents = sheep.get()
    iterations = mouthfuls.get()
    
    _input = tkinter.Tk()
    _input.wm.title("Parameter Selection")
    tk.Label(_input, text="ow many )
    
    
#build main GUI window   
root = tkinter.Tk()
root.wm_title("Model")
canvas = matplotlib.backends.backend_tkagg.FigureCanvasTkAgg(fig, master=root)
canvas._tkcanvas.pack(side=tkinter.TOP, fill=tkinter.BOTH, expand=1)    

#build GUI menu
menu_bar = tkinter.Menu(root)
root.config(menu=menu_bar)
model_menu = tkinter.Menu(menu_bar)
menu_bar.add_cascade(label="Model", menu=model_menu)
model_menu.add_command(label="Run model", command= run)
model_menu.add_command(label="Exit", command=root.quit)

tkinter.mainloop() # Wait for interactions.
   