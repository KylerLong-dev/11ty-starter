CMS.registerEditorComponent({
    id: "optimizedImage",
    label: "Optimized Image",
    fields: [
      { name: "src", label: "Image", widget: "image" },
      { name: "alt", label: "Alt Text", widget: "string" }
    ],
    pattern: /{% blogImage "(.*?)", "(.*?)" %}/,
    fromBlock: function(match) {
      return {
        src: match[1],
        alt: match[2]
      };
    },
    toBlock: function(obj) {
      return `{% blogImage "${obj.src}", "${obj.alt}" %}`;
    },
    toPreview: function(obj) {
      return `<img src="${obj.src}" alt="${obj.alt}" style="max-width: 100%;" />`;
    }
  });
  