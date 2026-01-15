export interface IStrategy {
    generate(prompt: string, options?: any): Promise<string>;
}