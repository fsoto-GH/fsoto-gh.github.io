"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("hamburger-icon");
  var menu = document.getElementById("mobile-menu");
  var links = document.querySelectorAll(".mobile-link");
  var bar1 = document.getElementById("bar1");
  var bar2 = document.getElementById("bar2");
  var bar3 = document.getElementById("bar3");
  var open = false;

  function setOpen(state) {
    open = state;
    menu.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);

    /* animate bars → X */
    if (open) {
      bar1.style.transform = "translateY(6px) rotate(45deg)";
      bar2.style.opacity = "0";
      bar3.style.transform = "translateY(-6px) rotate(-45deg)";
    } else {
      bar1.style.transform = "";
      bar2.style.opacity = "1";
      bar3.style.transform = "";
    }
  }

  btn.addEventListener("click", function () {
    setOpen(!open);
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  /* Close drawer if viewport resizes past mobile breakpoint */
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1040 && open) {
      setOpen(false);
    }
  });
});
