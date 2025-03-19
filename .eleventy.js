const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");

// Helper function to process an image URL for a given width and format.
// Replace this placeholder logic with your actual optimization pipeline.

function getOptimizedImageUrl(src, { width, format }) {
    // For demonstration, we append query parameters.
  // In your setup, this should trigger the resize and format conversion.
  return `${src}?w=${width}&fmt=${format}`;
}

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
    // Optimize main website images.
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        urlPath: "/assets/images",
        outputDir: "public/assets/images",
    });

    // Optimize blog images (this plugin will process images from the src folder).
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        inputDir: "./src/assets/blog",
        urlPath: "/assets/blog",
        outputDir: "public/assets/blog",
        sharpOptions: {
            // Create different formats.
            formats: ["avif", "webp", "jpeg"],
            widths: [400, 700, 1200], // Explicitly specify all widths
            // Compression settings for each format:
            jpeg: { quality: 75 },
            webp: { quality: 50 },
            avif: { quality: 50 }
        },

        // This ensures the output filenames match what your HTML expects
        filenameFormat: (id, src, width, format) => {
            // Extract the base filename without extension
            const filename = src.split('/').pop().split('.')[0];
            return `${filename}-${width}.${format}`;
        }
    });

    // Set up markdown-it with HTML support and other options.
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

  // Save the default renderer for fallback.
    const defaultImageRenderer = md.renderer.rules.image;

  // Customize the markdown image renderer to integrate the image optimization.
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcIndex = token.attrIndex('src');
      const src = token.attrs[srcIndex][1];

      // Only process blog images (using the public URL path).
      if (src && src.startsWith('/assets/blog/')) {
          const alt = token.content || '';

          // Generate optimized URLs for various breakpoints and formats.
          // Mobile (max-width: 600px) at width 400.
          const mobileAvif  = getOptimizedImageUrl(src, { width: 400, format: 'avif' });
          const mobileWebp  = getOptimizedImageUrl(src, { width: 400, format: 'webp' });
          const mobileJpeg  = getOptimizedImageUrl(src, { width: 400, format: 'jpeg' });

          // Tablet (max-width: 1024px) at width 700.
          const tabletAvif  = getOptimizedImageUrl(src, { width: 700, format: 'avif' });
          const tabletWebp  = getOptimizedImageUrl(src, { width: 700, format: 'webp' });
          const tabletJpeg  = getOptimizedImageUrl(src, { width: 700, format: 'jpeg' });

          // Desktop (min-width: 1024px) at width 1200.
          const desktopAvif = getOptimizedImageUrl(src, { width: 1200, format: 'avif' });
          const desktopWebp = getOptimizedImageUrl(src, { width: 1200, format: 'webp' });
          const desktopJpeg = getOptimizedImageUrl(src, { width: 1200, format: 'jpeg' });

          // Return the picture element with all optimized sources.
          return `<picture class="article-image">
            <!-- Mobile Image -->
            <source media="(max-width: 600px)" srcset="${mobileAvif}" type="image/avif">
            <source media="(max-width: 600px)" srcset="${mobileWebp}" type="image/webp">
            <source media="(max-width: 600px)" srcset="${mobileJpeg}" type="image/jpeg">
            <!-- Tablet Image -->
            <source media="(max-width: 1024px)" srcset="${tabletAvif}" type="image/avif">
            <source media="(max-width: 1024px)" srcset="${tabletWebp}" type="image/webp">
            <source media="(max-width: 1024px)" srcset="${tabletJpeg}" type="image/jpeg">
            <!-- Desktop Image -->
            <source media="(min-width: 1024px)" srcset="${desktopAvif}" type="image/avif">
            <source media="(min-width: 1024px)" srcset="${desktopWebp}" type="image/webp">
            <source media="(min-width: 1024px)" srcset="${desktopJpeg}" type="image/jpeg">
            <img src="${desktopJpeg}" alt="${alt}" loading="lazy" decoding="async" width="1200">
          </picture>`;
      }

      // Fallback to default image rendering if the condition isn't met.
      return defaultImageRenderer(tokens, idx, options, env, self);
  };

  // Set the modified markdown-it instance for Eleventy.
  eleventyConfig.setLibrary("md", md);

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
          input: "src",  // Input directory.
          output: "public",  // Output directory.
      }
  };
};
