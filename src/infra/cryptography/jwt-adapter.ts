import jwt from 'jsonwebtoken';
import { Encryptor } from '../../data/protocols/cryptography/encryptor';
import { Decryptor } from '../../data/protocols/cryptography/decryptor';

export class JwtAdapter implements Encryptor, Decryptor {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret);
  }

  async decrypt(data: string): Promise<string | null> {
    return jwt.verify(data, this.secret) as string;
  }
}
