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
  eleventyConfig.addPassthroughCopy("src/assets/images");
  // Don't passthrough copy blog images as they will be processed by the Sharp plugin
  // eleventyConfig.addPassthroughCopy("src/assets/blog");
  eleventyConfig.addPassthroughCopy("src/admin");

  /*Fixes the way dates are displayed with blog entries*/
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  /*Create collection of blog posts*/
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByTag("post");
  });

  // Process all images in the blog directory with consistent naming
  eleventyConfig.addPlugin(eleventyPluginSharpImages, {
    // Process all images in the assets/blog directory
    inputDir: "src/assets/blog",
    outputDir: "public/assets/blog",
    urlPath: "/assets/blog",
    // Configure formats and sizes
    sharpOptions: {
      formats: ["avif", "webp", "jpeg"],
      widths: [400, 700, 1200],
      // Format-specific options
      avif: { quality: 65 },
      webp: { quality: 75 },
      jpeg: { quality: 80, progressive: true },
    },
    
    // Simple filename format without hashing - MUST match what's used in shortcodes and markdown renderer
    filenameFormat: (id, src, width, format, options) => {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}.${format}`;
    },
    
    // Force Sharp to process all images in the directory
    includeFiles: ["**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.webp"],
    
    // Important: Process all images in the source directory, even if not directly referenced
    pathPrefix: "/",
    
    // Force regeneration on each build to handle new Decap CMS uploads
    cacheDuration: "0"
  });

  // Override default image rendering in Markdown
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  // Store the default image renderer
  const defaultImageRenderer = md.renderer.rules.image;
  
  // Custom image renderer with direct Sharp image generation
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    
    if (srcIndex >= 0) {
      const src = token.attrs[srcIndex][1];
      const alt = token.content || '';
      
      // Check if this is a blog image path
      if (
        src &&
        (
          src.startsWith('/assets/blog/') ||
          src.includes('/blog/') ||
          src.startsWith('/public/assets/blog/')
        )
      ) {
        // Get the base name without extension
        const baseName = path.basename(src, path.extname(src));
        const baseDir = path.dirname(src);
        
        // Get the source image path
        const sourceImagePath = path.join(
          process.cwd(),
          'src',
          src.startsWith('/') ? src.slice(1) : src
        );
        
        // Generate optimized images directly (this is asynchronous, but we'll proceed anyway)
        try {
          const Sharp = require('sharp');
          const formats = ['avif', 'webp', 'jpeg'];
          const widths = [400, 700, 1200];
          const quality = {
            avif: 65,
            webp: 75,
            jpeg: 80
          };
          
          // Make sure the output directory exists
          const outputDir = path.join(
            process.cwd(),
            'public',
            baseDir.startsWith('/') ? baseDir.slice(1) : baseDir
          );
          
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          // Copy the original image
          const destImagePath = path.join(outputDir, path.basename(src));
          fs.copyFileSync(sourceImagePath, destImagePath);
          console.log(`[11ty] Copied: ${src} for optimization`);
          
          // Create each format and size
          for (const format of formats) {
            for (const width of widths) {
              const outputPath = path.join(outputDir, `${baseName}-${width}.${format}`);
              
              // Skip if file exists
              if (fs.existsSync(outputPath)) {
                continue;
              }
              
              // Process image asynchronously
              let sharpOpts = { quality: quality[format] };
              if (format === 'jpeg') {
                sharpOpts.progressive = true;
              }
              
              Sharp(sourceImagePath)
                .resize({ width })
                .toFormat(format, sharpOpts)
                .toFile(outputPath)
                .then(() => {
                  console.log(`[11ty] Generated: ${baseName}-${width}.${format}`);
                })
                .catch(err => {
                  console.error(`[11ty] Error generating ${baseName}-${width}.${format}: ${err.message}`);
                });
            }
          }
        } catch (err) {
          console.error(`[11ty] Error optimizing image ${src}: ${err.message}`);
        }
        
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
          <img src="${baseDir}/${baseName}-1200.jpeg" alt="${alt}" loading="lazy" decoding="async" width="1200">
        </picture>`;
      }
    }
    
    // Fall back to default renderer for other images
    return defaultImageRenderer(tokens, idx, options, env, self);
  };
  
  eleventyConfig.setLibrary("md", md);

  // Add shortcodes for image processing
  // Add the getUrl shortcode for resolving image paths
  eleventyConfig.addShortcode("getUrl", function(url) {
    // Ensure the URL has the correct format
    if (url && !url.startsWith("/")) {
      url = "/" + url;
    }
    return url;
  });

  // Add the resize shortcode for resizing images
  eleventyConfig.addFilter("resize", function(url, options) {
    // Store the resize options with the URL for later use
    return {
      url: url,
      width: options.width,
      height: options.height
    };
  });

  // Add format-specific shortcodes that use Sharp to generate images
  eleventyConfig.addFilter("avif", function(imageData) {
    if (!imageData || !imageData.url) return "";
    
    const baseUrl = imageData.url;
    const width = imageData.width;
    const baseName = path.basename(baseUrl, path.extname(baseUrl));
    const baseDir = path.dirname(baseUrl);
    
    return `${baseDir}/${baseName}-${width}.avif`;
  });

  eleventyConfig.addFilter("webp", function(imageData) {
    if (!imageData || !imageData.url) return "";
    
    const baseUrl = imageData.url;
    const width = imageData.width;
    const baseName = path.basename(baseUrl, path.extname(baseUrl));
    const baseDir = path.dirname(baseUrl);
    
    return `${baseDir}/${baseName}-${width}.webp`;
  });

  eleventyConfig.addFilter("jpeg", function(imageData) {
    if (!imageData || !imageData.url) return "";
    
    const baseUrl = imageData.url;
    const width = imageData.width;
    const baseName = path.basename(baseUrl, path.extname(baseUrl));
    const baseDir = path.dirname(baseUrl);
    
    return `${baseDir}/${baseName}-${width}.jpeg`;
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

