const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");

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
        inputDir: "./public/assets/blog", // Add this line - path to where images are uploaded
        urlPath: "/assets/blog",  // Keep the URL path the same
        outputDir: "public/assets/blog", // Store optimized images where they are expected
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