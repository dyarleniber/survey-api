import {
  LoadAccountByToken,
  AccountModel,
  Decryptor,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decryptor: Decryptor,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?:string): Promise<AccountModel | null> {
    const token = await this.decryptor.decrypt(accessToken);
    if (token) {
      return this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role,
      );
    }
    return null;
  }
}
