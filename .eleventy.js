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
      inputDir: "./src/assets/blog",
      urlPath: "/assets/blog",
      outputDir: "public/assets/blog",
      sharpOptions: {
          // Force creation of different formats
          formats: ["avif", "webp", "jpeg"]
      }
  });

    /*Hook to transform blog content img into optimized picture element*/
    eleventyConfig.addTransform("contentImages", function(content, outputPath) {
      // Only process relevant files
      if(outputPath && outputPath.endsWith(".njk")) {
        // Add a debug log
        console.log("Processing:", outputPath);
        
        // Simple string replacement approach
        // Look for image tags with blog paths
        const blogImageRegex = /<img[^>]*src="\/assets\/blog\/([^"]+)"[^>]*>/g;
        
        // Replace with picture elements
        content = content.replace(blogImageRegex, function(match, imagePath) {
          // Extract alt text if present
          const altMatch = match.match(/alt="([^"]*)"/);
          const alt = altMatch ? altMatch[1] : '';
          
          // Remove extension from path
          const basePath = imagePath.replace(/\.[^/.]+$/, "");
          
          return `<picture class="article-image">
            <!-- Mobile Image -->
            <source media="(max-width: 600px)" 
                    srcset="/assets/blog/${basePath}.avif" 
                    type="image/avif">
            <source media="(max-width: 600px)" 
                    srcset="/assets/blog/${basePath}.webp" 
                    type="image/webp">
            <source media="(max-width: 600px)" 
                    srcset="/assets/blog/${basePath}.jpeg" 
                    type="image/jpeg">
    
            <!-- Desktop Image -->
            <source media="(min-width: 601px)" 
                    srcset="/assets/blog/${basePath}.avif" 
                    type="image/avif">
            <source media="(min-width: 601px)" 
                    srcset="/assets/blog/${basePath}.webp" 
                    type="image/webp">
            <source media="(min-width: 601px)" 
                    srcset="/assets/blog/${basePath}.jpeg" 
                    type="image/jpeg">
    
            <img src="/assets/blog/${imagePath}" 
                 alt="${alt}" 
                 loading="lazy"
                 decoding="async"
                 width="800">
          </picture>`;
        });
        
        return content;
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