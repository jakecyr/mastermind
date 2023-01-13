jest.mock('../src/user-interactors/ConsoleUserInteractor');

import { MastermindGameRules } from '../src/MastermindGameRules';
import { EnglishLanguage } from '../src/languages/EnglishLanguage';
import { ConsoleUserInteractor } from '../src/user-interactors/ConsoleUserInteractor';
import { Language } from '../src/Language';
import { UserInteractor } from '../src/UserInteractor';
import { range } from 'lodash';
import { ValidColorsEnum } from '../src/enums/ValidColorsEnum';
import { InvalidColorError } from '../src/errors/InvalidColorError';
import { InvalidColorCount } from '../src/errors/InvalidColorCount';

describe('MasterMindGameRules', () => {
  describe('attemptGuess', () => {
    it('should win when the user guesses the correct code', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);
      const secretCode = [
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
        ValidColorsEnum.GREEN,
        ValidColorsEnum.YELLOW,
      ];

      gameRules.setSecretCode(secretCode);
      const result: string[] = gameRules.attemptGuess(secretCode);

      expect(result).toEqual(
        range(0, MastermindGameRules.NUMBER_OF_PEGS).map(
          () => MastermindGameRules.CORRECT_POSITION,
        ),
      );

      expect(gameRules.hasUserWon()).toBe(true);
    });

    it('should lose when the user guesses the incorrect code', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      gameRules.setSecretCode(
        range(0, MastermindGameRules.NUMBER_OF_PEGS).map(() => ValidColorsEnum.BLUE),
      );

      const result = gameRules.attemptGuess(
        range(0, MastermindGameRules.NUMBER_OF_PEGS).map(() => ValidColorsEnum.RED),
      );

      expect(result).toEqual(
        range(0, MastermindGameRules.NUMBER_OF_PEGS).map(() => MastermindGameRules.INCORRECT),
      );

      expect(gameRules.hasUserWon()).toBe(false);
    });

    it('should return the correct colors', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      gameRules.setSecretCode([
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
        ValidColorsEnum.GREEN,
        ValidColorsEnum.YELLOW,
      ]);

      const result = gameRules.attemptGuess([
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
        ValidColorsEnum.YELLOW,
        ValidColorsEnum.GREEN,
      ]);

      expect(result).toEqual([
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
      ]);
    });

    it('should return the correct colors mix yellow and red', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      gameRules.setSecretCode([
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
        ValidColorsEnum.GREEN,
        ValidColorsEnum.YELLOW,
      ]);

      const result = gameRules.attemptGuess([
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
        ValidColorsEnum.ORANGE,
        ValidColorsEnum.ORANGE,
      ]);

      expect(result).toEqual([
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.INCORRECT,
        MastermindGameRules.INCORRECT,
      ]);
    });

    it('should return the correct colors all yellow', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      gameRules.setSecretCode([
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
      ]);

      const result = gameRules.attemptGuess([
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
      ]);

      expect(result).toEqual([
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
      ]);
    });
  });

  describe('generateSecretCode', () => {
    it('should generate a secret code', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);
      const secretCode = gameRules.generateSecretCode();

      expect(secretCode.length).toBe(MastermindGameRules.NUMBER_OF_PEGS);
      expect(
        secretCode.every((color: string) => Object.values<string>(ValidColorsEnum).includes(color)),
      ).toBe(true);
    });
  });

  describe('convertGuessToColors', () => {
    it('should convert a guess to colors', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      const result = gameRules.convertGuessToColors(['red', 'blue', 'green', 'yellow']);

      expect(result).toEqual([
        ValidColorsEnum.RED,
        ValidColorsEnum.BLUE,
        ValidColorsEnum.GREEN,
        ValidColorsEnum.YELLOW,
      ]);
    });

    it('should throw an InvalidColorError error if a color is not recognized', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      expect(() =>
        gameRules.convertGuessToColors(['reddy', 'blue', 'green', 'yellow']),
      ).toThrowError(InvalidColorError);
    });

    it('should throw an InvalidColorCount error if a different count of colors is received than expected', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      expect(() => gameRules.convertGuessToColors([])).toThrowError(InvalidColorCount);

      expect(() => gameRules.convertGuessToColors(['red', 'blue', 'green'])).toThrowError(
        InvalidColorCount,
      );

      expect(() =>
        gameRules.convertGuessToColors(['red', 'blue', 'green', 'red', 'green']),
      ).toThrowError(InvalidColorCount);
    });
  });

  describe('convertColorStringToEnum', () => {
    it('should convert a color string to an enum', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      // @ts-ignore
      const result = gameRules.convertColorStringToEnum('red');

      expect(result).toEqual(ValidColorsEnum.RED);
    });

    it('should throw an error if the color is not recognized', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      // @ts-ignore
      expect(() => gameRules.convertColorStringToEnum('reddy')).toThrowError(InvalidColorError);
    });
  });

  describe('attemptIsWin', () => {
    it('should return true if the attempt is a win', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      const result = gameRules.attemptIsWin([
        MastermindGameRules.CORRECT_POSITION,
        MastermindGameRules.CORRECT_POSITION,
        MastermindGameRules.CORRECT_POSITION,
        MastermindGameRules.CORRECT_POSITION,
      ]);

      expect(result).toBe(true);
    });

    it('should return false if the attempt is not a win', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      const result = gameRules.attemptIsWin([
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.INCORRECT,
        MastermindGameRules.INCORRECT,
        MastermindGameRules.INCORRECT,
      ]);

      expect(result).toBe(false);

      const result2 = gameRules.attemptIsWin([
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
        MastermindGameRules.CORRECT_COLOR,
      ]);

      expect(result2).toBe(false);
    });
  });

  describe('getRandomColor', () => {
    it('should return a random color', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      const result = gameRules.getRandomColor();

      expect(Object.values<string>(ValidColorsEnum).includes(result)).toBe(true);
    });
  });

  describe('gameIsOver', () => {
    it('should return true if there are no more guesses', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);
      gameRules.initGame();

      // @ts-ignore
      gameRules.currentGuess = MastermindGameRules.MAX_NUMBER_OF_GUESSES;

      expect(gameRules.gameIsOver()).toBeTruthy();
      
      // @ts-ignore
      gameRules.currentGuess = MastermindGameRules.MAX_NUMBER_OF_GUESSES + 5;

      expect(gameRules.gameIsOver()).toBeTruthy();
    });

    it('should return true if the user has won', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);
      gameRules.initGame();

      // @ts-ignore
      gameRules.userWon = true;

      expect(gameRules.gameIsOver()).toBeTruthy();
    });

    it('should return false if the game just started', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);
      gameRules.initGame();

      gameRules.initGame();

      expect(gameRules.gameIsOver()).toBeFalsy();
    });

    it('should return false after initGame is called', () => {
      const userInteractor: UserInteractor = new ConsoleUserInteractor();
      const language: Language = new EnglishLanguage(userInteractor);
      const gameRules = new MastermindGameRules(language);

      gameRules.initGame();

      // @ts-ignore
      gameRules.userWon = true;

      expect(gameRules.gameIsOver()).toBeTruthy();

      gameRules.initGame();

      expect(gameRules.gameIsOver()).toBeFalsy();
    });
  });
});
