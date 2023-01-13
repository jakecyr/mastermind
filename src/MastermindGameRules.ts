import { range } from 'lodash';
import { ValidColorsEnum } from './enums/ValidColorsEnum';
import { InvalidColorCount } from './errors/InvalidColorCount';
import { InvalidColorError } from './errors/InvalidColorError';
import { Language } from './Language';

export class MastermindGameRules {
  public static readonly MAX_NUMBER_OF_GUESSES = 10;
  public static readonly NUMBER_OF_PEGS = 4;
  public static readonly CORRECT_POSITION = ValidColorsEnum.GREEN;
  public static readonly CORRECT_COLOR = ValidColorsEnum.YELLOW;
  public static readonly INCORRECT = ValidColorsEnum.RED;

  private currentGuess: number = 0;
  private userWon: boolean = false;
  private secretCode: string[];
  private language: Language;

  constructor(language: Language) {
    this.language = language;
    this.secretCode = this.generateSecretCode();
  }

  public initGame() {
    this.currentGuess = 0;
    this.secretCode = this.generateSecretCode();
    this.userWon = false;
  }

  public gameIsOver(): boolean {
    return this.currentGuess >= MastermindGameRules.MAX_NUMBER_OF_GUESSES || this.userWon;
  }

  public setSecretCode(secretCode: string[]) {
    if (secretCode.length !== MastermindGameRules.NUMBER_OF_PEGS) {
      throw new Error('Secret code must be ' + MastermindGameRules.NUMBER_OF_PEGS + ' colors long');
    }

    this.secretCode = secretCode;
  }

  public async runGame() {
    while (this.getTriesLeft() > 0) {
      const guess: string[] = await this.language.askUserForGuess();
      const guessWithValidColors: ValidColorsEnum[] = this.convertGuessToColors(guess);
      const result: string[] = this.attemptGuess(guessWithValidColors);

      await this.language.printResult(result);

      if (this.hasUserWon()) {
        await this.language.printWinMessage();
        break;
      }
    }

    if (!this.hasUserWon()) {
      await this.language.printLoseMessage();
    }
  }

  hasUserWon(): boolean {
    return !!this.userWon;
  }

  attemptGuess(guess: ValidColorsEnum[]): string[] {
    const result = range(0, MastermindGameRules.NUMBER_OF_PEGS).map(() => null);
    const secretCodeCopy = [...this.secretCode];
    const guessCopy = [...guess];

    // Check for correct position
    for (let i = 0; i < MastermindGameRules.NUMBER_OF_PEGS; i++) {
      if (guessCopy[i] === secretCodeCopy[i]) {
        result[i] = MastermindGameRules.CORRECT_POSITION;
      }
    }

    // Check for correct color
    for (let i = 0; i < MastermindGameRules.NUMBER_OF_PEGS; i++) {
      if (result[i] === MastermindGameRules.CORRECT_POSITION) {
        continue;
      }

      const secretCodeIndex = secretCodeCopy.indexOf(guessCopy[i]);
      if (secretCodeIndex !== -1) {
        result[i] = MastermindGameRules.CORRECT_COLOR;
        secretCodeCopy[secretCodeIndex] = null;
      }
    }

    // Fill in the rest with incorrect
    for (let i = 0; i < MastermindGameRules.NUMBER_OF_PEGS; i++) {
      if (result[i] === null) {
        result[i] = MastermindGameRules.INCORRECT;
      }
    }

    this.currentGuess++;

    if (this.attemptIsWin(result)) {
      this.userWon = true;
    }

    return result;
  }

  getTriesLeft(): number {
    return MastermindGameRules.MAX_NUMBER_OF_GUESSES - this.currentGuess;
  }

  generateSecretCode(): string[] {
    const code = [];

    for (let i = 0; i < MastermindGameRules.NUMBER_OF_PEGS; i++) {
      code.push(this.getRandomColor().toUpperCase());
    }

    return code;
  }

  getRandomColor(): ValidColorsEnum {
    const colors: ValidColorsEnum[] = Object.values(ValidColorsEnum);
    return colors[Math.floor(Math.random() * colors.length)];
  }

  attemptIsWin(result: string[]): boolean {
    return result.every((color: string) => color === MastermindGameRules.CORRECT_POSITION);
  }

  convertGuessToColors(guess: string[]): ValidColorsEnum[] {
    if (guess.length !== MastermindGameRules.NUMBER_OF_PEGS) {
      throw new InvalidColorCount(
        `Invalid number of colors received: ${guess.length}. Expected: ${MastermindGameRules.NUMBER_OF_PEGS}`,
      );
    }

    return guess.map((color: string): ValidColorsEnum => this.convertColorStringToEnum(color));
  }

  private convertColorStringToEnum(color: string): ValidColorsEnum {
    const formattedColorInput = color.toUpperCase();
    const colors: ValidColorsEnum[] = Object.values(ValidColorsEnum);

    if (!colors.includes(formattedColorInput as ValidColorsEnum)) {
      throw new InvalidColorError('Invalid color received: ' + color);
    }

    return formattedColorInput as ValidColorsEnum;
  }
}
