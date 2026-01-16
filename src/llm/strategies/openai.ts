import type { IStrategy } from "../../interfaces/IStrategy.interface";
import { OpenAI } from 'openai';

export class OpenAIStrategy implements IStrategy {
    private client: OpenAI;
    constructor(private readonly model: string, private readonly apiKey: string) {
        this.client = new OpenAI({ apiKey: this.apiKey });
    }

    async generate(systemPrompt: string, prompt: string, context?: string): Promise<string> {
        try {
            const response = await this.client.responses.create({
                model: this.model,
                input: [
                    {role: "system", content: systemPrompt},
                    {role: "assistant", content: context || ""},
                    {role: "user", content: prompt}
                ],
                reasoning: { effort: "low" },
            });
            const answer = response.output_text;
            return answer;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate response: ${message}`);
        }

    }
}