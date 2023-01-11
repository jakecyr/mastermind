import { UserInteractor } from '../UserInteractor';
import * as readline from 'readline';

export class ConsoleUserInteractor implements UserInteractor {
  private cl: readline.Interface;

  constructor() {
    this.cl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  getUserInput(prompt?: string): Promise<string> {
    return new Promise((resolve) => {
      this.cl.question(prompt || '', (answer: string) => {
        resolve(answer);
      });
    });
  }

  async sendUserResponse(response: string): Promise<void> {
    console.log(response);
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.cl.close();
      resolve();
    });
  }
}
