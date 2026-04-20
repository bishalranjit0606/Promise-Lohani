(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  var header = document.getElementById("header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function headerScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 32);
  }
  window.addEventListener("scroll", headerScroll, { passive: true });
  headerScroll();

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeNav();
    });
  }

  var headerH = header ? header.offsetHeight : 76;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        var y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
        window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
        if (history.replaceState) history.replaceState(null, "", id);
      }
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("f-name") || {}).value || "";
      var email = (document.getElementById("f-email") || {}).value || "";
      var msg = (document.getElementById("f-msg") || {}).value || "";
      var subj = "Portfolio inquiry" + (name ? " from " + name : "");
      var body = msg + (email ? "\n\n—\n" + email : "");
      if (formStatus) formStatus.textContent = "Opening your email app…";
      window.location.href =
        "mailto:promiselohani5@gmail.com?subject=" +
        encodeURIComponent(subj) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  function fallbackStatic() {
    document.querySelectorAll(".fill").forEach(function (f) {
      var w = f.getAttribute("data-width");
      if (w) f.style.width = w + "%";
    });
    var tp = document.querySelector(".timeline-progress");
    if (tp) tp.style.height = "100%";
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    fallbackStatic();
    return;
  }

  /* Magnetic only on isolated controls — not nav links (transform was shifting the header row). */

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("is-ready");

  function initMagnetic() {
    if (reduced || coarse) return;
    document
      .querySelectorAll(".logo.magnetic, .linkedin-btn.magnetic, #contact-form .magnetic")
      .forEach(function (el) {
        var xTo = gsap.quickTo(el, "x", { duration: 0.75, ease: "power3.out" });
        var yTo = gsap.quickTo(el, "y", { duration: 0.75, ease: "power3.out" });
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.18;
          var y = (e.clientY - r.top - r.height / 2) * 0.18;
          xTo(x);
          yTo(y);
        });
        el.addEventListener("mouseleave", function () {
          xTo(0);
          yTo(0);
        });
      });
  }

  // Tilt removed for performance/stability (especially on mobile).

  if (!reduced) {
    /* ——— Hero: multi-segment timeline ——— */
    var heroTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.08,
    });

    /* Hero: text-only motion — image stays static (no fade, float, or parallax). */
    heroTl
      .from(".hero-copy .eyebrow", { opacity: 0, y: 12, duration: 0.55, ease: "power2.out" })
      .from(".hero-copy .hero-title", { opacity: 0, y: 16, duration: 0.62, ease: "power2.out" }, "-=0.35")
      .from(".hero-copy .hero-subtitle", { opacity: 0, y: 10, duration: 0.48, ease: "power2.out" }, "-=0.38")
      .from(".hero-copy .hero-lead", { opacity: 0, y: 10, duration: 0.55, ease: "power2.out" }, "-=0.35")
      .from(
        ".hero-actions .btn",
        {
          opacity: 0,
          y: 10,
          duration: 0.48,
          stagger: { each: 0.08, from: "start" },
          ease: "power2.out",
        },
        "-=0.3"
      );

    initMagnetic();

    /* ——— Scroll-triggered section timelines ——— */
    gsap.from("#about .section-block", {
      opacity: 0,
      y: 28,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: { trigger: "#about", start: "top 78%", toggleActions: "play none none none" },
    });

    gsap.from("#skills .section-head > *", {
      opacity: 0,
      y: 18,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: "#skills .section-head", start: "top 84%", toggleActions: "play none none none" },
    });

    gsap.from("#skills .skill-card", {
      opacity: 0,
      y: 24,
      duration: 0.65,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: ".skills-grid", start: "top 80%", toggleActions: "play none none none" },
    });

    document.querySelectorAll(".fill").forEach(function (fill) {
      var w = fill.getAttribute("data-width");
      if (!w) return;
      gsap.fromTo(
        fill,
        { width: "0%" },
        {
          width: w + "%",
          duration: 1.45,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: fill.closest(".skill-card") || fill,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    gsap.from("#experience .section-head > *", {
      opacity: 0,
      y: 16,
      duration: 0.58,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: "#experience .section-head", start: "top 85%", toggleActions: "play none none none" },
    });

    gsap.from("#experience .exp-card", {
      opacity: 0,
      y: 22,
      duration: 0.62,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#experience .experience-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    gsap.from(".edu-panel", {
      opacity: 0,
      y: 24,
      duration: 0.72,
      ease: "power2.out",
      scrollTrigger: { trigger: ".edu-panel", start: "top 85%", toggleActions: "play none none none" },
    });

    gsap.from("#projects .section-head > *", {
      opacity: 0,
      y: 18,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: "#projects .section-head", start: "top 84%", toggleActions: "play none none none" },
    });

    gsap.from(".project-card", {
      opacity: 0,
      y: 28,
      duration: 0.72,
      stagger: { each: 0.08, from: "start" },
      ease: "power2.out",
      scrollTrigger: { trigger: ".project-grid", start: "top 78%", toggleActions: "play none none none" },
    });

    gsap.from(".contact-intro", {
      opacity: 0,
      y: 20,
      duration: 0.72,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact-wrap", start: "top 80%", toggleActions: "play none none none" },
    });

    gsap.from(".contact-form", {
      opacity: 0,
      y: 20,
      duration: 0.72,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact-wrap", start: "top 80%", toggleActions: "play none none none" },
    });

    gsap.from(".contact-form .field", {
      opacity: 0,
      y: 12,
      duration: 0.48,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact-form", start: "top 78%", toggleActions: "play none none none" },
    });

    gsap.from(".site-footer .footer-inner", {
      opacity: 0,
      y: 14,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".site-footer", start: "top 95%", toggleActions: "play none none none" },
    });
  } else {
    fallbackStatic();
  }

  window.addEventListener("load", function () {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  });
})();
