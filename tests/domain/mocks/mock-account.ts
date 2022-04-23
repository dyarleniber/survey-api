import { AccountModel } from '@/domain/models/account';
import { AddAccount, AddAccountParams } from '@/domain/use-cases/account/add-account';
import { Authentication, AuthenticationParams } from '@/domain/use-cases/account/authentication';
import { LoadAccountByToken } from '@/domain/use-cases/account/load-account-by-token';

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(_authentication: AuthenticationParams): Promise<string> {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
};

export const mockLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(_accessToken: string, _role?: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new LoadAccountByTokenStub();
};
