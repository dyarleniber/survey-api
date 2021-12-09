import { DbAddAccount } from '../../../../src/data/use-cases/add-account/db-add-account';
import {
  HashGenerator, AccountModel, AddAccountModel, AddAccountRepository,
} from '../../../../src/data/use-cases/add-account/db-add-account-protocols';

const makeHashGenerator = (): HashGenerator => {
  class HashGeneratorStub implements HashGenerator {
    async hash(_value: string): Promise<string> {
      return 'hashed_password';
    }
  }
  return new HashGeneratorStub();
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
  hashGeneratorStub: HashGenerator;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeHashGenerator();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hashGeneratorStub, addAccountRepositoryStub);
  return {
    sut,
    hashGeneratorStub,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount Use case', () => {
  test('Should call HashGenerator with correct password', async () => {
    const { sut, hashGeneratorStub } = makeSut();
    const hashSpy = jest.spyOn(hashGeneratorStub, 'hash');
    await sut.add(makeFakeAccountData());
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw an error if the HashGenerator throws an error', async () => {
    const { sut, hashGeneratorStub } = makeSut();
    jest.spyOn(hashGeneratorStub, 'hash').mockImplementation(async () => { throw new Error(); });
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
