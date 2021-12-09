import { DbAddAccount } from '../../../../src/data/use-cases/add-account/db-add-account';
import {
  Encryptor, AccountModel, AddAccountModel, AddAccountRepository,
} from '../../../../src/data/use-cases/add-account/db-add-account-protocols';

const makeEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async encrypt(_value: string): Promise<string> {
      return 'hashed_password';
    }
  }
  return new EncryptorStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

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
    await sut.add(makeFakeAccountData());
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw an error if the Encryptor throws an error', async () => {
    const { sut, encryptorStub } = makeSut();
    jest.spyOn(encryptorStub, 'encrypt').mockImplementation(async () => { throw new Error(); });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should throw an error if the AddAccountRepository throws an error', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(async () => { throw new Error(); });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
