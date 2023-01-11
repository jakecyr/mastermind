jest.mock('../src/user-interactors/ConsoleUserInteractor');

import { MastermindGameRules } from '../src/MastermindGameRules';
import { EnglishLanguage } from '../src/languages/EnglishLanguage';
import { ConsoleUserInteractor } from '../src/user-interactors/ConsoleUserInteractor';
import { Language } from '../src/Language';
import { UserInteractor } from '../src/UserInteractor';
import { range } from 'lodash';
import { ValidColorsEnum } from '../src/enums/ValidColorsEnum';

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
});
