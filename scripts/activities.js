/* ── activities.js ──────────────────────────────────────────────────────────
 * Renders activity cards from ACTIVITIES_DATA (defined in activities-data.js).
 * Must be loaded AFTER activities-data.js in your <head>.
 *
 * To add a new activity:
 *   1. Add an entry to activities-data.js
 *   2. Add <div class="accomplishment-map-card" data-activity="your-id"></div> in HTML
 *   Done — this file never needs to change.
 * ─────────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  function getTier(zoom) {
    if (zoom >= 13) return "full";
    if (zoom >= 10) return "mid";
    return "overview";
  }

  /** Create an element with optional className and children (strings become text nodes). */
  function node(tag, className, ...children) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    for (const child of children) {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child) {
        el.appendChild(child);
      }
    }
    return el;
  }

  /** Create an <a> with className, href, text, and optional target. */
  function link(className, href, text, target) {
    const a = node("a", className, text);
    a.href = href;
    if (target) a.target = target;
    return a;
  }

  /** Clone an element's child nodes into a new wrapper. */
  function cloneInto(tag, className, source) {
    const wrap = node(tag, className);
    for (const child of source.childNodes) {
      wrap.appendChild(child.cloneNode(true));
    }
    return wrap;
  }

  function renderActivity(container, id, activity) {
    const isHof = container.classList.contains("hof");
    const blogUrl = container.dataset.blogUrl;
    const headClass = "accomplishment-map-head" + (isHof ? " hof" : "");
    const footerClass =
      "accomplishment-map-footer" + (blogUrl ? " has-blog" : "");

    // ── Shared builders ──

    function buildTags() {
      const wrap = node("div", "accomplishment-tags");
      for (const t of activity.tags) {
        wrap.appendChild(node("span", "accomplishment-tag " + t.cls, t.label));
      }
      return wrap;
    }

    function buildHead() {
      return node(
        "div",
        headClass,
        node("span", "accomplishment-map-name", activity.name),
        buildTags(),
      );
    }

    function buildFooter() {
      const footer = node("div", footerClass);
      if (blogUrl) {
        footer.appendChild(
          link("accomplishment-map-blog-btn", blogUrl, "Read the full story →"),
        );
      }
      footer.appendChild(
        link(
          "accomplishment-map-strava-btn",
          activity.stravaUrl,
          "View on Strava",
          "_blank",
        ),
      );
      return footer;
    }

    function buildMapDiv(mapId, className) {
      const div = document.createElement("div");
      div.className = className;
      div.id = mapId;
      div.style.background = activity.mapBg;
      return div;
    }

    // ── Desktop ──

    const left = node(
      "div",
      "accomplishment-map-left",
      buildHead(),
      node("div", "accomplishment-map-desc-slot"),
      node("div", "accomplishment-map-achieve-stats-slot"),
    );

    const statsList = node("div", "accomplishment-map-stats-list");
    for (const s of activity.actStats) {
      statsList.appendChild(
        node(
          "div",
          "accomplishment-map-stat-item",
          node("span", "accomplishment-map-stat-label", s.label),
          node("span", "accomplishment-map-stat-val", s.val),
        ),
      );
    }

    const right = node(
      "div",
      "accomplishment-map-right",
      node(
        "div",
        "accomplishment-map-wrap",
        buildMapDiv("map-" + id, "accomplishment-map"),
      ),
      statsList,
      buildFooter(),
    );

    container.appendChild(node("div", "accomplishment-map-inner", left, right));

    // ── Mobile ──

    const mobileTop = node(
      "div",
      "accomplishment-map-mobile-top",
      buildHead(),
      node("div", "accomplishment-map-desc-slot-m"),
      node("div", "accomplishment-map-achieve-stats-slot-m"),
    );

    const statsMobile = node("div", "accomplishment-map-stats-mobile");
    for (const s of activity.actStats) {
      statsMobile.appendChild(
        node(
          "div",
          "accomplishment-map-stat-m",
          node("div", "accomplishment-map-stat-val-m", s.val),
          node("div", "accomplishment-map-stat-label-m", s.label),
        ),
      );
    }

    const mobile = node(
      "div",
      "accomplishment-map-mobile",
      mobileTop,
      buildMapDiv("map-m-" + id, "accomplishment-map-mobile-map"),
      statsMobile,
      buildFooter(),
    );

    container.appendChild(mobile);

    // ── HoF badge ──

    const hofUrl = container.dataset.hofUrl;
    if (isHof && hofUrl) {
      container.appendChild(
        link("accomplishment-hof-corner", hofUrl, "★ Hall of Fame", "_blank"),
      );

      const mobileFooter = container.querySelector(
        ".accomplishment-map-mobile .accomplishment-map-footer",
      );
      if (mobileFooter) {
        mobileFooter.classList.add("hof");
        mobileFooter.insertBefore(
          link(
            "accomplishment-hof-footer-link",
            hofUrl,
            "★ Hall of Fame",
            "_blank",
          ),
          mobileFooter.firstChild,
        );
      }
    }

    // ── Copy description & achieve stats from parent card ──

    const achCard = container.closest(".accomplishment");
    if (achCard) {
      const desc = achCard.querySelector(".accomplishment-desc");
      const stats = achCard.querySelector(".accomplishment-stats");

      if (desc) {
        for (const slot of container.querySelectorAll(
          ".accomplishment-map-desc-slot, .accomplishment-map-desc-slot-m",
        )) {
          slot.appendChild(cloneInto("p", "accomplishment-map-desc", desc));
        }
        desc.style.display = "none";
      }

      if (stats) {
        for (const slot of container.querySelectorAll(
          ".accomplishment-map-achieve-stats-slot, .accomplishment-map-achieve-stats-slot-m",
        )) {
          slot.appendChild(
            cloneInto("div", "accomplishment-map-achieve-stats", stats),
          );
        }
        stats.style.display = "none";
      }
    }

    // Init maps
    initMap("map-" + id, activity);
    initMap("map-m-" + id, activity);
  }

  function initMap(mapId, activity) {
    const map = L.map(mapId, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 },
    ).addTo(map);

    const polyline = L.polyline(activity.points.overview, {
      color: activity.color,
      weight: 2.5,
      opacity: 0.9,
    }).addTo(map);

    const full = activity.points.full;

    L.circleMarker(full[0], {
      radius: 5,
      color: activity.startColor,
      fillColor: activity.startColor,
      fillOpacity: 1,
      weight: 0,
    }).addTo(map);

    L.circleMarker(full[full.length - 1], {
      radius: 5,
      color: "#FC4C02",
      fillColor: "#FC4C02",
      fillOpacity: 1,
      weight: 0,
    }).addTo(map);

    const bounds = polyline.getBounds();
    map.fitBounds(bounds, { padding: [12, 12] });

    let currentTier = "overview";
    map.on("zoomend", () => {
      const newTier = getTier(map.getZoom());
      if (newTier !== currentTier) {
        polyline.setLatLngs(activity.points[newTier]);
        currentTier = newTier;
      }
    });

    let interactive = false;
    document.getElementById(mapId).addEventListener("click", () => {
      if (!interactive) {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.touchZoom.enable();
        interactive = true;
      }
    });

    // Re-fit map when container resizes (fixes mobile zoom/tile misalignment)
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        map.invalidateSize();
        if (!interactive) {
          map.fitBounds(bounds, { padding: [12, 12] });
        }
      });
      ro.observe(document.getElementById(mapId));
    }
  }

  function initToggle() {
    const toggle = document.getElementById("accomplishments-toggle");
    const extended = document.querySelectorAll(".accomplishment-extended");
    if (!toggle) return;

    const setView = (view) => {
      const isHighlights = view === "highlights";
      extended.forEach((item) => {
        item.style.display = isHighlights ? "none" : "";
      });
      toggle.classList.toggle("all", !isHighlights);
      localStorage.setItem("accomplishments-view", view);
    };

    toggle.addEventListener("click", () => {
      const current =
        localStorage.getItem("accomplishments-view") || "highlights";
      setView(current === "highlights" ? "all" : "highlights");
    });

    const saved = localStorage.getItem("accomplishments-view") || "highlights";
    setView(saved);
  }

  function init() {
    if (typeof ACTIVITIES_DATA === "undefined") {
      console.error(
        "activities.js: ACTIVITIES_DATA not found. Load activities-data.js first.",
      );
      return;
    }

    const containers = document.querySelectorAll(
      ".accomplishment-map-card[data-activity]",
    );

    containers.forEach((container) => {
      const id = container.dataset.activity;
      if (ACTIVITIES_DATA[id]) {
        renderActivity(container, id, ACTIVITIES_DATA[id]);
      } else {
        console.warn("activities.js: no entry found for id:", id);
      }
    });

    initToggle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
