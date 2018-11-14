---
id: api
title: API
---

This document describes Empirica's [server](#server), [client](#client) and
[shared](#shared) APIs.

## Server

### `Empirica.gameInit(function)` callback

The `gameInit` callback is called just before a game starts, when all players
are ready, and it must create rounds and stages for the game.

One (and only one) gameInit callback is <span style="color: red">required</span>
for Empirica to work.

#### Example

```js
Empirica.gameInit((game, treatment, players) => {
  players.forEach((player, i) => {
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
  });
});
```

## Client

Yep

## Shared

### `Game` object
