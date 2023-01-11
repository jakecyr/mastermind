# Mastermind Game

A simple Mastermind game built with the principles found in the [Clean Architecture book](https://amzn.to/3XlPSCF), mainly creating layers and boundaries in the application to make it easy to change.

For example, you can swap out the `EnglishLanguage` language for `FrenchLanguage` by changing one line of code. You can change the game from a console interface to a GUI with one line of code (not including the GUI implementation).

## Setup and Run

1. Run `npm install` to install dependencies
2. Run `npm run build` to build the project
3. Run `npm start` to start the game

Enter a list of colors separated by spaces to "guess" the secret. The game will tell you how many colors are correct, how many are in the correct position and how many are incorrect. Keep guessing until you get the secret or run out of guesses (10).

## Run Pre-built Game

Download the binary from the [latest release](https://github.com/jakecyr/mastermind/releases) and run in your terminal with:

```bash
./mastermind-macos-x64
```

## Compile to Binary

1. Run `npm install` to install dependencies
2. Run `npm run build` to build the project
3. Run `npm run compile` to compile the project to a binary

