/* jshint node: true */

function toTitleCase(str) {
  return str.replace(/\b([a-z])/g, (_, initial) => initial.toUpperCase());
}

module.exports = function(options) {
  let base = options.data.file._base;
  let path = options.data.file.path;
  let crumbs = path.replace(base, '')
                   .split(/\\|\./)
                   .slice(1, -1)
                   .filter(name => name !== 'index')
                   .map(toTitleCase);

  // If the $page has a title defined
  // use that as last crumb
  if (this.$page.title) {
    let lastCrumbIndex = crumbs.length - 1;
    crumbs[lastCrumbIndex] = this.$page.title;
  }

  return crumbs;
};
