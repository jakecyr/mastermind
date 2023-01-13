import { Language } from '../Language';
import { UserInteractor } from '../UserInteractor';

export class EnglishLanguage implements Language {
  private userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  async printWelcomeMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse(
      'Welcome to Mastermind!' +
        '\n' +
        'You have 10 guesses to guess the secret code.' +
        '\n' +
        'The secret code is 4 colors long.' +
        '\n' +
        'Valid colors are: red, blue, green, yellow, orange, purple.' +
        '\n' +
        'You will be given feedback on your guess.' +
        '\n' +
        'Feedback will be in the form of: green, yellow, red.' +
        '\n' +
        'Green means you have a correct color in the correct position.' +
        '\n' +
        'Yellow means you have a correct color in the wrong position.' +
        '\n' +
        'Red means you have an incorrect color.' +
        '\n' +
        'Good luck!',
    );
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
