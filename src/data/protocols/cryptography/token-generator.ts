export interface TokenGenerator {
    generate(data: string): Promise<string>;
}
