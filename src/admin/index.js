// src/admin/index.js
import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

// Initialize the CMS
CMS.init();

// Register Cloudinary specifically for the markdown editor
CMS.registerMediaLibrary(cloudinary);

// Configure Cloudinary for the markdown widget only
if (CMS.getWidget('markdown')) {
  const markdownControl = CMS.getWidget('markdown').control;
  
  class CustomMarkdownControl extends markdownControl {
    constructor(props) {
      super(props);
      
      // Override the default media library to use Cloudinary for markdown editor
      this.handleOpenMediaLibrary = () => {
        this.setState({ mediaLibraryIsVisible: true });
        
        // Use Cloudinary for the markdown editor
        const mediaConfig = {
          name: 'cloudinary',
          config: {
            cloud_name: 'dvevv6eql', 
            upload_preset: "preset_images",
            default_transformations: [
              [{ quality: 'auto:good' }]
            ]
          }
        };
        
        props.openMediaLibrary({
          controlID: this.controlID,
          forImage: true,
          config: mediaConfig,
          allowMultiple: false,
          mediaPaths: {},
        });
      };
    }
  }
  
  CMS.registerWidget('markdown', CustomMarkdownControl, markdownControl.preview);
} 