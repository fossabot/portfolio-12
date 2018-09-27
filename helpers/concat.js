module.exports = function(arrayA, arrayB, options) {
  if (!Array.isArray(arrayA) || !Array.isArray(arrayB)) {
    throw new Error('Concat expects two arrays');
  }

  return arrayA.concat(arrayB);
}
