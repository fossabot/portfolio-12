module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo'
    ],
    skipAudits: [
      'first-interactive', // not working
      'consistently-interactive', // not working
      'estimated-input-latency', // not working
      'offscreen-images', // not working
      'no-document-write', // not applicable, fails due to Browsersync
      'uses-http2', // covered by Cloudflare
      'manifest-short-name-length', // irrelevant for static site
      'link-text' // not interested
    ]
  }
};
