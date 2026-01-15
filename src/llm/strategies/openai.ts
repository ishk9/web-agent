import type { IStrategy } from "../../interfaces/IStrategy.interface";
import { OpenAI } from 'openai';

export class OpenAIStrategy implements IStrategy {
    constructor(private readonly model: string, private readonly apiKey: string) {}

    async generate(prompt: string, options?: any): Promise<string> {
        const client = new OpenAI({ apiKey: this.apiKey });
        const response = await client.responses.create({
            model: this.model,
            input: prompt
        });
        const answer = response.output_text;
        return answer;
    }
}