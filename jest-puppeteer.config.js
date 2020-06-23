module.exports = {
  launch: {
    args: [
      process.env.PUPPETEER_NO_SANDBOX ? '--no-sandbox' : ''
    ],
    headless: process.env.PUPPETEER_HEADLESS !== 'false'
  },
  browser: 'chromium',
  browserContext: 'default'
}
