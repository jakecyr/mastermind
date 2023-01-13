export class InvalidColorCount extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidColorCount';
  }
}
