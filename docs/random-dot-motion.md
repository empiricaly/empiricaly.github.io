---
id: random-dot-motion
title: Random-Dot-Motion Task
---

This is an experiment powered by [Empirica](https://empirica.ly/) as a follow-up for the model developed in
[Moussaïd M et al. (2018) Dynamical networks of influence in small group discussions](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0190541).

## Experiment Details:

### The task

In this experiment, groups of N=3 participants simultaneously undertake a visual perception task similar to the one implemented in [Moussaïd, et al. (2017). Reach and speed of judgment propagation in the laboratory, PNAS](http://www.pnas.org/content/early/2017/03/28/1611998114.short). Participants are exposed to visual stimuli consisting of a set of moving dots. A proportion of correlated dots move in a specific direction θ, and the remaining proportion of uncorrelated dots moved in random directions. Here, θ is the true value that participants have to estimate visually. The value of θ is the same for all the group members.

![task][task-img]

[task-img]: https://www.researchgate.net/profile/Jiaxiang_Zhang/publication/230624328/figure/fig1/AS:214158353145856@1428070738125/Schematic-diagram-of-the-RDM-stimulus-with-different-motion-coherence-levels-In-each.png

In the planned experiment, each group undertakes a series of “discussions” (each discussion is a `Round` from the point of view of Empirica). Within a given discussion round, the true value of θ remains unchanged. Each participant is given the chance to speak 3 times within a single discussion. Therefore, a single discussion round consists of 9 speaking stages (3 players each speaking 3 times), during which the participants share their current estimate with the rest of the group.

Calling A, B, and C the three participants. One discussion (the stimuli is always displayed on the participants’ screens) goes as follows:

1. Stage 1

- A, B, and C enter their estimate
- The estimate of A is displayed on all screens

2. Stage 2

- A, B, and C can revise their estimate
- The new estimate of B is displayed on all screens

3. Stage 3

- A, B, and C can again revise their estimate
- The estimate of C is displayed on all screens
  ...
  ...

9. Stage 9

- The experiment continues until stage 9 is reached (i.e., everyone spoke 3 times)...

10. Stage 10

- A summary of the scores that all participants have made in each stage is displayed on the screens.

11. A new discussion round (with a different true value θ) starts.

We set 9 speaking stages per discussion round and NR=20 discussion rounds per group.

### Speaking turns

The sequence of speaking turns determines which estimate is communicated at a given stage. It is generated using a simple random procedure: For each block of 3 stages, the speaking order is a random permutation of the 3 participants. That is, each participant speaks one and only one time in each block. With 9 speaking rounds, we have three blocks. Each participant thus speaks 3 times during the discussion round, as we mentioned earlier.

### Difficulty level

We vary the difficulty of the task between participants. That is, some group members will face an easy task — with a high proportion of correlated dots (e.g., 60%), whereas others will face a difficult task with a low proportion of correlated dots (e.g., 10%). The value of θ is the same for all the group members, irrespective of the difficulty level.

The difficulty level is fixed for the entire duration of the experiment.

## Experiment Demo:

You and a group of friends can play with this experiment as we ran it by following these instructions (assuming you have [Meteor installed](https://www.meteor.com/install)):

1. [Download](https://github.com/amaatouq/small-group-discussion) the repository (and unzip). Alternatively, from terminal just run:

```ssh
git clone https://github.com/amaatouq/small-group-discussion
```

2. Go into the folder with `cd small-group-discussions`
3. Install the required dependencies `meteor npm install`
4. Edit the `admin` password in the settings file `local.json` to something you like.
5. Run the local instance with `meteor --settings local.json`
6. Go to `http://localhost:3000/admin` (or whatever port you are running Meteor on).
7. login with the credentials username: `admin` and the password you have in `local.json`
8. Start a new batch with whatever configuration you want (see the example configuration).

### Example Config:

First, you have to enter the Configuration mode instead of the Monitoring model in the admin UI.

![config-mode][config-mode-image]



[config-mode-image]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/configuration_mode.png

This will allow you to configure the experiment: Factors, Lobby, and Treatments:

![config-mode-inside][config-mode-inside-image]

[config-mode-inside-image]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/configuration_mode_inside.png

Now, you have the option to create your own configuration (see below) or load an example configuration by clicking on `import` and then choosing the file `./example-config`.
Loading the example configurations will choose some example values for the factors (i.e., independent variables), lobby configuration, and few treatments.

The example factors will look like this:
![factors][factors-img]

[factors-img]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/factors_example.png

And the example treatments will look like this:
![treatments][treatments-img]

[treatments-img]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/treatments_example.png

Finally, you can go back to the Monitoring mode:

![monitoring-mode][monitoring-mode-image]

[monitoring-mode-image]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/readme_screenshots/monitoring_mode.png

Now the **_Batchs_** tab make sure you add a new batch, add the treatments you want, choose your lobby configurations, and then **_start_** the batch.

![batches][batches-img]

[batches-img]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/new_batch.png

Go to `http://localhost:3000/` and enjoy! If you don't have 3 friends to play with you, you always can use the `new player` button in development (for more details see this), which can add an arbitrary number players to the experiment while staying in the same browser (i.e., no need to open different browsers).

![game][game-img]

[game-img]: https://github.com/amaatouq/small-group-discussion/raw/master/readme_screenshots/game.png
