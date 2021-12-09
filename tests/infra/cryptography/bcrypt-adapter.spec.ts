import bcrypt from 'bcrypt';
import { Encryptor } from '../../../src/data/protocols/encryptor';
import { BcryptAdapter } from '../../../src/infra/cryptography/bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },
}));

const makeSut = (): Encryptor => new BcryptAdapter(12);

describe('bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });

  test('Should throw an error if bcrypt throws an error', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => Promise.reject(new Error()));
    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
