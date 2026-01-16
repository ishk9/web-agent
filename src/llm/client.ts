import type { IStrategy } from "../interfaces/IStrategy.interface";

export class LLMClient {
    constructor(private readonly strategy: IStrategy) {};

    async generate(systemPrompt:string, prompt: string, context?: string) {
        return this.strategy.generate(systemPrompt, prompt, context);
    }
}