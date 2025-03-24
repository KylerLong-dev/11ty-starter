# 11ty Starter Project Guidelines

## Commands
- Build: `npm run build` or `eleventy`
- Development: `npm run dev` or `eleventy --serve`

## Code Style
- **Indentation:** 2 spaces
- **Naming:**
  - JavaScript: camelCase for variables/functions
  - CSS classes: snake_case (e.g., `page-header_nav-list`)
- **Strings:** Double quotes preferred
- **Functions:** 
  - Standard function declarations
  - Arrow functions for event handlers/callbacks
- **Code Organization:** 
  - Group related functionality
  - Use comments to indicate sections
- **DOM Manipulation:**
  - querySelector/getElementById for selection
  - classList API for CSS classes
- **Events:** Wrap in DOMContentLoaded where appropriate

## Architecture
- Eleventy (11ty) static site generator
- Nunjucks templating
- Modular CSS (by component/section)
- Vanilla JavaScript