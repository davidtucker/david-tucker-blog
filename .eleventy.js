const htmlmin = require('html-minifier')
const { DateTime } = require('luxon')
const now = String(Date.now())
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./tailwind.config.js')
  eleventyConfig.addWatchTarget('./_site/style.css')

  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("js")
  eleventyConfig.addPassthroughCopy({ "favicon/**": "/"})

  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.js': './js/alpine.js',
  })

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL d, yyyy");
  })

  eleventyConfig.addFilter("filterTags", tags => {
    const hiddenTags = [ "posts" ]
    return tags.filter(tag => {
      return !hiddenTags.includes(tag)
    })
  });
  
  eleventyConfig.addFilter("limit", (items, length) => {
    return items.slice(0, length)
  });

  eleventyConfig.addFilter("groupItems", (items, group, initialGroup) => {
    const isEndingIndex = (index) => {
      // Is last item in items
      if(index === (items.length - 1)) {
        return true
      }
      // Is it end of initial group
      if(initialGroup && index === (initialGroup - 1)) {
        return true
      }
      // Is it end of subsequent group
      let actualIndex = index
      if(initialGroup) {
        actualIndex = index - initialGroup
      }
      if((actualIndex + 1) % group === 0) {
        return true
      }
      
      // None of those conditions
      return false
    }
    const output = [];
    let current = [];
    items.forEach((i, idx) => {
      current.push(i)
      if(isEndingIndex(idx)) {
        output.push(current)
        current = []
      }
    });
    return output;
  })

  eleventyConfig.addShortcode('youtube', (videoId) => {
    return `<div class="aspect-w-16 aspect-h-9 my-6">
<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`
  })

  eleventyConfig.addShortcode('version', function () {
    return now
  })

  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })
}
