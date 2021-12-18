import jwt from 'jsonwebtoken';
import { JwtAdapter } from '../../../src/infra/cryptography/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
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
      jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error(); });
      const promise = sut.encrypt('any_value');
      await expect(promise).rejects.toThrow();
    });
  });
});
