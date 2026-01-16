import type { Page } from "playwright";

export interface IPageExtractor {
    extractWholeContent(page: Page): Promise<string>;
    screenshot(page: Page): Promise<string>;
}