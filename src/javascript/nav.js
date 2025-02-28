// Start Hamburger Toggle Menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.page-header_nav-container');
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event from bubbling up
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
        
        // Add/remove overflow hidden to body to prevent scrolling when menu is open
        if (navContainer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Toggle aria-expanded for accessibility
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !expanded);
    });
    
    // Close menu when a nav item is clicked
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navContainer.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
});
// End Hamburger Toggle Menu


/***Start Full-width Navigation When Scrolling ***/
document.addEventListener("scroll", () => {
    const pageHeader = document.querySelector('.page-header_nav');
    const headerNoPadding = document.querySelector('.page-header');

    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        pageHeader.classList.add("page-header_full-width");
        headerNoPadding.classList.add("page-header_no-padding");
    } else {
        pageHeader.classList.remove("page-header_full-width");
        headerNoPadding.classList.remove("page-header_no-padding");
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




