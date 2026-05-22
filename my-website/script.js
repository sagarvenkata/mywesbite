(function () {
  "use strict";

  var EMAIL_ADDRESS = "mailvenkatasagar@gmail.com";
  var THEME_KEY = "sagar-portfolio-theme";

  function getTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "light" || t === "dark" ? t : "dark";
  }

  function syncThemeButtons() {
    var current = getTheme();
    document.querySelectorAll(".theme-toggle__btn").forEach(function (btn) {
      var mode = btn.getAttribute("data-set-theme");
      btn.setAttribute("aria-pressed", mode === current ? "true" : "false");
    });
  }

  function setTheme(mode) {
    if (mode !== "light" && mode !== "dark") return;
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (err) {
      /* ignore */
    }
    syncThemeButtons();
  }

  document.querySelectorAll(".theme-toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(btn.getAttribute("data-set-theme"));
    });
  });

  window.addEventListener("storage", function (e) {
    if (e.key !== THEME_KEY) return;
    if (e.newValue === "light" || e.newValue === "dark") {
      document.documentElement.setAttribute("data-theme", e.newValue);
      syncThemeButtons();
    }
  });

  syncThemeButtons();

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var backdrop = document.getElementById("nav-backdrop");
  var navLinks = document.querySelectorAll(".nav__link");

  function setMenuOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) {
      if (open) backdrop.removeAttribute("hidden");
      else backdrop.setAttribute("hidden", "");
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!nav.classList.contains("is-open"));
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setMenuOpen(false);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 832px)").matches) {
      setMenuOpen(false);
    }
  });

  /* ---------- Scroll spy: active nav ---------- */
  var sectionIds = ["work", "projects", "writing", "skills", "education", "contact"];

  function clearActiveLinks() {
    navLinks.forEach(function (l) {
      l.classList.remove("is-active");
    });
  }

  function setActiveById(id) {
    clearActiveLinks();
    var selector = '.nav__link[data-section="' + id + '"]';
    var el = document.querySelector(selector);
    if (el) el.classList.add("is-active");
  }

  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var navHeight = 0;
    function updateNavHeight() {
      var header = document.querySelector(".site-header");
      navHeight = header ? header.offsetHeight : 72;
    }
    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    var observerSpy = new IntersectionObserver(
      function (entries) {
        var best = null;
        var bestRatio = 0;
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio > bestRatio) {
            bestRatio = en.intersectionRatio;
            best = en.target;
          }
        });
        if (best && best.id) {
          setActiveById(best.id);
        }
      },
      {
        root: null,
        rootMargin: "-" + Math.round(navHeight + 12) + "px 0px -45% 0px",
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
      }
    );

    sections.forEach(function (sec) {
      observerSpy.observe(sec);
    });

    window.addEventListener("scroll", function () {
      if (window.scrollY < 100) {
        clearActiveLinks();
      }
    }, { passive: true });
  }

  function applyHashNav() {
    var id = (location.hash || "").replace(/^#/, "");
    if (id && sectionIds.indexOf(id) !== -1) {
      setActiveById(id);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHashNav);
  } else {
    applyHashNav();
  }
  window.addEventListener("hashchange", applyHashNav);

  /* ---------- Fade-in sections ---------- */
  var fadeEls = document.querySelectorAll(".section--fade");

  if ("IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Email: copy + tooltip; mailto still works ---------- */
  var emailLink = document.getElementById("email-link");
  var emailTooltip = document.getElementById("email-tooltip");
  var tooltipTimer;

  function showEmailTooltip() {
    if (!emailTooltip) return;
    emailTooltip.hidden = false;
    requestAnimationFrame(function () {
      emailTooltip.classList.add("is-visible");
    });
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
      emailTooltip.classList.remove("is-visible");
      setTimeout(function () {
        emailTooltip.hidden = true;
      }, 280);
    }, 2200);
  }

  if (emailLink) {
    emailLink.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL_ADDRESS).then(showEmailTooltip).catch(showEmailTooltip);
      } else {
        showEmailTooltip();
      }
    });
  }

})();
