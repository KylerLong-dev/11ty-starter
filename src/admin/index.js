CMS.registerEventListener({
  name: 'preSave',
  handler: function({ entry }) {
    const body = entry.get('data').get('body'); // Properly access body
    if (body) {
      const updatedBody = body.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        if (!src.startsWith('/assets/blog')) {
          src = '/assets/blog' + src.replace(/^\//, '');
        }
        return `![${alt}](${src})`;
      });

      // Return new data entry properly
      return entry.get('data').set('body', updatedBody);
    }
    return entry;
  }
});