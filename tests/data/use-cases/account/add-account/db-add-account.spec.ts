import { DbAddAccount } from '@/data/use-cases/account/add-account/db-add-account';
import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  HashGenerator,
  LoadAccountByEmailRepository,
} from '@/data/use-cases/account/add-account/db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const makeHashGenerator = (): HashGenerator => {
  class HashGeneratorStub implements HashGenerator {
    async hash(_value: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new HashGeneratorStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel();
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

type SutTypes = {
  sut: DbAddAccount;
  hashGeneratorStub: HashGenerator;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

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
    await sut.add(mockAddAccountParams());
    expect(hashSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw an error if the HashGenerator throws an error', async () => {
    const { sut, hashGeneratorStub } = makeSut();
    jest.spyOn(hashGeneratorStub, 'hash').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should throw an error if the AddAccountRepository throws an error', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw an error if LoadAccountByEmailRepository throws an error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()));
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });
});
