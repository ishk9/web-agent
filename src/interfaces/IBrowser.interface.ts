import type { Page } from "playwright";

export interface IBrowserController {
    init(): Promise<void>;
    close(): Promise<void>;
    getCurrentUrl(): Promise<string>;
    navigate(url: string): Promise<void>;
    getPage(): Page;
}

export interface IBrowserBuilderConfig {
    headless: boolean;
    proxy: string;
}