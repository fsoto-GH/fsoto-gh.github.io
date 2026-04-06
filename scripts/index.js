"use strict";

const bindPictures = () => {
  Fancybox.bind("[data-fancybox]");
};

const smoothScrollRelativeLinks = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      let anchor = this.getAttribute("href");
      document
        .querySelector(anchor === "#" ? "#contact" : anchor)
        .scrollIntoView({
          behavior: "smooth",
        });

      window.history.pushState(null, null, `${this.getAttribute("href")}`);
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  bindPictures();
  smoothScrollRelativeLinks();
  backToTopButton();
});
