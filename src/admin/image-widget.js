CMS.registerEditorComponent({
    id: "optimizedImage",
    label: "Optimized Image",
    fields: [
      { name: "image", label: "Image", widget: "image", media_library: { allow_multiple: false } },
      { name: "alt", label: "Alt Text", widget: "string" }
    ],
    pattern: /{%\s*blogImage\s*"([^"]+)",\s*"([^"]+)"\s*%}/,
    fromBlock: function(match) {
      return {
        image: match[1],
        alt: match[2]
      };
    },
    toBlock: function(obj) {
      return `{% blogImage "${obj.image}", "${obj.alt}" %}`;
    },
    toPreview: function(obj) {
      return `<img src="${obj.image}" alt="${obj.alt}" style="max-width:100%;" />`;
    }
  });
  