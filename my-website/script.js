(function () {
  "use strict";

  var EMAIL_ADDRESS = "mailvenkatasagar@gmail.com";
  var THEME_KEY = "sagar-portfolio-theme";
  var AVATAR_KEY = "sagar-portfolio-avatar";
  var AVATAR_MAX_SIDE = 512;
  var AVATAR_JPEG_QUALITY = 0.88;

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

  /* ---------- Hero: default file (web) + optional local override (localStorage) ---------- */
  var avatarFigure = document.getElementById("intro-avatar");
  var avatarImg = document.getElementById("intro-avatar-img");
  var avatarInput = document.getElementById("avatar-file-input");
  var avatarRemoveBtn = document.getElementById("avatar-remove-btn");

  function hasLocalAvatarOverride() {
    try {
      var s = localStorage.getItem(AVATAR_KEY);
      return !!(s && s.indexOf("data:image") === 0);
    } catch (err) {
      return false;
    }
  }

  function updateAvatarRemoveButton() {
    if (!avatarRemoveBtn) return;
    avatarRemoveBtn.hidden = !hasLocalAvatarOverride();
  }

  function finalizeAvatarVisible() {
    if (!avatarFigure || !avatarImg) return;
    if (!avatarImg.naturalWidth) return;
    avatarImg.alt = "Portrait of Sagar Venkata";
    avatarImg.removeAttribute("hidden");
    avatarFigure.classList.add("has-photo");
    updateAvatarRemoveButton();
  }

  function hideAvatarPhoto() {
    if (!avatarFigure || !avatarImg) return;
    avatarImg.alt = "";
    avatarImg.setAttribute("hidden", "");
    avatarFigure.classList.remove("has-photo");
    updateAvatarRemoveButton();
  }

  function onAvatarImgLoad() {
    finalizeAvatarVisible();
  }

  function onAvatarImgError() {
    if (!avatarImg) return;
    avatarImg.removeAttribute("src");
    hideAvatarPhoto();
  }

  if (avatarImg) {
    avatarImg.addEventListener("load", onAvatarImgLoad);
    avatarImg.addEventListener("error", onAvatarImgError);
  }

  function downscaleToJpeg(dataUrl, maxSide, quality, done) {
    var img = new Image();
    img.onload = function () {
      var w = img.naturalWidth;
      var h = img.naturalHeight;
      if (!w || !h) {
        done(dataUrl);
        return;
      }
      var scale = Math.min(1, maxSide / Math.max(w, h));
      var nw = Math.max(1, Math.round(w * scale));
      var nh = Math.max(1, Math.round(h * scale));
      var canvas = document.createElement("canvas");
      canvas.width = nw;
      canvas.height = nh;
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        done(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, nw, nh);
      var out;
      try {
        out = canvas.toDataURL("image/jpeg", quality);
      } catch (err) {
        out = dataUrl;
      }
      done(out);
    };
    img.onerror = function () {
      done(dataUrl);
    };
    img.src = dataUrl;
  }

  function applyAvatarDataUrl(dataUrl) {
    if (!avatarFigure || !avatarImg || !dataUrl || dataUrl.indexOf("data:image") !== 0) return;
    avatarImg.src = dataUrl;
    if (avatarImg.complete && avatarImg.naturalWidth) {
      finalizeAvatarVisible();
    }
  }

  function clearAvatar() {
    if (!avatarFigure || !avatarImg) return;
    try {
      localStorage.removeItem(AVATAR_KEY);
    } catch (err) {
      /* ignore */
    }
    if (avatarInput) avatarInput.value = "";
    var def = avatarImg.getAttribute("data-default-src");
    if (def) {
      avatarImg.removeAttribute("src");
      avatarImg.src = def;
      if (avatarImg.complete && avatarImg.naturalWidth) {
        finalizeAvatarVisible();
      }
    } else {
      avatarImg.removeAttribute("src");
      hideAvatarPhoto();
    }
    updateAvatarRemoveButton();
  }

  function persistAvatar(dataUrl) {
    try {
      localStorage.setItem(AVATAR_KEY, dataUrl);
      applyAvatarDataUrl(dataUrl);
    } catch (err) {
      applyAvatarDataUrl(dataUrl);
      window.alert(
        "Your photo could not be saved in this browser (storage limit). It is shown for this visit only."
      );
    }
  }

  try {
    var stored = localStorage.getItem(AVATAR_KEY);
    if (stored && stored.indexOf("data:image") === 0) {
      applyAvatarDataUrl(stored);
    } else {
      var def = avatarImg && avatarImg.getAttribute("data-default-src");
      if (def) {
        avatarImg.src = def;
        if (avatarImg.complete && avatarImg.naturalWidth) {
          finalizeAvatarVisible();
        }
      }
    }
  } catch (err) {
    /* ignore */
  }

  if (avatarInput && avatarImg) {
    avatarInput.addEventListener("change", function () {
      var file = avatarInput.files && avatarInput.files[0];
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        avatarInput.value = "";
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var raw = reader.result;
        if (typeof raw !== "string") {
          avatarInput.value = "";
          return;
        }
        downscaleToJpeg(raw, AVATAR_MAX_SIDE, AVATAR_JPEG_QUALITY, function (finalUrl) {
          persistAvatar(finalUrl);
          avatarInput.value = "";
        });
      };
      reader.onerror = function () {
        avatarInput.value = "";
      };
      reader.readAsDataURL(file);
    });
  }

  if (avatarRemoveBtn) {
    avatarRemoveBtn.addEventListener("click", clearAvatar);
  }
})();
