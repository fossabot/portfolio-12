const timeline = require('../data/timeline.json');
const utils = require('./utils.js');

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:4000/timeline');
});

test.each(timeline.map(event => event.title))('test %s', async (title) => {
  const titleInUrl = title.toLowerCase().replace(/\s/g, '-');
  await utils.clickAndWait(page, `.timeline-event a[href*=${titleInUrl}]`);
  await expect(page.title()).resolves.toMatch(`Eric Cornelissen - ${title}`);
});

afterEach(async () => {
  await utils.takeScreenshot(page, 'test');
  page.close();
});
