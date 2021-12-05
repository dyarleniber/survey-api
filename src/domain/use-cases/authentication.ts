export interface Authentication {
  auth(username: string, password: string): Promise<string | undefined>;
}
