import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (!account) {
      return null;
    }
    await this.hashComparer.compare(authentication.password, account.password);
    return null;
  }
}
