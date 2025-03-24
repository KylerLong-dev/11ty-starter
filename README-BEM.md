# BEM Naming Convention Guidelines

This project uses the BEM (Block Element Modifier) naming convention for CSS classes to improve modularity and maintainability.

## BEM Structure

- **Block**: The standalone component (e.g., `hero`, `card`, `button`)
- **Element**: A part of the block (e.g., `hero__image`, `card__title`, `button__icon`)
- **Modifier**: A variation of a block or element (e.g., `hero--large`, `button--primary`)

## Naming Format

```
block
block__element
block--modifier
block__element--modifier
```

## Examples

```html
<!-- Hero Section -->
<section class="hero">
  <div class="hero__container">
    <h1 class="hero__title">Title</h1>
    <p class="hero__text">Description</p>
    <div class="hero__buttons">
      <a href="#" class="button button--primary">Primary Button</a>
      <a href="#" class="button button--secondary">Secondary Button</a>
    </div>
  </div>
</section>

<!-- Card Component -->
<div class="card">
  <img class="card__image" src="image.jpg" alt="Card image">
  <div class="card__content">
    <h2 class="card__title">Card Title</h2>
    <p class="card__text">Card description</p>
  </div>
  <a href="#" class="card__link">Read more</a>
</div>
```

## Benefits

- **Modularity**: Each component is self-contained
- **Reusability**: Components can be moved around without breaking
- **Maintainability**: Easier to understand the relationship between HTML and CSS
- **Specificity**: Consistent specificity across the codebase