export interface IBrowserController {
    init(): Promise<void>;
    close(): Promise<void>;
    getCurrentUrl(): Promise<string>;
    navigate(url: string): Promise<void>;
}