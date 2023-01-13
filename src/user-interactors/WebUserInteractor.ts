import { Request, Response } from 'express';
import { UserInteractor } from '../UserInteractor';

export class WebUserInteractor implements UserInteractor {
  constructor(private request: Request, private response: Response) {}

  updateRequestResponse(request: Request, response: Response): void {
    this.request = request;
    this.response = response;
  }

  async getUserInput(): Promise<string> {
    return this.request.body.guess as string;
  }

  async sendUserResponse(response: string): Promise<void> {
    this.response.send(response);
  }

  async close(): Promise<void> {
    this.response.end();
  }
}
