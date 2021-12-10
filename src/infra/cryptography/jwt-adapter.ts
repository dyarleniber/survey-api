import jwt from 'jsonwebtoken';
import { Encryptor } from '../../data/protocols/cryptography/encryptor';

export class JwtAdapter implements Encryptor {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret);
  }
}
