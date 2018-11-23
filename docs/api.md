---
id: api
title: API
---

This document describes Empirica's [server](#server), [client](#client) and
[shared](#shared) APIs.

## Server

### `Empirica.gameInit(callback)`

The `gameInit` callback is called just before a game starts, when all players
are ready, and it must create rounds and stages for the game.

One (and one only) gameInit callback is <span style="color: red">required</span>
for Empirica to work.

The callback receives one argument, the [`game` object](#game-object), which
gives acces to the `players` and the treatment for this game.

It also offers the `addRound()` method, which allows to add a round to the
`game`. The returned Round object will implement the `addStage(stageArgs)`
method, which allows to add a Stage to the Round. The `stageArgs` object to be
passed to the stage creation method must contain:

- `name`: the name used to identify this stage in the UI code
- `displayName`: which will be showed to the UI to players
- `durationInSeconds`: the stage duration, in seconds

Note that the Game has not yet been created when the callback is called, and you
do not have access to the other properties of the Game which will be created
subsequently.

#### Example

```js
Empirica.gameInit(game => {
  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);
  });

  _.times(10, i => {
    const round = game.addRound();
    round.addStage({
      name: "response",
      displayName: "Response",
      durationInSeconds: 120
    });

    if (game.treatment.playerCount > 1) {
      round.addStage({
        name: "response",
        displayName: "Response",
        durationInSeconds: 120
      });
    }
  });
});
```

---

### **_Game Hooks_**

Game hooks are optional methods attached to various events throughout the game
life cycle to update data on the server-side.

Contrary to client side data updates, sever-side updates are synchronous, there
is no risk of conflicting updates, and important calculations can be taken at
precise points along the game.

### `Empirica.onGameStart(callback)`

`onGameStart` is triggered once per game, before the game starts, and before the
first [`onRoundStart`](#empiricaonroundstartcallback). It receives the
[`game` object](#game-object). Contrary to
[`gameInit`](#empiricagameinitcallback), the Game has been created at this
point.

#### Example

```js
Empirica.onGameStart(game => {
  if (game.treatment.myFactor === "fourtytwo") {
    game.set("maxScore", 100);
  } else {
    game.set("maxScore", 0);
  }
});
```

### `Empirica.onRoundStart(callback)`

`onRoundStart` is triggered before each round starts, and before
[`onStageStart`](#empiricaonstagestartcallback). It receives the same options as
[`onGameStart`](empiricaongamestartcallback), and the [round](#round-object)
that is starting.

#### Example

```js
Empirica.onRoundStart((game, round) => {
  round.set("scoreToReach", game.get("maxScore"));
});
```

### `Empirica.onStageStart(callback)`

`onRoundStart` is triggered before each stage starts. It receives the same
options as [`onRoundStart`](empiricaonroundstartcallback), and the
[stage](#stage-object) that is starting.

#### Example

```js
Empirica.onStageStart((game, round, stage) => {
  stage.set("randomColor", myRandomColorGenerator());
});
```

### `Empirica.onStageEnd(callback)`

`onStageEnd` is triggered after each stage. It receives the current
[game](#game-object), the current [round](#round-object), and
[stage](#stage-object) that just ended.

#### Example

```js
Empirica.onStageEnd((game, round, stage) => {
  stage.set("scoreGroup", stage.get("score") > 10 ? "great" : "not_great");
});
```

### `Empirica.onRoundEnd(callback)`

`onRoundEnd` is triggered after each round. It receives the current
[game](#game-object), and the [round](#round-object) that just ended.

#### Example

```js
Empirica.onRoundEnd((game, round) => {
  let maxScore = 0;
  game.players.forEach(player => {
    const playerScore = player.round.get("score") || 0;
    if (playerScore > maxScore) {
      maxScore = playerScore;
    }
  });
  round.set("maxScore", maxScore);
});
```

### `Empirica.onGameEnd(callback)`

`onGameEnd` is triggered when the game ends. It receives the
[`game`](#game-object) that just ended.

#### Example

```js
Empirica.onGameEnd(game => {
  let maxScore = 0;
  game.rounds.forEach(round => {
    const roundMaxScore = round.get("maxScore") || 0;
    if (roundMaxScore > maxScore) {
      maxScore = roundMaxScore;
    }
  });
  game.set("maxScore", maxScore);
});
```

---

### **_Change Callbacks_**

[onSet](#empiricaonsetcallback), [onAppend](#empiricaonappendcallback) and
[onChange](#empiricaonchangecallback) are called on every single update made by
all players in each game, so they can rapidly become **computationally
expensive** and have the potential to seriously slow down the app. Use wisely.

It is very useful to be able to react to each update a user makes. Try
nontheless to limit the amount of computations and database saves done in these
callbacks. You can also try to limit the amount of calls to `set()` and
`append()` you make (avoid calling them on a continuous drag of a slider for
example) and inside these callbacks use the `key` argument at the very beginning
of the callback to filter out which keys your need to run logic against.

If you are not using these callbacks, comment them out, so the system does not
call them for nothing.

### `Empirica.onSet(callback)`

`onSet` is called when the experiment code call the `.set()` method on games,
rounds, stages, players, playerRounds or playerStages.

#### Example

```js
Empirica.onSet((
  game,
  round,
  stage,
  players,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue // Previous value
) => {
  // Example filtering
  if (key !== "value") {
    return;
  }

  // Do some important calculation
});
```

### `Empirica.onAppend(callback)`

`onSet` is called when the experiment code call the `.append()` method on games,
rounds, stages, players, playerRounds or playerStages.

#### Example

```js
Empirica.onAppend((
  game,
  round,
  stage,
  players,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue // Previous value
) => {
  // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
  // be an array of the previsous values (e.g. [0.3, 0.4, 0.65]).
});
```

### `Empirica.onChange(callback)`

`onChange` is called when the experiment code call the `.set()` or the
`.append()` method on games, rounds, stages, players, playerRounds or
playerStages.

`onChange` is useful to run server-side logic for any user interaction. Note the
extra `isAppend` boolean that will allow to differenciate sets and appends.

#### Example

```js
Empirica.onChange((
  game,
  round,
  stage,
  players,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue, // Previous value
  isAppend // True if the change was an append, false if it was a set
) => {
  Game.set("lastChangeAt", new Date().toString());
});
```

---

### **_Adding Bots_**

Adding bots to a game is as simple as defining a few callbacks. You can add
different bots with different behaviors.

### `Empirica.bot(name, configuration)`

The `bot` method allows to add a bot with `name` (e.g. "Alice"), while the
`configuration` is a set of callbacks that will allow to configure how the bot
is suppose to react in certain conditions.

The `configuration` has the follows callbacks:

- `onStageTick`: called during each stage at 1 second interval
- `onStageStart`: **CURRENTLY NOT SUPPORTED** called at the beginning of each
  stage (after `onRoundStart`/`onStageStart`)
- `onStageEnd`: **CURRENTLY NOT SUPPORTED** called at the end of each stage
  (after `onStageEnd`, before `onRoundEnd` if it's the enf of the round)
- `onPlayerChange`: **CURRENTLY NOT SUPPORTED** called each time any (human)
  player has changed a value

All callbacks are called with the following arguments:

- `bot`: is the [`Player` object](#player-object) representing this bot
- `game`: the current [`Game`](#game-object)
- `round`: the current [`Round`](#round-object)
- `stage`: the current [`Stage`](#stage-object)
- `secondsRemaining`: the number of remaining seconds in the stage

#### Example

```js
Empirica.bot("bob", {
  onStageTick(bot, game, round, stage, secondsRemaining) {
    let score = 0;
    game.players.forEach(player => {
      if (player === bot) {
        return;
      }
      const playerScore = player.get("score");
      if (playerScore > score) {
        score = playerScore
      }
    });
    bot.set("score", score+1);
  }
};)
```

## Client

### `Empirica.round(Component)`

Set the `Round` Component that will contain all of the UI logic for your game.

#### Props

_Component_ will receive the following props:

| Prop     | Type                     | Description                           |
| -------- | ------------------------ | ------------------------------------- |
| `game`   | [Game](#game-object)     | The current [game](#game-object).     |
| `player` | [Player](#player-object) | The current [player](#player-object). |
| `round`  | [Round](#round-object)   | The current [round](#round-object).   |
| `stage`  | [Stage](#stage-object)   | The current [stage](#stage-object).   |

#### Example

```js
const Round = ({ player, game, round, stage }) => (
  <div className="round">
    <div className="profile">{player.id}: {player.get("score")}</p>
    <div className="stimulus">{stage.get("somePieceOfData...")</p>
    // ... Add round logic here. This is not a good example, we recommend you
    // take a look a Tutorial or a Demo app for better examples.
  </div>
);
Empirica.round(Round);
```

### `Empirica.consent(Component)`

Optionally set the `Consent` Component you want to present players before they
are allowed to register.

#### Props

_Component_ will receive the following props:

| Prop        | Type     | Description                                                                                 |
| ----------- | -------- | ------------------------------------------------------------------------------------------- |
| `onConsent` | Function | A function to call when the user has given consent (usually, clicked a "I consent" button). |

#### Example

```js
const Consent = ({ onConsent }) => (
  <div className="consent">
    <p>This experiment is part of...</p>
    <p>
      <button onClick={onConsent}>I CONSENT</button>
    </p>
  </div>
);
Empirica.consent(Consent);
```

### `Empirica.introSteps(callback)`

Set the intro steps to present to the user after consent and registration, and
before they are allowed into the Lobby. These steps might be instructions, a
quiz/test, a survey... You may present the steps in multiple pages.

The `introSteps` callback should return an array of 0 or more React Components
to show the user in order.

#### Props

_Component_ will receive the following props:

| Prop     | Type                     | Description                           |
| -------- | ------------------------ | ------------------------------------- |
| `game`   | [Game](#game-object)     | The current [game](#game-object).     |
| `player` | [Player](#player-object) | The current [player](#player-object). |

**N.B.: The `game` given here _only_ has the `treatment` field defined as the
game has not yet been created.**

#### Example

```js
Empirica.introSteps((game, player) => {
  const steps = [InstructionStepOne];
  if (game.treatment.playerCount > 1) {
    steps.push(InstructionStepTwo);
  }
  steps.push(Quiz);
  return steps;
});
```

N.B.: `InstructionStepOne` or `Quiz`, in this example, are components that are
not implemented in this example, they are simply React Components.

### `Empirica.exitSteps(callback)`

Set the exit steps to present to the user after the game has finished
successfully (all rounds finished) or not (lobby timeout, cancelled game,...)

The `exitSteps` callback should return an array of 1 or more React Components to
show the user in order.

#### Props

_Component_ will receive the following props:

| Prop     | Type                     | Description                           |
| -------- | ------------------------ | ------------------------------------- |
| `game`   | [Game](#game-object)     | The current [game](#game-object).     |
| `player` | [Player](#player-object) | The current [player](#player-object). |

#### Example

```js
Empirica.exitSteps((game, player) => {
  if (player.exitStatus !== "finished") {
    return [Sorry];
  }
  return [ExitSurvey, Thanks];
});
```

N.B.: `ExitSurvey` or `Thanks`, in this example, are components that are not
implemented in this example, they are simply React Components.

### `Empirica.lobby(Component)`

Optionally set the `Lobby` Component to replace the default lobby.

#### Props

_Component_ will receive the following props:

| Prop        | Type                           | Description                             |
| ----------- | ------------------------------ | --------------------------------------- |
| `gameLobby` | [GameLobby](#gamelobby-object) | The current [game lobby](#game-object). |
| `player`    | [Player](#player-object)       | The current [player](#player-object).   |

#### Example

```js
const Lobby = ({ player, gameLobby }) => (
  <header className="lobby">
    <h1>Please wait until the game is ready...</h1>
    <p>
      There are {gameLobby.readyCount} players ready out of{" "}
      {gameLobby.treatment.playerCount} expected total.
    </p>
  </header>
);
Empirica.lobby(Lobby);
```

### `Empirica.header(Component)`

Optionally set the `Header` Component to replace the default app header.

#### Props

_Component_ will NOT receive any props.

#### Example

```js
const Header = () => (
  <header className="app-header">
    <img src="/my-logo.png" />
    <h1>My Experiment</h1>
  </header>
);
Empirica.header(Header);
```

### `Empirica.breadcrumb(Component)`

Optionally set the `Breadcrumb` Component to replace the default Round/Stage
progress indicator. This is the UI that shows which are the current Round and
Stage, between the page Header and the Round

#### Props

_Component_ will receive the following props:

| Prop     | Type                     | Description                           |
| -------- | ------------------------ | ------------------------------------- |
| `game`   | [Game](#game-object)     | The current [game](#game-object).     |
| `player` | [Player](#player-object) | The current [player](#player-object). |
| `round`  | [Round](#round-object)   | The current [round](#round-object).   |
| `stage`  | [Stage](#stage-object)   | The current [stage](#stage-object).   |

#### Example

```js
const Breadcrumb = ({ round, stage }) => (
  <ul className="breadcrumb">
    <li>Round {round.index + 1}</li>
    {round.stages.map(s => (
      <li key={s.name} className={s.name === stage.name ? "current" : ""}>
        {s.displayName}
      </li>
    ))}
  </ul>
);
Empirica.breadcrumb(Breadcrumb);
```

### `Empirica.routes()`

`routes` are the entry point for the Empirica app. It is required to be used as
part of the React render tree for Empirica to work properly and the example
below usually does not need changing, other than the HTML node to attach to
(`document.getElementById("app")` here).

N.B.: This must be called after any other Empirica calls (Empirica.round(),
Empirica.introSteps(), ...).

#### Example

```js
Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
});
```

## Shared

### `Game` object

| Property    | Type                                           | Description                                                                                               |
| ----------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `treatment` | Object (key: String, value: String or Integer) | An object representing the Factors set on this game, e.g. `{ "playerCount": 12 }`.                        |
| `players`   | Array of [Player objects](#player-object)      | Players participating in this Game.                                                                       |
| `rounds`    | Array of [Round objects](#round-object)        | Rounds composing this Game.                                                                               |
| `createdAt` | Date                                           | Time at which the game was created which corresponds approximately to the time at which the Game started. |

### `Round` object

| Property | Type                                    | Description                                                                        |
| -------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| `index`  | Object                                  | The 0 based position of the current round in the ordered list of rounds in a game. |
| `stages` | Array of [Stage objects](#stage-object) | Stages composing this Round.                                                       |

### `Stage` object

| Property            | Type    | Description                                                                                               |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `index`             | Object  | The 0 based position of the current stage in the ordered list of a **all** of the game's stages.          |
| `name`              | String  | Programatic name of stage (i.e. to be used in code, e.g `if (name === "outcome") ...`).                   |
| `displayName`       | String  | Human name of stage (i.e. to be showed to the Player, e.g "Round Outcome").                               |
| `durationInSeconds` | Integer | The stage duration, in seconds.                                                                           |
| `startTimeAt`       | Date    | Time at which the stage started. (only set if stage has already started, i.e. not set in `onStageStart`). |

### `Player` object

| Property     | Type                       | Description                                                                                                                                                                                                |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | String                     | The ID the player used to register (e.g. MTurk ID).                                                                                                                                                        |
| `urlParams`  | Object (key/value: String) | Paramaters that were set on the URL when the user registered.                                                                                                                                              |
| `bot`        | String                     | Name of the bot used for this player, if the player is a bot (e.g. `Alice`).                                                                                                                               |
| `readyAt`    | Date                       | Time at witch the player became ready (done with intro steps).                                                                                                                                             |
| `exitAt`     | Date                       | Time when the player exited the Game (whether the game ended normally or not, see exitStatus).                                                                                                             |
| `exitStatus` | String                     | Status of the Player at Game exit. <br /><br /> Can be: "gameFull", "gameCancelled", "gameLobbyTimedOut", "playerEndedLobbyWait", "playerLobbyTimedOut", "finished". "finished" represent the normal exit. |

### `GameLobby` object

| Property      | Type                                           | Description                                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treatment`   | Object (key: String, value: String or Integer) | An object representing the Factors set on this game, e.g. `{ "playerCount": 12 }`.                                                                                                                                                                                                                                                                                                        |
| `queuedCount` | Integer                                        | Total number of players queued for this game, including ready players and players currently going through the intro steps. <br> <br> **N.B.: There could be more players in queuedCount than specified by the `playerCount` Factor, as Empirica can sometimes overbook Games to shorten wait times.** <br /> Use `gameLobby.treatment.playerCount` to get the expected number of players. |
| `readyCount`  | Integer                                        | Number of players ready to play. They have completed the intro steps, and they are on the lobby page.                                                                                                                                                                                                                                                                                     |

<!--
Keep the following new lines, they are here to add some spacing at the end of the page so that anchors down to the last item on this page will still scroll to the right place.
-->

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
