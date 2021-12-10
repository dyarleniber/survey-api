import bcrypt from 'bcrypt';
import { HashGenerator } from '../../data/protocols/cryptography/hash-generator';
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer';

export class BcryptAdapter implements HashGenerator, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
