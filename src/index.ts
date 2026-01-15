// import { chromium } from "playwright";

// (async () => {
//   const browser = await chromium.launch({
//     headless: false,
//     slowMo: 80, // slows actions so motion looks natural
//   });

//   const page = await browser.newPage();

//   await page.goto("https://www.easellm.com", { waitUntil: "networkidle" });
//   await page.waitForTimeout(2000);

//   console.log("Title:", await page.title());

//   // -----------------------------
//   // Inject fake visible cursor
//   // -----------------------------
//   await page.addStyleTag({
//     content: `
//       #pw-cursor {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 12px;
//         height: 12px;
//         background: white;
//         border-radius: 50%;
//         z-index: 999999;
//         pointer-events: none;
//         transform: translate(-100px, -100px);
//       }
//     `
//   });

//   await page.evaluate(() => {
//     const cursor = document.createElement("div");
//     cursor.id = "pw-cursor";
//     document.body.appendChild(cursor);

//     (window as any).moveCursor = (x: number, y: number) => {
//       cursor.style.transform = `translate(${x}px, ${y}px)`;
//     };
//   });

//   // -----------------------------
//   // Wait for target link
//   // -----------------------------
//   await page.waitForSelector('a[href="/pricing"]');
//   const link = await page.$('a[href="/pricing"]');

//   if (!link) {
//     console.log("Pricing link not found");
//     await browser.close();
//     return;
//   }

//   const box = await link.boundingBox();
//   if (!box) {
//     console.log("Bounding box not available");
//     await browser.close();
//     return;
//   }

//   // Target position
//   const targetX = box.x + box.width / 2;
//   const targetY = box.y + box.height / 2;

//   // -----------------------------
//   // Smooth cursor movement
//   // -----------------------------
//   const steps = 30;
//   for (let i = 0; i <= steps; i++) {
//     const x = targetX * (i / steps);
//     const y = targetY * (i / steps);

//     await page.evaluate(
//       ([x, y]) => (window as any).moveCursor(x, y),
//       [x, y]
//     );

//     await page.waitForTimeout(15);
//   }

//   // Small pause before click
//   await page.waitForTimeout(300);

//   // Actual click
//   await page.mouse.click(targetX, targetY);

//   // Let navigation be visible
//   await page.waitForTimeout(4000);

//   await browser.close();
// })();


