import type { ILLMConfig } from "../interfaces/Illm.interface";

export const getLLMConfig = (): ILLMConfig => {
    const provider = process.env.LLM_PROVIDER || 'openai';
    const model = process.env.LLM_MODEL || 'gpt-5';

    return {
        provider,
        model
    }
}   