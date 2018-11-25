---
id: your-first-experiment
title: Your First Experiment
---
### Contents
1. [Getting Set Up with Empirica](#set-up)
 2. [Configuring the task page](#configure-task)

## 1.0 Getting Set Up With Empirica
<a id="set-up"></a>
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

## 2.0 Configuring the task page
<a id="configure-task"></a>
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
Every time `player.round.set` is called, this triggers a database call which the MongoDB server must route [IS THIS TRUE?].  If you need to reduce your server load, one option is to store this field value locally and only update the player value once the submit button is pressed.  We won't show that here--it can be accomplished with standard ReactJS--and note that this creates the risk that a users data will be lost if they exit the game unexpectedly.

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
      />
    );
  }
```

## 3.0 Configuring stimulus content

The next step is to allow the experimenter to modify the stimulus without having to update the experiment code directly.   We'll accomplish this by creating a JSON data file `constants.js` that contains all the stimulus information, and then read that into the experiment via the `Empirica.gameInit` API method. [is API the right terminology?]
