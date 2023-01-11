export interface UserInteractor {
  getUserInput(prompt?: string): Promise<string>;
  sendUserResponse(response: string): Promise<void>;
  close(): Promise<void>;
}
