import bcrypt from 'bcrypt';
import { HashGenerator } from '../../data/protocols/cryptography/hash-generator';

export class BcryptAdapter implements HashGenerator {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
}
