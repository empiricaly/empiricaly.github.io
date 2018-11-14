---
id: concepts
title: Concepts
---

This document goes over the main concepts of Empirica.

## Game

A Game is a single run of the experiment. It is also used to describe the
experiment that was developed.

## Player

Players are users participating in a Game. A game must have a least 1 Player.

## Batch

A Batch is a set of 1 or more games that run in parallel. Batches allow to
create different assignment methods (for player distribution). Batches are ran
one at a time, in order of creation time. If you start multiple batches at once
in the admin, only the first will accept players. Once full the next batch will
automatically start receiving players.

## Round

A Game is made up of 1 or more ordered Rounds. A round contains 1 or more
stages. Rounds are usually composed of the same stages and repeats over the
course of the game.

E.g. For the guess the correlation experiment, on each round, we ask the player
to guess the correlation between a graph and a numerical value. In the first
stage of each round, it's the guess, the second stage the reveal of the result,
and in the third stage we show what other players have guessed; all in the same
round; and in the next round, we repeat those stages.

It is not required for all Round to contain the same stages or even the same
number of stages.

Rounds do not have a name, they have an order number (1, 2, 3...)

## Stage

A round may contain 1 or more stages. A stage has a duration, a name and a
display name.

The name is the programatic reference that can later be used in the UI code to
differentiate stages. The display name on the other hand is used in the UI, and
it a clean human readable name. For example, a stage name might be "_guess_",
while the display name might be "_Guess A Number_".

The stage duration is set in seconds, with a minimum of 5 seconds, and no
maximum. You can also allow players to _submit_ a stage, which marks it as done
for the given player. When all players have submitted, the stage is considered
done. If the stage timer runs out the stage is also considered done, whichever
happens first.

If you do not want to have a timer and want to wait until players submit, you
can set the timer to an unreasonable value (e.g. 30000000 ~= a year), and hide
the timer in the UI.

## Factors

Factors are essentially variables that will affect how a game will play. One
_Factor Type_ is mandatory for any Empirica game, the `playerCount` number.

Factors are assembled into treatments, which are themselves assigned to games.

To create _Factor Values_, you must first create Factor Types. A _Factor Type_
describes the Factor. A \_Factor Type) has a `name`, a `description`, a
`type` and a `required` marker.

- The `name` must be a code-friendly name, such a `playerCount`, which does not
  contain spaces or odd characters and is written in
  [camelCase](https://en.wikipedia.org/wiki/Camel_case).
- The `description` is a human readable description used in the admin UI to help
  other admins understand what this factor does.
- Finally, the `type` is a computing type (integer, string, ...) to limit what
  \_Factor Values* can be created for this \_Factor Type*.
- Factor Types can also be marked as `required`, meaning they are required in
  all treatments.

## Treatment

A Treatment is a named set of Factors. Each factor can appear at most once in a
treatment and required Factors must be present. The set of Factors in a
treatment must be unique, no 2 treatment with the exact same set of factors can
be created.

## Game Lobby

A Game Lobby is where the players wait for other players to arrive, and until
the game starts.

### Lobby Config

The Game Lobby is configured by lobby configs for common scenarios. It contains
a timer duration for the lobby, and handles the behavior of the app in case of
timeouts.

## Intro steps

The intro steps are pages shows to the user after registering and before the
game or game lobby. These steps can be configured by the game designer to
contain whatever is needed: intructions, a quizz, forms, etc.

The set of steps can be altered depending on the treatment assigned to the
current player.

## Exit steps

the exit steps are pages shown to the user after the game. They are configured
by the experiment designer and may contain: results, reward instructions, quizz,
thank you note...

The steps shown may be altered depending on any parameter of the player or the
game (treatment, results, etc.)
