import { DbLoadAccountByToken } from '@/data/use-cases/account/load-account-by-token/db-load-account-by-token';
import {
  AccountModel,
  Decryptor,
  LoadAccountByTokenRepository,
} from '@/data/use-cases/account/load-account-by-token/db-load-account-by-token-protocols';
import { mockAccountModel } from '@/tests/domain/mocks';
import { throwError } from '@/tests/helpers/test-helper';

const makeDecryptor = (): Decryptor => {
  class DecryptorStub implements Decryptor {
    async decrypt(_data: string): Promise<string> {
      return 'any_value';
    }
  }

  return new DecryptorStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(_accessToken: string, _role?: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

type SutTypes = {
  sut: DbLoadAccountByToken;
  decryptorStub: Decryptor;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decryptorStub = makeDecryptor();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decryptorStub,
    loadAccountByTokenRepositoryStub,
  );
  return {
    sut,
    decryptorStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken Use case', () => {
  test('Should call Decryptor with correct values', async () => {
    const { sut, decryptorStub } = makeSut();
    const decryptSpy = jest.spyOn(decryptorStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should throw an error if Decryptor throws an error', async () => {
    const { sut, decryptorStub } = makeSut();
    jest.spyOn(decryptorStub, 'decrypt').mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if Decryptor returns null', async () => {
    const { sut, decryptorStub } = makeSut();
    jest.spyOn(decryptorStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should throw an error if LoadAccountByTokenRepository throws an error', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(mockAccountModel());
  });
});
