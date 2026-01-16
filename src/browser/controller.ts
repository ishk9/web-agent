import { chromium } from "playwright";
import type { Browser, Page } from "playwright";
import { BrowserState } from './state';
import type { IBrowserController } from "../interfaces/IBrowser.interface";

export class BrowserController implements IBrowserController {
    private browser?: Browser;
    private page?: Page;
    private state: BrowserState = BrowserState.INITIALIZING;

    constructor(private launchOptions: any) {}

    private ensureState(expected: BrowserState){
        return expected === this.state;
    }
    private launchBrowser(): Promise<Browser>{
        return chromium.launch(this.launchOptions);
    }

    async init(): Promise<void> {
        if(!this.ensureState(BrowserState.INITIALIZING)){
            throw new Error('Browser is already initializing');
        }
        this.state = BrowserState.INITIALIZING;
        this.browser = await this.launchBrowser();
        this.page = await this.browser.newPage();
        this.state = BrowserState.READY;
    }

    async close(): Promise<void> {
        if(this.ensureState(BrowserState.CLOSED)){
            throw new Error('Browser is already closed');
        }
        this.state = BrowserState.CLOSED;
        await this.page?.close();
        await this.browser?.close();
    }
    
    async getCurrentUrl(): Promise<string> {
        if(!this.page){
            throw new Error('Page is not initialized');
        }
        return this.page.url();
    }

    async navigate(url: string): Promise<void> {
        if(!this.ensureState(BrowserState.READY)) {
            throw new Error('Browser is not ready!');
        }
        this.state = BrowserState.NAVIGATING;
        try{
            await this.page?.goto(url, { waitUntil: 'load' });
        } catch (error) {
            this.state = BrowserState.READY;
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to navigate to ${url}: ${message}`);
        }
        this.state = BrowserState.READY;
    }

    getPage(): Page {
        if(!this.page){
            throw new Error('Page is not initialized');
        }
        return this.page;
    }
}