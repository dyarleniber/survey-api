import jwt from 'jsonwebtoken';
import { JwtAdapter } from '../../../src/infra/cryptography/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
  async verify(): Promise<string> {
    return 'any_value';
  },
}));

const makeSut = (): JwtAdapter => new JwtAdapter('secret');

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct data', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('any_value');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret');
    });

    test('Should return a token when sign succeeds', async () => {
      const sut = makeSut();
      const token = await sut.encrypt('any_value');
      expect(token).toBe('any_token');
    });

    test('Should throw an error if sign throws an error', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementation(async () => { throw new Error(); });
      const promise = sut.encrypt('any_value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    test('Should call verify with correct data', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('Should return a value when verify succeeds', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });

    test('Should throw an error if verify throws an error', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementation(async () => { throw new Error(); });
      const promise = sut.decrypt('any_token');
      await expect(promise).rejects.toThrow();
    });
  });
});
