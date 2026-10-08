// Lida Yan — academic site scripts
// 1) Mobile navigation toggle
// 2) Highlight the active nav link for the current page

(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var navigation = document.querySelector(".nav");
  if (toggle) {
    function setNavigationOpen(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    setNavigationOpen(false);
    toggle.addEventListener("click", function () {
      setNavigationOpen(!document.body.classList.contains("nav-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        setNavigationOpen(false);
        toggle.focus();
      }
    });

    if (navigation) {
      navigation.addEventListener("click", function (event) {
        if (event.target.closest("a")) setNavigationOpen(false);
      });
    }

    window.matchMedia("(max-width: 760px)").addEventListener("change", function () {
      setNavigationOpen(false);
    });
  }

  // Active nav link based on the current page filename
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (!here || here === "") here = "index.html";

  var links = document.querySelectorAll(".nav a");
  links.forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    var target = href.split("/").pop() || "index.html";
    if (target === here) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Each research section has an independent figure gallery.
  document.querySelectorAll(".research-carousel").forEach(function (gallery) {
    var figures = gallery.querySelectorAll(".research-figure");
    var controls = gallery.querySelector(".research-carousel__controls");
    var counter = gallery.querySelector(".research-carousel__counter");
    var current = 0;
    if (!figures.length) return;

    function showFigure(index) {
      current = (index + figures.length) % figures.length;
      figures.forEach(function (figure, position) {
        figure.hidden = position !== current;
        figure.setAttribute("role", "group");
        figure.setAttribute("aria-roledescription", "slide");
        figure.setAttribute("aria-label", (position + 1) + " of " + figures.length);
      });
      counter.textContent = "Figure " + (current + 1) + " of " + figures.length;
    }

    gallery.querySelectorAll(".research-carousel__arrow").forEach(function (button) {
      button.addEventListener("click", function () {
        showFigure(current + Number(button.getAttribute("data-direction")));
      });
    });

    gallery.addEventListener("keydown", function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showFigure(current + (event.key === "ArrowRight" ? 1 : -1));
      }
    });

    showFigure(0);
    gallery.classList.add("is-enhanced");
    controls.hidden = figures.length < 2;
  });
})();
