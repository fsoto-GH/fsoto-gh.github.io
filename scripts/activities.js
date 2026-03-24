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

  function renderActivity(container, id, activity) {
    var tagsHtml = activity.tags
      .map(function (t) {
        return (
          '<span class="accomplishment-tag ' +
          t.cls +
          '">' +
          t.label +
          "</span>"
        );
      })
      .join("");

    var actStatsHtml = activity.actStats
      .map(function (s) {
        return (
          '<div class="accomplishment-map-stat-item">' +
          '<span class="accomplishment-map-stat-label">' +
          s.label +
          "</span>" +
          '<span class="accomplishment-map-stat-val">' +
          s.val +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var actStatsMobileHtml = activity.actStats
      .map(function (s) {
        return (
          '<div class="accomplishment-map-stat-m">' +
          '<div class="accomplishment-map-stat-val-m">' +
          s.val +
          "</div>" +
          '<div class="accomplishment-map-stat-label-m">' +
          s.label +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    var stravaBtn =
      '<a class="accomplishment-map-strava-btn" href="' +
      activity.stravaUrl +
      '" target="_blank">' +
      "View on Strava</a>";

    container.innerHTML =
      // Desktop: left content + right map
      '<div class="accomplishment-map-inner">' +
      '<div class="accomplishment-map-left">' +
      '<div class="accomplishment-map-head' +
      (container.classList.contains("hof") ? " hof" : "") +
      '">' +
      '<span class="accomplishment-map-name">' +
      activity.name +
      "</span>" +
      '<div class="accomplishment-tags">' +
      tagsHtml +
      "</div>" +
      "</div>" +
      '<div class="accomplishment-map-desc-slot"></div>' +
      '<div class="accomplishment-map-achieve-stats-slot"></div>' +
      "</div>" +
      '<div class="accomplishment-map-right">' +
      '<div class="accomplishment-map-wrap">' +
      '<div class="accomplishment-map" id="map-' +
      id +
      '" style="background:' +
      activity.mapBg +
      '"></div>' +
      "</div>" +
      '<div class="accomplishment-map-stats-list">' +
      actStatsHtml +
      "</div>" +
      '<div class="accomplishment-map-footer">' +
      stravaBtn +
      "</div>" +
      "</div>" +
      "</div>" +
      // Mobile: stacked (description + achieve stats above map)
      '<div class="accomplishment-map-mobile">' +
      '<div class="accomplishment-map-mobile-top">' +
      '<div class="accomplishment-map-head' +
      (container.classList.contains("hof") ? " hof" : "") +
      '">' +
      '<span class="accomplishment-map-name">' +
      activity.name +
      "</span>" +
      '<div class="accomplishment-tags">' +
      tagsHtml +
      "</div>" +
      "</div>" +
      '<div class="accomplishment-map-desc-slot-m"></div>' +
      '<div class="accomplishment-map-achieve-stats-slot-m"></div>' +
      "</div>" +
      '<div class="accomplishment-map-mobile-map" id="map-m-' +
      id +
      '" style="background:' +
      activity.mapBg +
      '"></div>' +
      '<div class="accomplishment-map-stats-mobile">' +
      actStatsMobileHtml +
      "</div>" +
      '<div class="accomplishment-map-footer">' +
      stravaBtn +
      "</div>" +
      "</div>";

    // Inject HoF corner badge after innerHTML is set
    var hofUrl = container.dataset.hofUrl;
    if (container.classList.contains("hof") && hofUrl) {
      // Desktop: corner badge
      var badge = document.createElement("a");
      badge.className = "accomplishment-hof-corner";
      badge.href = hofUrl;
      badge.target = "_blank";
      badge.textContent = "★ Hall of Fame";
      container.appendChild(badge);

      // Mobile: footer link alongside Strava
      var mobileFooter = container.querySelector(
        ".accomplishment-map-mobile .accomplishment-map-footer",
      );
      if (mobileFooter) {
        mobileFooter.classList.add("hof");
        var mobileLink = document.createElement("a");
        mobileLink.className = "accomplishment-hof-footer-link";
        mobileLink.href = hofUrl;
        mobileLink.target = "_blank";
        mobileLink.textContent = "★ Hall of Fame";
        mobileFooter.insertBefore(mobileLink, mobileFooter.firstChild);
      }
    }

    // Copy description and achieve stats from the parent accomplishment card
    // into both the desktop and mobile slots
    var achCard = container.closest(".accomplishment");
    if (achCard) {
      var desc = achCard.querySelector(".accomplishment-desc");
      var stats = achCard.querySelector(".accomplishment-stats");

      if (desc) {
        container.querySelector(".accomplishment-map-desc-slot").innerHTML =
          '<p class="accomplishment-map-desc">' + desc.innerHTML + "</p>";
        container.querySelector(".accomplishment-map-desc-slot-m").innerHTML =
          '<p class="accomplishment-map-desc">' + desc.innerHTML + "</p>";
        desc.style.display = "none";
      }

      if (stats) {
        container.querySelector(
          ".accomplishment-map-achieve-stats-slot",
        ).innerHTML =
          '<div class="accomplishment-map-achieve-stats">' +
          stats.innerHTML +
          "</div>";
        container.querySelector(
          ".accomplishment-map-achieve-stats-slot-m",
        ).innerHTML =
          '<div class="accomplishment-map-achieve-stats">' +
          stats.innerHTML +
          "</div>";
        stats.style.display = "none";
      }
    }

    // Init desktop map
    initMap("map-" + id, activity);
    // Init mobile map
    initMap("map-m-" + id, activity);
  }

  function initMap(mapId, activity) {
    var map = L.map(mapId, {
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

    var polyline = L.polyline(activity.points.overview, {
      color: activity.color,
      weight: 2.5,
      opacity: 0.9,
    }).addTo(map);

    var full = activity.points.full;

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

    var bounds = polyline.getBounds();
    map.fitBounds(bounds, { padding: [12, 12] });

    var currentTier = "overview";
    map.on("zoomend", function () {
      var newTier = getTier(map.getZoom());
      if (newTier !== currentTier) {
        polyline.setLatLngs(activity.points[newTier]);
        currentTier = newTier;
      }
    });

    var interactive = false;
    document.getElementById(mapId).addEventListener("click", function () {
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
      var ro = new ResizeObserver(function () {
        map.invalidateSize();
        if (!interactive) {
          map.fitBounds(bounds, { padding: [12, 12] });
        }
      });
      ro.observe(document.getElementById(mapId));
    }
  }

  function initToggle() {
    var toggle = document.getElementById("accomplishments-toggle");
    var extended = document.querySelectorAll(".accomplishment-extended");
    if (!toggle) return;

    function setView(view) {
      var isHighlights = view === "highlights";
      extended.forEach(function (el) {
        el.style.display = isHighlights ? "none" : "";
      });
      toggle.classList.toggle("all", !isHighlights);
      localStorage.setItem("accomplishments-view", view);
    }

    toggle.addEventListener("click", function () {
      var current =
        localStorage.getItem("accomplishments-view") || "highlights";
      setView(current === "highlights" ? "all" : "highlights");
    });

    var saved = localStorage.getItem("accomplishments-view") || "highlights";
    setView(saved);
  }

  function init() {
    if (typeof ACTIVITIES_DATA === "undefined") {
      console.error(
        "activities.js: ACTIVITIES_DATA not found. Load activities-data.js first.",
      );
      return;
    }
    var containers = document.querySelectorAll(
      ".accomplishment-map-card[data-activity]",
    );

    // only lazy load on 'more' view, as the best will be limited data points
    let currentView =
      localStorage.getItem("accomplishments-view") || "highlights";
    if (currentView !== "highlights" && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var container = entry.target;
              var id = container.dataset.activity;
              if (ACTIVITIES_DATA[id]) {
                renderActivity(container, id, ACTIVITIES_DATA[id]);
              } else {
                console.warn("activities.js: no entry found for id:", id);
              }
              observer.unobserve(container);
            }
          });
        },
        {
          rootMargin: "25% 0px",
          threshold: 0,
        },
      );

      containers.forEach(function (container) {
        observer.observe(container);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      containers.forEach(function (container) {
        var id = container.dataset.activity;
        if (ACTIVITIES_DATA[id]) {
          renderActivity(container, id, ACTIVITIES_DATA[id]);
        } else {
          console.warn("activities.js: no entry found for id:", id);
        }
      });
    }

    initToggle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
