const isCI = require('is-ci');
const path = require('path');
const puppeteer = require('puppeteer');

const devices = require('./device-descriptors.js');

const ARTIFACTS_PATH = path.join(__dirname, '_artifacts');
const doNotRunOnCI = (fn) => isCI ? () => {} : fn;

module.exports = {
  ARTIFACTS_PATH: ARTIFACTS_PATH,

  allowDownloads: doNotRunOnCI(async (page) => {
    // Thanks to https://docs.browserless.io/docs/downloading-files.html
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: ARTIFACTS_PATH,
    });
  }),

  clickAndWait: async (page, selector) => {
    await Promise.all([
      page.click(selector),
      page.waitForNavigation(),
    ]);
  },

  runForEachDevice: describe.each([
    ['Desktop (large)', devices['Desktop 1920x1080']],
    ['Desktop (medium)', devices['Desktop 1280x720']],
    ['Mobile (portrait)', puppeteer.devices['Nexus 4']],
    ['Mobile (landscape)', puppeteer.devices['Nexus 4 landscape']],
  ]),

  takeScreenshot: doNotRunOnCI(async (page, filePrefix) => {
    const pageTitle = await page.title();
    await page.screenshot({path: `${ARTIFACTS_PATH}/${filePrefix}_${pageTitle}.png`});
  }),
};
