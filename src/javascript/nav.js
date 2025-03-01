// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".page-header_nav-list");
  const navContainer = document.querySelector(".page-header_nav-container");
  const pageHeader = document.querySelector(".page-header_nav");
  
  hamburger.addEventListener("click", function() {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    
      // Toggle aria-expanded
      hamburger.setAttribute("aria-expanded", !isExpanded);
    
      // Toggle the menu visibility
      navMenu.classList.toggle("active");
    
      // Toggle menu container visibility
      navContainer.classList.toggle("active");
    
      // Add an "open" class to animate the bars
      hamburger.classList.toggle("open");

      // Toggle an expanded class on the header for slight expansion
      pageHeader.classList.toggle("nav-expanded");

  });
});

// End Hamburger Toggle Menu

/***Start Full-width Navigation When Scrolling ***/
document.addEventListener("scroll", () => {
  const pageHeader = document.querySelector('.page-header_nav');
  const navContainer = document.querySelector('.page-header_nav-container');
  const headerElement = document.querySelector('.page-header');

  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      pageHeader.classList.add("page-header_full-width");
      headerElement.classList.add("page-header_no-padding");
      
      // If the mobile menu is open, ensure it matches the full width
      if (navContainer && navContainer.classList.contains('active')) {
          navContainer.classList.add("container-full-width");
      }
  } else {
      pageHeader.classList.remove("page-header_full-width");
      headerElement.classList.remove("page-header_no-padding");
      
      // Remove full width class from container if it exists
      if (navContainer) {
          navContainer.classList.remove("container-full-width");
      }
  }
});
/*** End Full-width Navigation When Scrolling ***/


/*** Start Current page receives active css style ***/
document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname;

    // Normalize the home page to match "/index"
    if (currentPath === "/" || currentPath === "/index.html") {
        currentPath = "/index";
    } else {
        // Remove trailing slash for consistency (except for root "/")
        currentPath = currentPath.replace(/\/$/, "");
    }

    const navLinks = document.querySelectorAll(".page-header_nav-list .nav-item");

    navLinks.forEach(link => {
        let linkPath = link.getAttribute("href").replace(/\/$/, ""); // Remove trailing slash from href

        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
});
/*** End Current page receives active css style ***/




