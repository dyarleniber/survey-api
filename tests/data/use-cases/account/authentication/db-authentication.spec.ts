import { DbAuthentication } from '@/data/use-cases/account/authentication/db-authentication';
import {
  Encryptor,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '@/data/use-cases/account/authentication/db-authentication-protocols';
import { mockAuthenticationModel, mockAuthenticationParams } from '@/tests/domain/mocks';
import {
  mockHashComparer,
  mockEncryptor,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helper';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer
  encryptorStub: Encryptor;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encryptorStub = mockEncryptor();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encryptorStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encryptorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(mockAuthenticationParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw an error if LoadAccountByEmailRepository throws an error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null));
    const authentication = await sut.auth(mockAuthenticationParams());
    expect(authentication).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(mockAuthenticationParams());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  test('Should throw an error if HashComparer throws an error', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const authentication = await sut.auth(mockAuthenticationParams());
    expect(authentication).toBeNull();
  });

  test('Should call Encryptor with correct id', async () => {
    const { sut, encryptorStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptorStub, 'encrypt');
    await sut.auth(mockAuthenticationParams());
    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw an error if Encryptor throws an error', async () => {
    const { sut, encryptorStub } = makeSut();
    jest.spyOn(encryptorStub, 'encrypt').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an AuthenticationModel on success', async () => {
    const { sut } = makeSut();
    const authentication = await sut.auth(mockAuthenticationParams());
    expect(authentication).toEqual(mockAuthenticationModel());
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    await sut.auth(mockAuthenticationParams());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw an error if UpdateAccessTokenRepository throws an error', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });
});
