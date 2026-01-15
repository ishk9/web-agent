import Anthropic from '@anthropic-ai/sdk';
import type { IStrategy } from "../../interfaces/IStrategy.interface";

export class ClaudeStrategy implements IStrategy {
    private client: Anthropic;
    constructor(private readonly model: string, private readonly apiKey: string) {
        this.client = new Anthropic({ apiKey: this.apiKey });
    };

    async generate(prompt: string, options?: any): Promise<string> {
        try {
            const message = await this.client.messages.create({
                max_tokens: 1024,
                messages: [{ content: prompt, role: 'user' }],
                model: this.model,
              });
              const text = message.content
                .filter(block => block.type === "text")
                .map(block => block.text)
                .join("");
                
            return text;
        } catch (error) {
            throw new Error(`Failed to generate response`)
        }
    }
}