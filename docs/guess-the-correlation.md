---
id: guess-the-correlation
title: Guess the Correlation Game
---

## Experiment Demo:

You and a group of friends can play with this experiment as we ran it by following these instructions (assuming you have [Meteor installed](https://www.meteor.com/install)):

1. [Download](https://github.com/amaatouq/guess-the-correlation) the repository (and unzip). Alternatively, from terminal just run:

```ssh
git clone https://github.com/amaatouq/guess-the-correlation.git
```

2. Go into the folder with `cd guess-the-correlation`
3. Install the required dependencies by running `meteor npm install`
4. Edit the `admin` password in the settings file `local.json` to something you like.
5. Run the local instance with `meteor --settings local.json`
6. Go to `http://localhost:3000/admin` (or whatever port you are running Meteor on).
7. login with the credentials username: `admin` and the password you have in `local.json`
8. Start a new batch with whatever configuration you want (see the example configuration).

### Example Config:

First, you have to enter the Configuration mode instead of the Monitoring model in the admin UI.

![config-mode][config-mode-image]

[config-mode-image]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/configuration_mode.png

This will allow you to configure the experiment: Factors, Lobby, and Treatments:

![config-mode-inside][config-mode-inside-image]

[config-mode-inside-image]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/configuration_mode_inside.png

Now, you have the option to create your own configuration (see below) or load an example configuration by clicking on `import` and then choosing the file `./example-config.yaml`.
Loading the example configurations will choose some example values for the factors (i.e., independent variables), lobby configuration, and few treatments.

The example factors will look like this:
![factors][factors-img]

[factors-img]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/factors_example.png

And the example treatments will look like this:
![treatments][treatments-img]

[treatments-img]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/treatments_example.png

Finally, you can go back to the Monitoring mode:

![monitoring-mode][monitoring-mode-image]

[monitoring-mode-image]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/monitoring_mode.png

Now the **_Batchs_** tab make sure you add a new batch, add the treatments you want, choose your lobby configurations, and then **_start_** the batch.

![batches][batches-img]

[batches-img]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/new_batch.png

Go to `http://localhost:3000/` and enjoy! If you don't have 3 friends to play with you, you always can use the `new player` button in development (for more details see this), which can add an arbitrary number players to the experiment while staying in the same browser (i.e., no need to open different browsers).

![game][game-img]

[game-img]: https://github.com/amaatouq/guess-the-correlation/raw/master/readme_screenshots/game.png