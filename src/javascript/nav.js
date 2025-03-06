
//Hamburger Toggle Menu

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".page-header_nav-list");
    const navContainer = document.querySelector(".page-header_nav-container");
    const pageHeader = document.querySelector(".page-header_nav");
  
    hamburger.addEventListener("click", function() {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      
      // Toggle aria-expanded
      hamburger.setAttribute("aria-expanded", !isExpanded);
      
      // If menu is open, trigger closing animation
      if (navMenu.classList.contains("active")) {
        // First, add closing class to both elements
        navMenu.classList.add("closing");
        navContainer.classList.add("closing");
        
        // Important: Keep the active class during animation
        // This ensures the slide animation completes properly
        
        // Use a timeout that matches your animation duration (700ms)
        setTimeout(function() {
          navMenu.classList.remove("active", "closing");
          navContainer.classList.remove("active", "closing");
        }, 500);
      } else {
        // If menu is not open, open it with fadeInDown animation
        navMenu.classList.add("active");
        navContainer.classList.add("active");
        // Ensure closing class is removed if present
        navMenu.classList.remove("closing");
        navContainer.classList.remove("closing");
      }
      
      // Toggle hamburger "open" state and header expanded class
      hamburger.classList.toggle("open");
      pageHeader.classList.toggle("nav-expanded");
    });
});
  
  // End Hamburger Toggle Menu
  
  /***Scroll Effects****/
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
  /***End Scroll Effects****/

  
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




