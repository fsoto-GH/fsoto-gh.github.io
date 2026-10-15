"use strict";

document.addEventListener("DOMContentLoaded", function () {
  /* FancyBox */
  if (typeof Fancybox !== "undefined") {
    // iOS: toggling body overflow and restoring focus on close can stall momentum scrolling.
    Fancybox.bind("[data-fancybox]", {
      hideScrollbar: false,
      placeFocusBack: false,
      Hash: false,
    });
  }

  /* Reading progress */
  const bar = document.getElementById("read-progress");
  window.addEventListener(
    "scroll",
    () => {
      const s = window.scrollY;
      const t = document.documentElement.scrollHeight - window.innerHeight;
      if (t > 0) bar.style.width = ((s / t) * 100).toFixed(1) + "%";
    },
    { passive: true },
  );
});
