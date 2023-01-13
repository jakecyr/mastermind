export class InvalidColorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidColorError';
  }
}
