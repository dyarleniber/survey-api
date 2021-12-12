export interface Encryptor {
  encrypt(data: string): Promise<string>;
}
