'use strict';
const puppeteer = require('puppeteer');
let browser;
let page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:80');
});
afterEach(async () => {
    await browser.close();
});
test('we can launch a browser', async () => {
    const text = await page.$eval('h1.intro-title', el => el.innerText);
    console.log(text);
    expect(text).toBe('I am Hamidreza Nasrollahi');
});
