export interface Language {
  printWelcomeMessage(): Promise<void>;
  askUserForGuess(): Promise<string[]>;
  printResult(result: string[]): Promise<void>;
  printWinMessage(): Promise<void>;
  printLoseMessage(): Promise<void>;
}
