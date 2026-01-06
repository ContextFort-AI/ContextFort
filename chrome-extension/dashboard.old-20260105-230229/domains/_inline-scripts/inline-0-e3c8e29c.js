
    (function () {
      try {
        var root = document.documentElement;
        var PERSISTENCE = {"theme_mode":"client-cookie","theme_preset":"client-cookie","content_layout":"client-cookie","navbar_style":"client-cookie","sidebar_variant":"client-cookie","sidebar_collapsible":"client-cookie"};
        var DEFAULTS = {"theme_mode":"dark","theme_preset":"contextfort","content_layout":"centered","navbar_style":"sticky","sidebar_variant":"inset","sidebar_collapsible":"icon"};

        function readCookie(name) {
          var match = document.cookie.split("; ").find(function(c) {
            return c.indexOf(name + "=") === 0;
          });
          return match ? match.split("=")[1] : null;
        }

        function readLocal(name) {
          try {
            return window.localStorage.getItem(name);
          } catch (e) {
            return null;
          }
        }

        function readPreference(key, fallback) {
          var mode = PERSISTENCE[key];
          var value = null;

          if (mode === "localStorage") {
            value = readLocal(key);
          }

          if (!value && (mode === "client-cookie" || mode === "server-cookie")) {
            value = readCookie(key);
          }

          if (!value || typeof value !== "string") {
            return fallback;
          }

          return value;
        }

        var rawMode = readPreference("theme_mode", DEFAULTS.theme_mode);
        var rawPreset = readPreference("theme_preset", DEFAULTS.theme_preset);
        var rawContentLayout = readPreference("content_layout", DEFAULTS.content_layout);
        var rawNavbarStyle = readPreference("navbar_style", DEFAULTS.navbar_style);
        var rawSidebarVariant = readPreference("sidebar_variant", DEFAULTS.sidebar_variant);
        var rawSidebarCollapsible = readPreference("sidebar_collapsible", DEFAULTS.sidebar_collapsible);

        var mode = (rawMode === "dark" || rawMode === "light") ? rawMode : "light";
        var preset = rawPreset || DEFAULTS.theme_preset;
        var contentLayout = rawContentLayout || DEFAULTS.content_layout;
        var navbarStyle = rawNavbarStyle || DEFAULTS.navbar_style;
        var sidebarVariant = rawSidebarVariant || DEFAULTS.sidebar_variant;
        var sidebarCollapsible = rawSidebarCollapsible || DEFAULTS.sidebar_collapsible;

        root.classList.remove("light", "dark");
        root.classList.add(mode);
        root.setAttribute("data-theme-preset", preset);
        root.setAttribute("data-content-layout", contentLayout);
        root.setAttribute("data-navbar-style", navbarStyle);
        root.setAttribute("data-sidebar-variant", sidebarVariant);
        root.setAttribute("data-sidebar-collapsible", sidebarCollapsible);

        root.style.colorScheme = mode === "dark" ? "dark" : "light";

        var prefs = {
          themeMode: mode,
          themePreset: preset,
          contentLayout: contentLayout,
          navbarStyle: navbarStyle,
          sidebarVariant: sidebarVariant,
          sidebarCollapsible: sidebarCollapsible,
        };

        window.__PREFERENCES__ = prefs;
      } catch (e) {
        console.warn("ThemeBootScript error:", e);
      }
    })();
  