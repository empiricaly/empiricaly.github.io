---
id: your-first-experiment
title: Your First Experiment
---
### Contents
1. [Getting Set Up with Empirica](#set-up)
2. [Configuring the task page](#configure-task)

<a id="set-up"></a>
## 1.0 Getting Set Up With Empirica
Although it won't do too much, Empirica works straight out of the box.  The first step to customizing your Empirica app is to launch a test game so you can see your edits in action.
1.  First, follow the [quick-start guide](quick-start) to launch your app server.  Watch the terminal output to see your automatically generated admin login and password.
2.  Then, visit your admin panel http://localhost:3000/admin (if you are using a cloud server such as DigitalOcean, you may need to substitute `your server IP` for `localhost`)
3.  Log in using the password generated in step 1.

#### 1.1 Configuring your app
1.  Click "configuration" in the upper right corner to access app settings.   This is where you'll define all your experimental conditions.
2.  Click `factors` in the menu bar at the top.  This is where you set the most basic parameters for your experiment.  The only default parameter is playerCount.  Add a new factor by clicking the `+` button.  Set the name to `One` and the value to `1`, then click `Create Factor Value`
3.  Click `treatments`.  This is where you combine factors to create an experimental condition.  Create a new treatment using the factor you just created and name whatever you want.
4.  Click `Lobby Configurations` and create a new lobby configuration using the default settings.

#### 1.2 Creating an experiment session
1.  Click `monitoring` in the upper right corner to toggle your admin panel from configuration to monitoring.  This is where you'll interact with all the Empirica features that have to do with actually running experiments.
2.  Click `New Batch` in the batches panel, select the treatment you just created, and click `Create Batch`.
3.  Press the play button (triangle) to start the batch.

#### 1.3 Testing the experiment as a subject
1.  Navigate to http://localhost:3000/ (or your custom IP)
2.  Follow through the consent, identification (this would be, e.g., an MTurk ID), instruction pages, and attention check (you have to answer correctly)
3.  You're running an experiment!  This is the default app---just a slider with 10 rounds of input.  We're going to edit that.


<a id="configure-task"></a>
## 2.0 Configuring the task page
The root file for displaying your subject interface is located at `<your_app_directory>\client\game\Round.jsx` .

By defualt, this is divided into two main components, `task` and `socialExposure`.  The `task` itself is composed of `taskStimulus` which contains the stimulus (e.g., a survey question--or in this example, an estimation task) and `taskResponse` which contains the input for users to response to the stimulus.

#### 2.1 Adding content to the task stimulus
Edit `taskStimulus.jsx` to the following, with the new lines highlighted.  Although Empirica is built on top of a sophisticated Meteor framework, all we have to interact with directly is standard Javascript with a ReactJS framework.   

Notiece that your props passed into the React component include `round`,`stage`, and `player`.  These are your interface with Empirica, and allow you to both read and set data for the state of the experiment.

All we're doing here is adding an image and question to set up the display.  Later, we'll make the image path and question text configurable by reading in values from the `round` prop.


 `taskStimulus.jsx`:  
```
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { round, stage, player } = this.props;

		const imagePath = "/experiment/images/candies.jpg";
		const questionText = "How many candies are in the jar?"
    return (
      <div className="task-stimulus">
				<div className="task-image">
					<img src={imagePath} height={"300px"}/>
				</div>
        <div className="task-question">
					<b>Please answer the following question:</b>
					<br/>How many candies are in the jar?
				</div>
      </div>
    );
  }
}
```


#### 2.2 Customizing the input field for subject responses

All we're going to do in this section is change the input type from a slider to a numeric input box.  Because we're asking people to estimate the number of candies in a jar, we'll set the minimum value to zero.   We recommend adding additional form verification methods beyond the default to ensure a smooth user experience.  Note that if you do choose to use a slider input, we strongly recommend the Empirica slider, which is made with experimenters in mind--no default values that might create anchoring effects.

The complete final code for this file is available on GitHub [SHOULD BE DIRECT LINK].  Just update your `renderSlider` according to the following code and be sure to update the call in the main `render` method.

Notice that this method uses the `player` data to control the form input.  This player data is created with `player.round.set` in the `handleChange` method which is called every time the input is updated.  

Every time `player.round.set` is called, this triggers a database call which the MongoDB server must route [IS THIS TRUE?].  If you need to reduce your server load, one option is to store this field value locally and only update the player value once the submit button is pressed.  We won't show that here--it can be accomplished with standard ReactJS--and note that this creates the risk that a users data will be lost if they exit the game unexpectedly.  In the present example, however, this feature will allow us to update subjects' social information in real time.

```
renderInput() {
	const { player } = this.props;
	const value = player.round.get("value");
	return (
		<input
			type={"number"}
			min={1}
			onChange={this.handleChange}
			value={value}
			required
		/>
	);
}

```

Because we changed the input type, we also need to update the `handleChange` method because input events return a different type of data than slider events:
```
handleChange = event => {		
	const value = event.currentTarget.value;
    const { player } = this.props;    
    player.round.set("value", value);
};
```

<a id="configure-content"></a>
## 3.0 Making it easy to configure stimulus content

The next step is to allow the experimenter to modify the stimulus without having to update the experiment code directly.   We'll accomplish this by creating a JSON data file `constants.js` that contains all the stimulus information, and then read that into the experiment via the `Empirica.gameInit` API method. [is API the right terminology?]

This all happens server-side, so you need to create this file in your `server` directory instead of your  `client` directory.

#### 3.1 Creating constants.js to store task data as json data

`<your_app_directory>\server\game\constants.js`
```
export const taskData = {	
	candies: {  	  
		path: "/experiment/images/candies.jpg",
		questionText: "The jar in this image contains nothing but standard M&M's.  How many M&M's are in the jar?",
		correctAnswer: 797,
	},
	survey: {  	  
		questionText: "A 2014 survey asked Americans whether science and technology make our lives better (easier, healthier, more comfortable).  What percentage of respondents agreed that science and technology are making our lives better?",
		correctAnswer: 80.5,
	},
}
```

We're not actually going to use the `correctAnwser` value in this demo, but if you include all relevant data in your experiment then it life is a little easier when you download your data for analysis. 

#### 3.2 Using data from constants.js in the game initiation

Next, we need to incorporate this value in the `Empirica.gameInit` API method.  This method runs in 
`<your_app_directory>\server\game\main.js`.

First, we import the `constants.js` data with  `import {taskData} from './constants';` added to the head of `main.js`.

We're also going to update  this method to randomly assign each player a set of 'neighbors' to follow.  We'll use this information when we update `socialExposure.jsx`.

Note also that these examples make use of [underscore.js](http://underscorejs.org) a library of convenient javascript tools.

`main.js`
```
import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";

import {taskData} from './constants';

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
	
	// Establish node list
	const nodes = [];
  for (var i=players.length; i--;i>0) nodes.push(i);

  players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
		
		// Give each player a nodeId
		player.set("nodeId",i);
		
		// Assign each node as a neighbor with probability 0.5
		const networkNeighbors = _.filter(nodes, function(num){ return _.random(1)==1; })	
		player.set("neighbors", networkNeighbors);		
  });

  _.each(taskData, (task, taskName) => {
			
    const round = game.addRound({		
			data: {
				taskName: taskName,
				questionText: task.questionText,
				imagePath: task.pathath,
				correctAnswer: task.correctAnswer,
			}
		});
		
    round.addStage({
      name: "response",
      displayName: "Response",
      durationInSeconds: 120
    });
  });
});

```

#### 3.3 Incorporating dynamic round data in task.jsx

Finally, we're ready to incorporate our new configurable task data into task.jsx.  We'll do this in `taskStimulus.jsx`

It's easy!   All we do is change the value of the constants to pull dynamically with `round.get()` instead of setting them manually:

```
const imagePath = round.get("imagePath");
const questionText = round.get("questionText");
```

We also add logic so that we only display an image of a path is given:
```
{imagePath==undefined ? "" : <img src={imagePath} height={"300px"}/>}
```


## 4.0 Adding social information to the subject experience
Social information is included in the default Empirica template via  `SocialExposure.jsx`.  However, nothing will show if we don't have any other players!

The first thing to do is create a multi-player game by adding a new factor value to playerCount (following the same procedure as above) with more than one player, then creating a new treatment and a new batch.  You can then launch the Empirica app multiple times in the same web browser by clicking "New Player" in the header tab.   The app will start once the required number of players has entered the lobby.

In this example we're going to modify the default behavior so that (a) the social information only shows after subjects have entered their initial respnose, and (b) social information shows only for a subject's network neighbors.

#### 4.1 Showing social information only after a player enters their initial response
Within each `round` are multiple `stages`.   We can add more stages by returning to the `Empirica.gameInit` method and adding the following:
```
round.addStage({
    name: "social",
    displayName: "Social Information",
    durationInSeconds: 120
});
```

We can access the stage information (including the name) within the app, so we're going to modify `Round.jsx` to display the `SocialExposure` component only when `stage.name==="social"`:
```
{stage.name=="social" ? <SocialExposure stage={stage} player={player} game={game} /> : ""}
```

Finally, we'll modify `SocialExposure.jsx` to only show information for players listed in `player.get("neighbors")` by replacing the declaration for `const otherPlayers` with
```
const otherPlayers = _.filter(game.players, p => p._id != player._id && player.get("neighbors").includes(p.get("nodeId")));
```
We're also going to remove the slider element, since we are not using that in this example, and just print the number:
```
renderSocialInteraction(otherPlayer) {
    const value = otherPlayer.round.get("value");
    return (
      <div className="alter" key={otherPlayer._id}>
        <img src={otherPlayer.get("avatar")} className="profile-avatar" />
				Guess: {value}
      </div>
    );
 }
```

This simple feature shows just how cool and powerful Empirica can be.  Just by virtue of storing user information with `player.set()` and displaying that information in the `SocialExposure` component, the subject interface is automatically updated.   This is due to the way ReactJS works with Meteor:  any time a piece of information passed as one of the props is updated, then the display re-renders to show the new information.

## 5.0  Using Conditions to modify the game features
One of the key features of Empirica is the ability to thin like a scientist--control your app with experimental conditions.   To show how this works we'll just add one factor, allowing us to modify the stage length without changing the code.

First, we add the new factor through the admin panel by navigating to the factors interface and clicking "New Factor".  You can archive your earlier treatment(s) so they don't clutter up the interface.  You'll always be able to unarchive these if necessary.

Then, add a new value, make a new treatment, and create a new batch.  

We use this treatment information in the `Empirica.gameInit` method by simply changing the definition in `server\main.js` to be `durationInSeconds: treatment.stageLength` for both stages.

## 6.0 Calculating player score with callbacks
Empirica provides a set of methods that will run at the start and end of each round and stage.  These can be found in `<your_app_directory>\server\callbacks.js`.

By default, the score is equal to the total sum of responses, but this is not very informative.  We'll modify this to show percentage of error subtracted from 1:
```
// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round, players) => {
  players.forEach(player => {
    const value = player.round.get("value") || 0;
    const prevScore = player.get("score") || 0;
		var newScore = 1 - (value/round.get("correctAnswer"));
		if(newScore<0) newScore=0;
    player.set("score", prevScore + newScore);
  });
});
```

## 7.0 Next steps and future work
In this tutorial, we have created a simple that prompts subjects to complete numeric estimation tasks and allows them to revise their answers while observing the responses of other subjects.

Right now, this app ONLY works for social conditions--if you don't have any neighbors, things will look a bit weird because the stage name is called "Social Information" and there are no instructions.

Here are some examples of how we can use Empirica features to expand the functionality of this experiment:
- Add logic to use different stage names for social and non-social conditions
- Add configurable task instructions to the constants.js that say things like "Please answer the question, you will have a chance to revise your answer" and "Please revise your answer"
- Add a factor "questionSet" that takes a comma-separated list of question identifiers, and uses only those questions.  This allows different treatments to use different conditions, based on the same constants.js file.
- If you want to use more complex network structures, you could store those in a json format and import them in main.js

There are also several very basic features from the Intro and Outro we haven't touched yet that you'll need to update
- the consent form
- the instructions pages
- the attention check
- the Exit Survey and Thank You page
