import { DbAddAccount } from '../../../../src/data/use-cases/add-account/db-add-account';
import {
  Encryptor, AccountModel, AddAccountModel, AddAccountRepository,
} from '../../../../src/data/use-cases/add-account/db-add-account-protocols';

const makeEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async encrypt(_value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }
  return new EncryptorStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      };
      return Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encryptorStub: Encryptor;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encryptorStub = makeEncryptor();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptorStub, addAccountRepositoryStub);
  return {
    sut,
    encryptorStub,
    addAccountRepositoryStub,
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

  test('Should throw an error if the Encryptor throws an error', async () => {
    const { sut, encryptorStub } = makeSut();
    jest.spyOn(encryptorStub, 'encrypt').mockImplementation(async () => Promise.reject(new Error()));
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });
});
