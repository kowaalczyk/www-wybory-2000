# Wybory 2000  
WWW Applications project #1, University of Warsaw, spring semester 2017-18

<img src="https://i.imgur.com/wOI2sgm.png" alt="page mockups"/>

## Assignment  

As a first assignment for www applications, we had to prepare a website generator 
that will transform an old page containing 2000 polish presidential elections' results 
into a modern web page.  


## Development  

We had to meet following requirements:  
- generated HTML and CSS complies with modern standards  
- all pages are responsive  

As I had some experience with web development already, I decided to use this project 
as a playground for learning new things, such as:  
- flask library and building an API in Python (previously I used only Ruby on Rails 
and JS for web development)  
- enough fluency in modern JS to build a basic SPA without framework (initially 
considered using vue.js but decided it was an overkill for such a small project)


## Application structure  
Application consist of two python files that are used to download data (`download_xls.py`) and parse 
downloaded files into an sqlite database `parse.py`. After such preprocessing, 
the server logic itself is all packed into `server.py`.  

The server is just an API with static file server. Initial request is redirected 
to static `index.html` which contains all css and scripts necessary to use 
the app, including `app.js` where all front end logic and routing happens.  


## Installing and running  

Application requires python 3.6 and sqlite to be installed.  

After cloning the repo, all necessary python packages can be installed 
from provided `requirements.txt`.  
After completing installation, to download and parse files execute 
(in project folder):  

```
python3.6 download_xls.py  
python3.6 parse.py  
```
  
if no error messages are present, you can run the server by executing:
```
python3.6 server.py  
```


## Known issues and bugs  

As I mentioned before, this project is not in release state.  

There is no error handling except for pre-processing part.  

When displaying a filterable chart with many options on smaller devices, chart 
positioning is broken - due to scaling issues in chart.js I was unable to set a 
position of chart itself (only the bars, without legend), and only viable solution 
would be to hide filtering if there is a lot of categories. This is a bad solution, 
and I am considering switching chart library if I ever come back to this project.  

Search functionality is not yet implemented.  

Choosing location from menus can be painful, as they are not always scoped by 
parent location (there are too much choices).  


## 3rd party libraries  

Application uses following open source libraries:  
- chart.js  
- navigo.js  
- flask  
- pandas  
- beautiful soup  
