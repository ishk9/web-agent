export interface IPageExtractor {
    extractWholeContent(): Promise<string>;
    screenshot(): Promise<string>;
}