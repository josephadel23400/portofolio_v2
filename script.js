"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const mobileQuery = window.matchMedia("(max-width: 680px)");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.add("js-ready");

function setMenuOpen(isOpen) {
  if (!menuToggle || !navLinks) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navLinks.classList.toggle("is-open", isOpen);
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      mobileQuery.matches &&
      menuToggle.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Node &&
      !menuToggle.contains(event.target) &&
      !navLinks.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) setMenuOpen(false);
  });
}

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotionQuery.matches ? "auto" : "smooth",
      block: "start"
    });
    history.replaceState(null, "", `#${targetId}`);
  });
});

const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
