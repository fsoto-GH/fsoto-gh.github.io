"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburger-icon");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-link");
  const bar1 = document.getElementById("bar1");
  const bar2 = document.getElementById("bar2");
  const bar3 = document.getElementById("bar3");
  let open = false;

  const setOpen = (state) => {
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
  };

  btn.addEventListener("click", () => {
    setOpen(!open);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

  /* Back-to-top */
  const btt = document.getElementById("back-to-top");
  window.addEventListener(
    "scroll",
    () => {
      btt.classList.toggle("visible", window.scrollY > 300);
    },
    { passive: true },
  );

  btt.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Close drawer if viewport resizes past mobile breakpoint */
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1040 && open) {
      setOpen(false);
    }
  });
});
