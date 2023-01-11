import { Language } from '../Language';
import { UserInteractor } from '../UserInteractor';

export class FrenchLanguage implements Language {
  private userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  async printWelcomeMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('Bienvenue à Mastermind!');
    await this.userInteractor.sendUserResponse('Vous avez 10 essais pour deviner le code secret.');
    await this.userInteractor.sendUserResponse('Le code secret est de 4 couleurs.');
    await this.userInteractor.sendUserResponse(
      'Les couleurs valides sont: rouge, bleu, vert, jaune, orange, violet.',
    );
    await this.userInteractor.sendUserResponse(
      'Vous recevrez des commentaires sur votre devinette.',
    );
    await this.userInteractor.sendUserResponse(
      'Les commentaires seront sous la forme: vert, jaune, rouge.',
    );
    await this.userInteractor.sendUserResponse(
      'Vert signifie que vous avez une couleur correcte à la bonne position.',
    );
    await this.userInteractor.sendUserResponse(
      'Jaune signifie que vous avez une couleur correcte à la mauvaise position.',
    );
    await this.userInteractor.sendUserResponse(
      'Rouge signifie que vous avez une mauvaise couleur.',
    );
    await this.userInteractor.sendUserResponse('Bonne chance!');
    await this.userInteractor.sendUserResponse('');
  }

  async askUserForGuess(): Promise<string[]> {
    const guess = await this.userInteractor.getUserInput('Entrez votre devinette: ');
    return guess
      .toUpperCase()
      .split(/[\s,]+/)
      .map((color: string) => color.trim());
  }

  async printResult(result: string[]): Promise<void> {
    await this.userInteractor.sendUserResponse(result.join(' - '));
  }

  async printWinMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('Vous gagnez!');
  }

  async printLoseMessage(): Promise<void> {
    await this.userInteractor.sendUserResponse('Vous perdez!');
  }
}
