# iFastr 
intelligent fasting assistant. set, track, review.

## iFastr Server Summary

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The Intermittent Fasting tracker designed with both beginners and experienced users in mind. Through experimentation a user can time, track, update methods and review their fasting analytics. The user inteface can effortlessly initiate your personalized daily feast countdown after selecting 2 user settings. Finally a user can continue  to intelligently schedule the automation of each Intermittent Fast with a few clicks within any web browser or on their mobile device. 

```iFastr Client``` is the frontend for ```iFastr```. to see iFastr in action, checkout <a href='https://i-fastr.vercel.app/'>iFastr</a>.

The ```iFastr``` backend can be found at: <a href='https://stark-sierra-08099.herokuapp.com'>iFastr-api</a>.

```iFastr``` will supports creating a user profile and Authentication with upcoming updates.

# API Documentation

## Method  Endpoints
### GET/fasting_methods/

Provides array of all fasting method objects.

### POST/fasting_methods/

Creates a new fasting method. Requires a request body. Ex: {"method_options": "13:11", "fasting_length": "13", "feast_length": "11"} .

## Profile  Endpoints
### GET/users/

Provides array of all user objects.

### POST/users/

Creates a new user object. requires a request body.

### GET/users/:user_id

Provides user object with the corresponding user_id.

### PATCH/users/:user_id

Updates user matching id with the fields provided. Requires a request body with at least one valid field.

### DELETE/users/:user_id

Deletes user matching id parameter.

### PATCH/users/method/:user_id

Updates null user table method value with matching id with the fields provided. Requires a request body with at least one valid field.

### PATCH/users/fasting_start/:user_id

Updates null user table's fasting_start value with matching id with the fields provided. Requires a request body with at least one valid field.

### GET/users/timer/:user_id

Provides string of fasting_length value from the users table.

## Tracker Endpoints
### GET/fasting_tracker/

Provides array of all fast objects.

### POST/fasting_tracker/

Creates a fast object. Required a request body.

### GET/fasting_tracker/completed

Provides array of all fast objects with a completed value of true.

### PATCH/fasting_tracker/completed

Updates false value of fasting_tracker table's completed value to true for matching id with the fields provided. Requires a request body with at least one valid field.

### GET/fasting_tracker/:fasting_id

Provides fast object with the corresponding fasting_id.

### PATCH/fasting_tracker/:fasting_id

Updates fast matching id with the fields provided. Requires a request body with at least one valid field.

## Demo Account Details

No credentials for current version. 

## Setup 

Before getting much further into the details of Intermittent Fasting, there are a couple of user settings within the app you must know about to capitalize on the use of ```iFastr```. First, read the section about the <a href='https://i-fastr.vercel.app/home#methods'>method options</a> on the home page, and decided on your first selection. Then you will want to go into your <a href='https://i-fastr.vercel.app/tools'>toolkit</a>, and navigate to the <a href='https://i-fastr.vercel.app/tools/methods'>methods page</a>. You can make your selection and press the save button so it will store your selection. This will allow the timer to know how long to set itself for.

Next, go back into the <a href='https://i-fastr.vercel.app/tools'>toolkit</a>, and navigate to your <a href='https://i-fastr.vercel.app/tools/profile'>profile page</a>. You may enter the desired fasting start time here and save the changes. Now you are setup to take advantage of the features iFastr has to offer. This automates the timer to start at that specific time each day without a need to remember to do so yourself.  Intelligent Fasting!

## Let's Boost Our Metabilism

```iFastr``` is for the health enthusiast. We aim to provide a clean user experience while providing the necessary support to succeed in weigh management. ```iFastr```'s guided user experience allows the user to learn about the fundamentals of intermittent fasting, select a fasting option, and set a daily start time. 

## Features in Developement

The ```iFastr Client``` will continue to to grow. New User registration and login authentication are just around the corner. Plans to integrate diet and workout tracking are on the horizon. Push notifications, dual-authentication and personalized data reports are all in the pipeline. 

## Tech Behind the App

<strong>Backend</strong>
<ul>
<li>Express</li>
<li>Node</li>
<ul>
<li>Create Express Server</li>
<li>Node dotenv</li>
<li>Morgan</li>
<li>Cors</li>
<li>Helmet</li>
</ul>
</ul>

<strong>Testing</strong>
<ul>
<li>Mocha and Chai</li>
</ul>

<strong>Production</strong>
<ul>
<li>Deployed via Heroku</li>
</ul>

## Setup

### local setup

clone this repository to your local machine

```git clone https://github.com/i-MCcarri/ifastr-api```

Change directory into the cloned repository

``` cd ifastr-api ```

Make a fresh start of the git history for this project

```git remote remove origin && git init```

Install the node dependencies

```npm install```

Follow the setup instructions to get ```iFastr``` up and running.

## Quick Start Scripts

start the application

```npm start``` 

## DEMOS

### Landing Page

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/splash.png?raw=true'/>

### Registration

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/reg.png?raw=true'/>

### Login

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/login.png?raw=true'/>

### Home

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/home.png?raw=true'/>

### Toolkit

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/toolkit.png?raw=true'/>

### Method

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/method.png?raw=true'/>

### Profile

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/profile.png?raw=true'/>

### Timer

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/timer.png?raw=true'/>

### Review

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/review.png?raw=true'/>

### Accountable

<img src='https://github.com/i-MCcarri/iFastr/blob/main/src/images/accountable.png?raw=true'/>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
