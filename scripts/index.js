"use strict";

const bindPictures = () => {
  Fancybox.bind("[data-fancybox]");
};

const smoothScrollRelativeLinks = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });

      document.location = `${this.getAttribute("href")}`;
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  bindPictures();
  smoothScrollRelativeLinks();
});
