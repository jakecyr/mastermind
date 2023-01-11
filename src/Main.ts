import { Language } from './Language';
import { EnglishLanguage } from './languages/EnglishLanguage';
import { MastermindGameRules } from './MastermindGameRules';
import { ConsoleUserInteractor } from './user-interactors/ConsoleUserInteractor';
import { UserInteractor } from './UserInteractor';

export class Main {
  public static async main() {
    const userInteractor: UserInteractor = new ConsoleUserInteractor();
    const language: Language = new EnglishLanguage(userInteractor);
    const game = new MastermindGameRules(language);

    game.initGame();

    await game.runGame();
    await userInteractor.close();
  }
}

Main.main();
