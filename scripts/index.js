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

const backToTopButton = () => {
  var btn = document.getElementById("back-to-top");
  var threshold = 300;

  window.addEventListener(
    "scroll",
    function () {
      btn.classList.toggle("visible", window.scrollY > threshold);
    },
    { passive: true },
  );

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".accomplishment").forEach((el, i) => {
    el.style.animation = `fadeUp 0.4s ${0.05 + i * 0.06}s ease both`;
  });
};

document.addEventListener("DOMContentLoaded", function () {
  bindPictures();
  smoothScrollRelativeLinks();
  backToTopButton();
});
