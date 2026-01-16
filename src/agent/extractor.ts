import type { IPageExtractor } from "../interfaces/IPageExtractor.inteface";
import type { Page } from "playwright";

export class PageExtractor implements IPageExtractor {
    constructor(){}

    private generateRandomId(length: number = 10): string {
        return Math.random().toString(36).substring(2, 2 + length);
      }

    async extractWholeContent(page: Page): Promise<string> {
        try{
            const content = await page.content();
            return content;
        } catch (error) {
            throw new Error(`Failed to extract whole content: ${error}`);
        }
    }

    async screenshot(page: Page): Promise<string> {
        try {
            const id = this.generateRandomId();
            const path = `./store/images/${id}.png`

            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            await page.screenshot({ path });
            return path;
        } catch (error) {
            throw new Error(`Failed to take screenshot: ${error}`);
        }
    }
}