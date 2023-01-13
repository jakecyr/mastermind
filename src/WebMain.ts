import * as express from 'express';
import { Language } from './Language';
import { EnglishLanguage } from './languages/EnglishLanguage';
import { MastermindGameRules } from './MastermindGameRules';
import { WebUserInteractor } from './user-interactors/WebUserInteractor';
import * as bodyParser from 'body-parser';

export class Server {
  public static async main() {
    const app = express();

    let userInteractor: WebUserInteractor;
    let language: Language;
    let game: MastermindGameRules;

    app
      .use(bodyParser.urlencoded({ extended: true }))
      .use(bodyParser.json())
      .use(express.static('dist/views'))
      .use((req, res, next) => {
        if (userInteractor) {
          userInteractor.updateRequestResponse(req, res);
        }

        next();
      })
      .get('/start', async (req, res) => {
        userInteractor = new WebUserInteractor(req, res);
        language = new EnglishLanguage(userInteractor);

        await language.printWelcomeMessage();

        game = new MastermindGameRules(language);
        game.initGame();

        await userInteractor.close();
      })
      .post('/guess', async (req, res) => {
        const guess: string[] = await language.askUserForGuess();
        const colors = game.convertGuessToColors(guess);
        const result = game.attemptGuess(colors);

        await language.printResult(result);

        if (game.hasUserWon()) {
          await language.printWinMessage();
          game.initGame();
        } else if (game.getTriesLeft() === 0) {
          await language.printLoseMessage();
          game.initGame();
        }

        await userInteractor.close();
      })
      .listen(3000, () => {
        console.log('Example app listening on port 3000!');
      });
  }
}

Server.main();
