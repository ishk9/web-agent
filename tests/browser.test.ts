import { BrowserBuilder } from "../src/browser/builder";
import { BrowserController } from "../src/browser/controller";


const builder = new BrowserBuilder().headless(false).build();

const browser = new BrowserController(builder);

await browser.init();
await browser.navigate('https://www.google.com');
await browser.close();