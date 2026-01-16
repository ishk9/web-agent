import type { IBrowserBuilderConfig } from "../interfaces/IBrowser.interface";

export const getBrowserConfig = (): IBrowserBuilderConfig => {
    const headless = process.env.BROWSER_HEADLESS as unknown as boolean || false;
    const proxy = process.env.BROWSER_PROXY || '';

    return {
        headless,
        proxy
    }
}