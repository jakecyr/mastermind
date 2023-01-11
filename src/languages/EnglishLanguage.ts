import { Language } from '../Language';
import { UserInteractor } from '../UserInteractor';

export class EnglishLanguage implements Language {
  private userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  async printWelcomeMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('Welcome to Mastermind!');
    await this.userInteractor.sendUserResponse('You have 10 guesses to guess the secret code.');
    await this.userInteractor.sendUserResponse('The secret code is 4 colors long.');
    await this.userInteractor.sendUserResponse(
      'Valid colors are: red, blue, green, yellow, orange, purple.',
    );
    await this.userInteractor.sendUserResponse('You will be given feedback on your guess.');
    await this.userInteractor.sendUserResponse(
      'Feedback will be in the form of: green, yellow, red.',
    );
    await this.userInteractor.sendUserResponse(
      'Green means you have a correct color in the correct position.',
    );
    await this.userInteractor.sendUserResponse(
      'Yellow means you have a correct color in the wrong position.',
    );
    await this.userInteractor.sendUserResponse('Red means you have an incorrect color.');
    await this.userInteractor.sendUserResponse('Good luck!');
    await this.userInteractor.sendUserResponse('');
  }

  async askUserForGuess(): Promise<string[]> {
    const guess: string = await this.userInteractor.getUserInput('Enter your guess: ');

    return guess
      .toUpperCase()
      .split(/[\s,]+/)
      .map((color) => color.trim());
  }

  async printResult(result: string[]): Promise<void> {
    await this.userInteractor.sendUserResponse(result.join(' - '));
  }

  async printWinMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('You win!');
  }

  async printLoseMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('You lose!');
  }
}
