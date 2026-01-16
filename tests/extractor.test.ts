import { PageExtractor } from "../src/agent/extractor";
import { BrowserBuilder } from "../src/browser/builder";
import { BrowserController } from "../src/browser/controller";

const builder = new BrowserBuilder().headless(false).build();
const browser = new BrowserController(builder);

await browser.init();
await browser.navigate("https://www.easellm.com");

const page = browser.getPage();
const extractor = new PageExtractor(page);

// Now you can use the extractor methods:
const content = await extractor.extractWholeContent();
console.log("Content of the page is: ", content);
// const screenshotPath = await extractor.screenshot();
// console.log(`Screenshot saved to: ${screenshotPath}`);

await browser.close();