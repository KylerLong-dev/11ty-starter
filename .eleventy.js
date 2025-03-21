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
  eleventyConfig.addPlugin(eleventyPluginSharpImages, {
    // Process all images in the assets/blog directory
    inputDir: "./src/assets/blog",
    outputDir: "public/assets/blog",
    urlPath: "/assets/blog",
    
    // Configure formats and sizes
    sharpOptions: {
      formats: ["avif", "webp", "jpeg"],
      widths: [400, 700, 1200],
      // Format-specific options
      avif: { quality: 65 },
      webp: { quality: 75 },
      jpeg: { quality: 80, progressive: true }
    },
    
    // Simple filename format without hashing
    filenameFormat: (id, src, width, format) => {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}.${format}`;
    }
  });

  // Override default image rendering in Markdown
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  // Store the default image renderer
  const defaultImageRenderer = md.renderer.rules.image;
  
  // Custom image renderer
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    
    if (srcIndex >= 0) {
      const src = token.attrs[srcIndex][1];
      const alt = token.content || '';
      
      // Check if this is a blog image path
      if (src && (src.startsWith('/assets/blog/') || src.includes('/blog/'))) {
        // Get the base name without extension
        const baseName = path.basename(src, path.extname(src));
        const baseDir = path.dirname(src);
        
        // Construct the responsive image paths
        return `<picture class="article-image">
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
          <img src="${baseDir}/${baseName}-1200.jpeg" alt="${alt}" loading="lazy" decoding="async">
        </picture>`;
      }
    }
    
    // Fall back to default renderer for other images
    return defaultImageRenderer(tokens, idx, options, env, self);
  };
  
  eleventyConfig.setLibrary("md", md);

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

