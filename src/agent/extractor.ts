import type { IPageExtractor } from "../interfaces/IPageExtractor.inteface";
import type { Page } from "playwright";

export class PageExtractor implements IPageExtractor {
    constructor(private page: Page){}

    private generateRandomId(length: number = 10): string {
        return Math.random().toString(36).substring(2, 2 + length);
      }

    async extractWholeContent(): Promise<string> {
        try{
            const content = await this.page.content();
            return content;
        } catch (error) {
            throw new Error(`Failed to extract whole content: ${error}`);
        }
    }

    async screenshot(): Promise<string> {
        try {
            const id = this.generateRandomId();
            const path = `./store/images/${id}.png`
            await this.page.screenshot({ path });
            return path;
        } catch (error) {
            throw new Error(`Failed to take screenshot: ${error}`);
        }
    }
}