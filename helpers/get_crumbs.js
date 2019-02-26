/* jshint node: true */

function toTitleCase(str) {
  return str.replace(/\b([a-z])/g, (_, initial) => initial.toUpperCase());
}

module.exports = function(options) {
  const base = options.data.file._base;
  const path = options.data.file.path;

  let fullPath = '';
  let crumbs = path.replace(base, '')
                   .split(/\\|\./)
                   .slice(1, -1)
                   .filter(name => name !== 'index')
                   .map(name => {
                     fullPath += `/${name}`;
                     return {
                       name: toTitleCase(name),
                       path: fullPath
                     };
                   });

  // If the $page has a title defined use that as last crumb
  if (this.$page.title) {
    let lastCrumbIndex = crumbs.length - 1;
    crumbs[lastCrumbIndex].name = this.$page.title;
  }

  return crumbs;
};
