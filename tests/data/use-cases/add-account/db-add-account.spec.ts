import { DbAddAccount } from '../../../../src/data/use-cases/add-account/db-add-account';
import { Encryptor } from '../../../../src/data/protocols/encryptor';

const makeEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async encrypt(_value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }
  return new EncryptorStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encryptorStub: Encryptor;
}

const makeSut = (): SutTypes => {
  const encryptorStub = makeEncryptor();
  const sut = new DbAddAccount(encryptorStub);
  return {
    sut,
    encryptorStub,
  };
};

describe('DbAddAccount Use case', () => {
  test('Should call Encryptor with correct password', async () => {
    const { sut, encryptorStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptorStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
