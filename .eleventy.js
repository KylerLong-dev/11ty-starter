const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/javascript");
    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/admin");

    /*Fixes the way dates are displayed with blog entries*/
    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    /*Image Optimization Plugin*/
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        urlPath: "/assets/images",
        outputDir: "public/assets/images",
    })

    /*HTML Minifier Plugin*/
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

    return {
        dir: {
            input: "src",  // Set the input directory to "src"
            output: "public",  // Set the output directory to "public"
            layouts: "_includes/layouts"
        }
    };
};