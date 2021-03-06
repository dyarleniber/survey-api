import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter';
import { throwError } from '@/tests/helpers/test-helper';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

const makeSut = (): BcryptAdapter => new BcryptAdapter(12);

describe('bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
    });

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hash');
    });

    test('Should throw an error if hash throws an error', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);
      const promise = sut.hash('any_value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_password', 'hashed_password');
      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
    });

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut();
      const response = await sut.compare('any_password', 'hashed_password');
      expect(response).toBe(true);
    });

    test('Should return false when compare fails', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      const response = await sut.compare('wrong_password', 'hashed_password');
      expect(response).toBe(false);
    });

    test('Should throw an error if compare throws an error', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);
      const promise = sut.compare('wrong_password', 'hashed_password');
      await expect(promise).rejects.toThrow();
    });
  });
});
