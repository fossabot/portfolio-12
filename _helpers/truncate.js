module.exports = function(value, maxlength) {
  let output = value.replace(/<(?:.|\n)*?>/gm, '').substring(0, maxlength);

  if (value.length > maxlength) {
    output = `${output}...`;
  }

  return output;
}
