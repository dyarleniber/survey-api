import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AddAccountParams } from '@/domain/use-cases/account/add-account';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/tests/domain/mocks';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(_email: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(_accessToken: string, _role?: string): Promise<AccountModel> {
      return mockAccountModel();
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(_id: string, _accessToken: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};
