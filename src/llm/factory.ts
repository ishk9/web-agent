import { OpenAIStrategy } from './strategies/openai';
import { ClaudeStrategy } from './strategies/claude';

export class LLMFactory {
    static create(model: string, provider: string) {
        switch (provider) {
            case 'openai':
                return new OpenAIStrategy(model, process.env.OPENAI_API_KEY as string);
            case 'claude':
                return new ClaudeStrategy(model, process.env.CLAUDE_API_KEY as string);
            default:
                throw new Error(`Invalid provider: ${provider}`);
        }
    }
}