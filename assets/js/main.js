/* ============================================
   KUKHOL APPS — main.js (WEB-01)
   Mobile navigation, accessibility helpers.
   No trackers, analytics, cookies,
   or external libraries.
   ============================================ */

(function () {
  "use strict";

  /**
   * Mobile navigation toggle.
   * Handles open/close, keyboard (Escape), and
   * click-outside-to-close behavior.
   */
  function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function isOpen() {
      return menu.classList.contains("open");
    }

    // Toggle on button click
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a nav link is clicked (mobile)
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        closeMenu();
      });
    }

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside the menu/toggle
    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      var target = e.target;
      if (!menu.contains(target) && !toggle.contains(target)) {
        closeMenu();
      }
    });

    // Reset state on resize to desktop
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 768 && isOpen()) {
          closeMenu();
        }
      }, 150);
    });
  }

  /**
   * Controlled (non-navigation) product CTA elements.
   * These are presentational — they look like buttons
   * but do not navigate anywhere. We prevent any
   * default action to be safe.
   */
  function initControlledElements() {
    var controlled = document.querySelectorAll('[role="button"][aria-disabled="true"]');
    for (var i = 0; i < controlled.length; i++) {
      (function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
        });
        el.addEventListener("keydown", function (e) {
          // Allow focus but prevent activation
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        });
      })(controlled[i]);
    }
  }

  /**
   * Smooth-scroll offset fix for sticky header.
   * scroll-padding-top in CSS handles this, but
   * this is a fallback for older browsers.
   */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        link.addEventListener("click", function (e) {
          var href = link.getAttribute("href");
          if (href === "#" || href.length < 2) return;

          var target = document.querySelector(href);
          if (!target) return;

          // Let CSS scroll-padding-top handle the offset
          // This is just a fallback
          if (!("scrollPaddingTop" in document.documentElement.style)) {
            e.preventDefault();
            var header = document.querySelector(".site-header");
            var offset = header ? header.offsetHeight : 0;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: "smooth" });
          }
        });
      })(links[i]);
    }
  }

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initControlledElements();
    initSmoothScroll();
  });
})();