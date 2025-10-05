# 2025 NASA Space Apps Challenge 

## Project: Will it rain on my parade?

### Team: Esnupi coders.

#### Team members:

	- Cruz Cruz Alan Josué.
	- López Villalba Cielo.
	- Matute Cantón Sara Lorena.
	- Noriega Rodríguez Marcos Julián.

Welcome to our submission for the 2025 NASA Space Apps Challenge! 


#### Objective 
There are two constant in life; the weather and people making plans. The weather can either be beneficial or detrimental to our beloved plans, witth this we aim to help aliviate the uncertanty of what the wetather will. With predictions farther in the future than even normal weather forecast, all thanks to the power of NASA databases. 
#### Features

- Easy to comprehend weathe probailities.
- Light and to the point weather predictions based on historic data.
    

#### How to Compile and Run
Our app consist of a webPage and a server.
 ##### Starting the server
 We first need to start our python flask server for this it is recomended you create a virtual enviroment
 You can create one with the following command:
 
    - python3 -m venv .venv
	
Once you create and activate your cirtual enviroment you'll need to install the dependecies needed.
We included a requirements.txt file so that all you need to do is use the following command:

    - pip install -r requirements.txt 

Once that's done to start the server use the following command:

    - python app.py

##### Starting the webpage
You can start our react webpage with the following terminal commands

     nmp i
     npm run build
     npm start 

Then, open the port http://127.0.0.1:8000 in your browser, where our Web App will be accessible.

#### Technologies Used

We used Flask and Flask-core for our python server.

- Flask:https://flask.palletsprojects.com/en/stable/

For the front of our web app we used react, typeScript,Tailwind CSS. 
- React: https://react.dev/
- typeScript: https://www.typescriptlang.org/
- Tailwind CSS https://tailwindcss.com/

The Historic weather infromation was gatehred from: 
- https://power.larc.nasa.gov/docs/methodology/communities/

#### Future Work

- Hability to pick a point in a map.
- Clearer visualization 
- Personalization of preffered weather
