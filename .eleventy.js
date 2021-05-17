module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/scripts')
  eleventyConfig.addWatchTarget('./src/styles')
  return {
    dir: {
      input: 'src/site',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
    },
  }
}
