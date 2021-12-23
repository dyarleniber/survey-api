import { DbAddAccount } from '@/data/use-cases/add-account/db-add-account';
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  HashGenerator,
  LoadAccountByEmailRepository,
} from '@/data/use-cases/add-account/db-add-account-protocols';

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

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(_email: string): Promise<AccountModel | null> {
      return null;
    }
  }

  return new LoadAccountByEmailRepositoryStub();
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
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeHashGenerator();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hashGeneratorStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );
  return {
    sut,
    hashGeneratorStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
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
    jest.spyOn(hashGeneratorStub, 'hash').mockImplementation(async () => {
      throw new Error();
    });
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
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(makeFakeAccountData());
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });

  test('Should throw an error if LoadAccountByEmailRepository throws an error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementation(async () => {
      throw new Error();
    });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()));
    const account = await sut.add(makeFakeAccountData());
    expect(account).toBeNull();
  });
});
