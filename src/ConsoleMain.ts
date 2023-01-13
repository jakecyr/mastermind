import { InvalidColorCount } from './errors/InvalidColorCount';
import { InvalidColorError } from './errors/InvalidColorError';
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
    await language.printWelcomeMessage();

    while (!game.gameIsOver()) {
      try {
        await game.runGame();
      } catch (e) {
        if (e instanceof InvalidColorError || e instanceof InvalidColorCount) {
          console.warn(e.message);
        } else {
          throw e;
        }
      }
    }

    await userInteractor.close();
  }
}

Main.main();
