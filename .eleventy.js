const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const path = require("path");
const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/javascript");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");

  /*Fixes the way dates are displayed with blog entries*/
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  /*Create collection of blog posts*/
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByTag("post");
  });

  // Configure the Sharp plugin for blog images
  // Add the sharp plugin
  eleventyConfig.addPlugin(sharpImages, {
    formats: ['avif', 'webp', 'jpeg'],
    sizes: [400, 700, 1200],
    outputDir: 'dist/assets/blog',
    sourceDir: 'src/assets/blog',
  });

  // Create a custom filter to process images in post content
  eleventyConfig.addFilter('processImage', function(src) {
    // Check if the source is a valid image path
    if (src && (src.includes('assets/blog') || src.includes('blog/'))) {
      const baseName = path.basename(src, path.extname(src));
      const baseDir = path.dirname(src);

      return `<picture class="post-image">
        <!-- Mobile -->
        <source media="(max-width: 600px)" srcset="${baseDir}/${baseName}-400.avif" type="image/avif">
        <source media="(max-width: 600px)" srcset="${baseDir}/${baseName}-400.webp" type="image/webp">
        <source media="(max-width: 600px)" srcset="${baseDir}/${baseName}-400.jpeg" type="image/jpeg">
        
        <!-- Tablet -->
        <source media="(max-width: 1024px)" srcset="${baseDir}/${baseName}-700.avif" type="image/avif">
        <source media="(max-width: 1024px)" srcset="${baseDir}/${baseName}-700.webp" type="image/webp">
        <source media="(max-width: 1024px)" srcset="${baseDir}/${baseName}-700.jpeg" type="image/jpeg">
        
        <!-- Desktop -->
        <source media="(min-width: 1024px)" srcset="${baseDir}/${baseName}-1200.avif" type="image/avif">
        <source media="(min-width: 1024px)" srcset="${baseDir}/${baseName}-1200.webp" type="image/webp">
        
        <!-- Fallback -->
        <img src="${baseDir}/${baseName}-1200.jpeg" alt="Post image" loading="lazy" decoding="async" width="1200">
      </picture>`;
    }
    return src; // Return original src if not applicable
  });

  /*HTML Minifier Plugin - MOVED AFTER IMAGE PROCESSING*/
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  /*CSS Minifier Plugin*/ 
  eleventyConfig.addTransform("cssmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".css")) {
      return new CleanCSS({}).minify(content).styles;
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    }
  };
};

