export class BrowserBuilder {
    private config: any = {};

    headless(value: boolean) {
        this.config.headless = value;
        return this;
    }
    
    proxy(value: string) {
        this.config.proxy = value;
        return this;
    }

    build() {
        return this.config;
    }
}