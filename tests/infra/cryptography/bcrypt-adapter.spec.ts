import bcrypt from 'bcrypt';
import { Encryptor } from '../../../src/data/protocols/encryptor';
import { BcryptAdapter } from '../../../src/infra/cryptography/bcrypt-adapter';

const makeSut = (): Encryptor => new BcryptAdapter(12);

describe('bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
  });
});
