
document.addEventListener('click', () => {
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
});

//Full-width header upon scrolling down with sticky top position
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



