export interface Decryptor {
  decrypt(data: string): Promise<string | null>;
}
