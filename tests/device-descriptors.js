const puppeteer = require('puppeteer');

module.exports['Desktop 1920x1080'] = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
    isMobile: false,
    hasTouch: false,
    isLandscape: true
  }
};

module.exports['Desktop 1280x720'] = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1280,
    height: 720,
    isMobile: false,
    hasTouch: false,
    isLandscape: true
  }
};

module.exports['Nexus 4'] = puppeteer.devices['Nexus 4'];

module.exports['Nexus 4 landscape'] = puppeteer.devices['Nexus 4 landscape'];
