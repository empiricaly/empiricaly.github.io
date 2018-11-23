---
id: lifecycle
title: Game Life Cycle
---

Each Game is made a succession of events, from an Admin creating a Batch to
players going through Rounds and Stages. Some of those events trigger callbacks
that can be implemented by the Game designer. This document attemps to clarify
the ordering and timing of these events.

Once enough players have completed the intro steps to start a game, Empirica
will call the
[`gameInit` callback](http://localhost:3000/docs/api#empiricagameinitcallback)
to setup the Game parameters (rounds, stages, any initial setup).

Once the Game has been created and saved into the database,
[`onGameStart`](http://localhost:3000/docs/api#empiricaongamestartcallback) is
called, allowing the Game developer to make the final preparations before the
game. Any pre-game preparations can be done in either `gameInit` or
`onGameStart` interchangeably. It might make sense to the Game designer to split
the overall **mandatory** Game configuration (Rounds and Stages) in `gameInit`,
from data initialization (using `set` on Game, Players, Rounds and Stages
objects) in `onGameStart`, but it is not required.

Before the first round start,
[`onRoundStart`](http://localhost:3000/docs/api#empiricaonroundstartcallback) is
called, then
[`onStageStart`](http://localhost:3000/docs/api#empiricaonstagestartcallback).
The Stage is then presented to the Players. When the Stage ends,
[`onStageEnd`](http://localhost:3000/docs/api#empiricaonstageendcallback) is
called, and when the Round ends
[`onRoundEnd`](http://localhost:3000/docs/api#empiricaonroundendcallback).

For subsequent Rounds and Stages, the Rounds and Stages callbacks are called as
expected in a similar fashion.

Finally, when the last Round ends, after the end of Stage and Round callbacks
are triggered, the
[`onGameEnd`](http://localhost:3000/docs/api#empiricaongameendcallback) callback
is called.

After which, the player goes through the exit steps.

The list of callbacks goes as follows in order:

- `gameInit` Required
- `onGameStart`
- `onRoundStart` Repeated for each Round
- `onStageStart` Repeated for each Stage
- `onStageEnd` Repeated for each Stage
- `onRoundEnd` Repeated for each Round
- `onGameEnd`
