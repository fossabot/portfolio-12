const utils = require('./utils.js');

const scrollToBottom = async (page) => {
  await page.evaluate('window.scrollBy(0, 9999);');
  await utils.sleep(500); // Wait for scroll-to-top button animation
};

utils.runForDesktops('Back to top on %s', (name, device) => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:4000/');
    await page.emulate(device);
  });

  test('Back to top appears and can be clicked', async () => {
    await scrollToBottom(page);
    await expect(page).toClick('a.back-to-top');

    await utils.sleep(2000); // Wait for scroll-to-top animation
    const scrollTop = await page.evaluate('document.documentElement.scrollTop');
    expect(scrollTop).toBe(0);
  });

  test('Back to top works with JavaScript disabled', async () => {
    await page.setJavaScriptEnabled(false);
    await page.reload();

    await scrollToBottom(page);
    await expect(page).toClick('a.back-to-top');
  });
});
