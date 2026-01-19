import { BrowserBuilder } from "../browser/builder";
import { BrowserController } from "../browser/controller";
import { LLMClient } from "../llm/client";
import { AgentState } from "./state";
import { LLMFactory } from "../llm/factory";
import { getLLMConfig } from "../config/llm.config";
import { getBrowserConfig } from "../config/browser.config";
import { PageExtractor } from "./extractor";
import { SYSTEM_PROMPT } from "../config/prompts.config";


export class AgentController {
    private state: AgentState = AgentState.IDLE;
    public browser: BrowserController | undefined;
    public llm: LLMClient | undefined;
    public extractor: PageExtractor | undefined;

    constructor() {};

    async init(): Promise<void> {
        const { headless } = getBrowserConfig();
        const builder = new BrowserBuilder().headless(headless).build();
        this.browser = new BrowserController(builder);

        const { provider, model } = getLLMConfig();

        const strategy = LLMFactory.create(model, provider);
        this.llm = new LLMClient(strategy);

        this.extractor = new PageExtractor();

        try {
            await this.browser.init();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to initialize browser: ${message}`);
        }

    }

    async stop (): Promise<void> {
        try {
            await this.browser?.close();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to stop agent: ${message}`);
        }
    }

    async run(url: string, query: string): Promise<void> {
        try {
            let currentUrl = url;
            let goalAchieved = false;
            let maxIterations = 10;
            let iterations = 0;
            while(!goalAchieved && iterations < maxIterations) {
                await this.browser?.navigate(currentUrl);
                const page = this.browser?.getPage();
                if (!page) {
                    throw new Error('Page is not initialized');
                }
                const content = await this.extractor?.extractWholeContent(page);
                if(!content) {
                    throw new Error("No content found!");
                }
                let decision = await this.llm?.generate(SYSTEM_PROMPT, content, query);
                if(!decision) {
                    throw new Error("No decision found!");
                }
                console.log("Decision: ", decision);
                decision = decision.toLowerCase();
                if(decision.includes("navigate")) {
                    const urlMatch = decision.match(/navigate\(["']?([^"')]+)["']?\)/);
                    if (!urlMatch || !urlMatch[1]) {
                        throw new Error("No url found in decision! Please provide a valid url.");
                    }
                    currentUrl = urlMatch[1].trim();
                    // Remove any remaining quotes
                    currentUrl = currentUrl.replace(/^["']|["']$/g, '');
                    if(!currentUrl) {
                        throw new Error("No url found in decision! Please provide a valid url.");
                    }
                    await this.browser?.navigate(currentUrl);
                } else {
                    goalAchieved = true;
                }
                iterations++;
            }
        } catch(error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to run agent: ${message}`);
        }
    }

}