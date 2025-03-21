const { DateTime } = require("luxon");
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const eleventyPluginFilesMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const path = require("path");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = function(eleventyConfig) {
  // Pass-through copies for static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/javascript");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("./src/admin");

  // Date filter for blog posts
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Collection for blog posts
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByTag("post");
  });

  // A generic shortcode (if needed)
  eleventyConfig.addShortcode("getUrl", function(url) {
    return url;
  });

  /* ---------- Main Site Images Optimization (using Sharp Plugin) ---------- */
  eleventyConfig.addPlugin(eleventyPluginSharpImages, {
    urlPath: "/assets/images",
    outputDir: "public/assets/images",
  });

  /* ---------- Blog Images Processing using Async Shortcode with 11ty Image ---------- */
  // Use only the async shortcode for blog images.
  eleventyConfig.addNunjucksAsyncShortcode("blogImage", async function(src, alt, className = "article-image") {
    // Adjust input path if src starts with "/" (assumes CMS uploads go to "src/assets/blog")
    let inputPath = src.startsWith("/") ? `.${src}` : src;
    
    let metadata = await Image(inputPath, {
      widths: [400, 700, 1200],
      formats: ["avif", "webp", "jpeg"],
      urlPath: "/assets/blog",
      outputDir: "public/assets/blog",
      filenameFormat: (id, src, width, format) => {
        const basename = path.basename(src, path.extname(src));
        return `${basename}-${width}.${format}`;
      }
    });
    
    // Select the 1200px jpeg as the default image.
    let defaultImage = metadata["jpeg"].find(entry => entry.width === 1200);
    
    return `<picture class="${className}">
  <source type="image/avif" srcset="${metadata.avif.map(entry => entry.srcset).join(', ')}" sizes="(max-width: 600px) 400px, (max-width: 1024px) 700px, 1200px">
  <source type="image/webp" srcset="${metadata.webp.map(entry => entry.srcset).join(', ')}" sizes="(max-width: 600px) 400px, (max-width: 1024px) 700px, 1200px">
  <source type="image/jpeg" srcset="${metadata.jpeg.map(entry => entry.srcset).join(', ')}" sizes="(max-width: 600px) 400px, (max-width: 1024px) 700px, 1200px">
  <img src="${defaultImage.url}" alt="${alt || ''}" loading="lazy" decoding="async" width="${defaultImage.width}">
</picture>`;
  });

  // Also register the shortcode for Liquid templates:
  eleventyConfig.addLiquidShortcode("blogImage", async function(src, alt, className = "article-image") {
    return await eleventyConfig.nunjucksAsyncShortcodes.blogImage(src, alt, className);
  });

  /* ---------- Markdown-It Setup ---------- */
  // Use the default markdown-it instance.
  let md = markdownIt({ html: true, breaks: true, linkify: true });
  eleventyConfig.setLibrary("md", md);

  /* ---------- HTML & CSS Minification ---------- */
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
  eleventyConfig.addTransform("cssmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".css")) {
      return new CleanCSS({}).minify(content).styles;
    }
    return content;
  });

  /* ---------- Optional: Additional Image Compression Transform ---------- */
  // Commented out unless needed to further compress JPEG/PNG output files.
  // eleventyConfig.addTransform("compressImages", async function(content, outputPath) {
  //   if (outputPath && outputPath.match(/\\.(jpe?g|png)$/i)) {
  //     let buffer = await sharp(outputPath).jpeg({ quality: 70 }).toBuffer();
  //     fs.writeFileSync(outputPath, buffer);
  //   }
  //   return content;
  // });

  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
};




