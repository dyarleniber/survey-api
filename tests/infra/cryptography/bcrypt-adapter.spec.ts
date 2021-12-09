import bcrypt from 'bcrypt';
import { HashGenerator } from '../../../src/data/protocols/cryptography/hash-generator';
import { BcryptAdapter } from '../../../src/infra/cryptography/bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },
}));

const makeSut = (): HashGenerator => new BcryptAdapter(12);

describe('bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  test('Should throw an error if bcrypt throws an error', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => { throw new Error(); });
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });
});
