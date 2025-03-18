const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it"); 

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

    // Add markdown customization for blog images
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

    // Customize the image renderer
    const defaultImageRenderer = md.renderer.rules.image;
    md.renderer.rules.image = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const srcIndex = token.attrIndex('src');
        const src = token.attrs[srcIndex][1];
        
        // Only process blog images
        if (src && src.startsWith('/assets/blog/')) {
            const alt = token.content || '';
            const pictureSrc = src.replace(/\.[^/.]+$/, "");
            
            return `<picture class="article-image">
                <source media="(max-width: 600px)" srcset="${pictureSrc}.avif" type="image/avif">
                <source media="(max-width: 600px)" srcset="${pictureSrc}.webp" type="image/webp">
                <source media="(max-width: 600px)" srcset="${pictureSrc}.jpeg" type="image/jpeg">
                <source media="(min-width: 601px)" srcset="${pictureSrc}.avif" type="image/avif">
                <source media="(min-width: 601px)" srcset="${pictureSrc}.webp" type="image/webp">
                <source media="(min-width: 601px)" srcset="${pictureSrc}.jpeg" type="image/jpeg">
                <img src="${src}" alt="${alt}" loading="lazy" decoding="async" width="800">
            </picture>`;
        }
        
        // Fall back to default rendering
        return defaultImageRenderer(tokens, idx, options, env, self);
    };

    // Set up your markdown library
    eleventyConfig.setLibrary("md", md);

    /*Image Optimization Plugin*/
    // Optimize main website images
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        urlPath: "/assets/images",
        outputDir: "public/assets/images",
    });
    
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        inputDir: "./src/assets/blog",
        urlPath: "/assets/blog",
        outputDir: "public/assets/blog",
        sharpOptions: {
            // Force creation of different formats
            formats: ["avif", "webp", "jpeg"]
        }
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