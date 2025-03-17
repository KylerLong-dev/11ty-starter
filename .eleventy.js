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

    // Custom markdown renderer
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(require('markdown-it-replace-link'), {
        replaceLink: function(link, env) {
        // We'll handle the link replacement in the image renderer
        return link;
        }
    });
  
    // This is the key part - it transforms the image rendering
    markdownLibrary.renderer.rules.image = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const srcIndex = token.attrIndex('src');
        const src = token.attrs[srcIndex][1];
        const alt = token.content || '';
    
    // Only process images from your blog media folder that are in the content
    // Featured images are handled by your template and won't be processed here
    // because they're not directly inserted into the Markdown content
    if (src.startsWith('/assets/blog/')) {
      // Generate responsive image markup using your Sharp plugin syntax
      return `<picture class="content-image">
        <!-- Mobile Image -->
        <source media="(max-width: 600px)" 
                srcset="{% getUrl '${src}' | resize({ width: 400 }) | avif %}" 
                type="image/avif">
        <source media="(max-width: 600px)" 
                srcset="{% getUrl '${src}' | resize({ width: 400 }) | webp %}" 
                type="image/webp">
        <source media="(max-width: 600px)" 
                srcset="{% getUrl '${src}' | resize({ width: 400 }) | jpeg %}" 
                type="image/jpeg">

        <!-- Desktop Image -->
        <source media="(min-width: 601px)" 
                srcset="{% getUrl '${src}' | resize({ width: 800 }) | avif %}" 
                type="image/avif">
        <source media="(min-width: 601px)" 
                srcset="{% getUrl '${src}' | resize({ width: 800 }) | webp %}" 
                type="image/webp">
        <source media="(min-width: 601px)" 
                srcset="{% getUrl '${src}' | resize({ width: 800 }) | jpeg %}" 
                type="image/jpeg">

        <img src="{% getUrl '${src}' | resize({ width: 800 }) | jpeg %}" 
             alt="${alt}" 
             loading="lazy"
             decoding="async"
             width="800">
      </picture>`;
    }
    
    // For other images, use default rendering
    return self.renderToken(tokens, idx, options);
  };
  
    // Replace standard markdown renderer
    eleventyConfig.setLibrary("md", markdownLibrary);
  
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