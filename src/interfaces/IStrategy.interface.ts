export interface IStrategy {
    generate(prompt: string, context?: string): Promise<string>;
}