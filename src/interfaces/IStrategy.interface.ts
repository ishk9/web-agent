export interface IStrategy {
    generate(systemPrompt: string,prompt: string, context?: string): Promise<string>;
}