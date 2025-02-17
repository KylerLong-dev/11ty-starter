
document.addEventListener('click', () => {
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
});

/***Start Full-width Navigation When Scrolling ***/
document.addEventListener("scroll", () => {
    const pageHeader = document.querySelector('.page-header_container');
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



//Current page receives active css style
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





