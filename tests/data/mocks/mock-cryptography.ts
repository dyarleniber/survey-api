import { HashGenerator } from '@/data/protocols/cryptography/hash-generator';
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { Encryptor } from '@/data/protocols/cryptography/encryptor';
import { Decryptor } from '@/data/protocols/cryptography/decryptor';

export const mockHashGenerator = (): HashGenerator => {
  class HashGeneratorStub implements HashGenerator {
    async hash(_value: string): Promise<string> {
      return 'hashed_password';
    }
  }
  return new HashGeneratorStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_plaintext: string, _hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};

export const mockEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async encrypt(_data: string): Promise<string> {
      return 'any_token';
    }
  }
  return new EncryptorStub();
};

export const mockDecryptor = (): Decryptor => {
  class DecryptorStub implements Decryptor {
    async decrypt(_data: string): Promise<string> {
      return 'any_value';
    }
  }
  return new DecryptorStub();
};
