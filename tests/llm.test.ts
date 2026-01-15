import { LLMClient } from "../src/llm/client";
import { LLMFactory } from "../src/llm/factory";

const provider = 'openai';

const strategy = LLMFactory.create('gpt-5', provider);
const llm = new LLMClient(strategy);

const response = await llm.generate('What is your name?');
console.log(response);