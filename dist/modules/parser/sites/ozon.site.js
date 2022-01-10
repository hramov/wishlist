"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function Ozon(page, selectors) {
    await page.waitForSelector(selectors.title);
    await page.hover(selectors.img);
    await page.waitForTimeout(2000);
    await page.hover(selectors.price);
    await page.waitForTimeout(3000);
    const title_sel = await page.$(selectors.title);
    const price_sel = await page.$(selectors.price);
    const image_sel = await page.$(selectors.img);
    return {
        title: await page.evaluate((el) => el.textContent, title_sel),
        price: Number((await page.evaluate((el) => el.textContent, price_sel)).replace(/[^+\d]/g, "")),
        img_url: await page.evaluate((el) => el.getAttribute("src"), image_sel),
    };
}
exports.default = Ozon;
