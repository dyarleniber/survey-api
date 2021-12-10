import jwt from 'jsonwebtoken';
import { Encryptor } from '../../data/protocols/cryptography/encryptor';

export class JwtAdapter implements Encryptor {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret);
  }
}
