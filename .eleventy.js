const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");
const cheerio = require('cheerio');

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

    /*Shortcode to ensure images optimized from blog*/
    eleventyConfig.addShortcode("getUrl", function(url) {
        return url;
    });

    /*Image Optimization Plugin*/
    // Optimize main website images
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        urlPath: "/assets/images",
        outputDir: "public/assets/images",
    });
    
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        inputDir: "./src/assets/blog", // Add this line - path to where images are uploaded
        urlPath: "/assets/blog",  // Keep the URL path the same
        outputDir: "public/assets/blog", // Store optimized images where they are expected
    });

    /*Hook to transform blog content img into optimized picture element*/
    eleventyConfig.addTransform("contentImages", function(content, outputPath) {
        if(outputPath && outputPath.endsWith(".njk")) {
          const $ = cheerio.load(content);
          
          // Find all images in blog content
          $('.article-content img').each(function() {
            const img = $(this);
            const src = img.attr('src');
            const alt = img.attr('alt') || '';
            
            if (src && src.startsWith('/assets/blog/')) {
              // Create picture element with responsive images
              const pictureSrc = src.replace(/\.[^/.]+$/, ""); // Remove extension
              img.replaceWith(`
                <picture class="article-image">
                  <!-- Mobile Image -->
                  <source media="(max-width: 600px)" 
                          srcset="${pictureSrc}.avif" 
                          type="image/avif">
                  <source media="(max-width: 600px)" 
                          srcset="${pictureSrc}.webp" 
                          type="image/webp">
                  <source media="(max-width: 600px)" 
                          srcset="${pictureSrc}.jpeg" 
                          type="image/jpeg">
      
                  <!-- Desktop Image -->
                  <source media="(min-width: 601px)" 
                          srcset="${pictureSrc}.avif" 
                          type="image/avif">
                  <source media="(min-width: 601px)" 
                          srcset="${pictureSrc}.webp" 
                          type="image/webp">
                  <source media="(min-width: 601px)" 
                          srcset="${pictureSrc}.jpeg" 
                          type="image/jpeg">
      
                  <img src="${src}" 
                       alt="${alt}" 
                       loading="lazy"
                       decoding="async"
                       width="800">
                </picture>
              `);
            }
          });
          
          return $.html();
        }
        return content;
      });
  
    /*HTML Minifier Plugin*/
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
            input: "src",  // Set the input directory to "src"
            output: "public",  // Set the output directory to "public"
        }
    };
};