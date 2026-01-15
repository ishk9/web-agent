import type { IStrategy } from "../interfaces/IStrategy.interface";

export class LLMClient {
    constructor(private readonly strategy: IStrategy) {};

    async generate(prompt: string) {
        return this.strategy.generate(prompt);
    }
}