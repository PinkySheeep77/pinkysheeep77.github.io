// Gestion du scroll : repartir en haut au chargement
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Équivalent natif de :
// $(document).ready(function(){ $(this).scrollTop(0); });
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  const body = document.body;
  const loader = document.querySelector(".page-loader");
  const loaderBar = document.querySelector(".page-loader__bar");
  const header = document.querySelector(".header");
  const burger = document.querySelector(".header__burger");
  const overlay = document.querySelector(".menu-overlay");
  const yearSpan = document.querySelector("#year");
  const backToTopLink = document.querySelector(".footer__back");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Bouton "Retour en haut" dans le footer
  if (backToTopLink) {
    backToTopLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Loader timeline
  gsap.timeline({
    defaults: { ease: "power2.out" },
  })
    .to(loaderBar, { scaleX: 1, duration: 1.2 })
    .to(loader, { yPercent: -100, duration: 0.9, delay: 0.1 }, "-=0.2")
    .from(
      [".header__logo", ".header__nav .nav-link", ".hero__tagline", ".hero__title", ".hero__text", ".hero__actions", ".hero__meta"],
      {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.7,
      },
      "-=0.4"
    );

  // Animation des lumières d'ambiance en fond (mouvement plus visible)
  const orbs = gsap.utils.toArray(".bg-lights__orb");
  orbs.forEach((orb, index) => {
    const amplitudeX = index % 2 === 0 ? 140 : -140;
    const amplitudeY = index === 1 ? 90 : -70;

    gsap.to(orb, {
      x: amplitudeX,
      y: amplitudeY,
      duration: 10 + index * 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });

  // Sticky header appearance
  const updateHeader = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle("header--scrolled", scrolled);
  };

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  // Mobile menu
  const toggleMenu = () => {
    const isOpen = burger.classList.toggle("is-open");
    body.classList.toggle("no-scroll", isOpen);

    gsap.to(overlay, {
      opacity: isOpen ? 1 : 0,
      duration: 0.35,
      ease: "power2.out",
      onStart: () => {
        if (isOpen) overlay.style.pointerEvents = "auto";
      },
      onComplete: () => {
        if (!isOpen) overlay.style.pointerEvents = "none";
      },
    });

    gsap.fromTo(
      ".menu-overlay__link",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.07,
        ease: "power2.out",
      }
    );
  };

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  document.querySelectorAll(".menu-overlay__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (burger.classList.contains("is-open")) toggleMenu();
    });
  });

  // Scroll-triggered animations
  gsap.registerPlugin(ScrollTrigger);

  // Animation texte des en-têtes de section
  const animateSectionHeaders = () => {
    gsap.utils.toArray(".section__header").forEach((headerEl) => {
      const parts = [
        headerEl.querySelector(".section__eyebrow"),
        headerEl.querySelector(".section__title"),
        headerEl.querySelector(".section__subtitle"),
      ].filter(Boolean);

      if (!parts.length) return;

      gsap.from(parts, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerEl,
          start: "top 80%",
        },
      });
    });
  };

  animateSectionHeaders();

  // Colonnes de texte: léger slide up
  gsap.utils.toArray(".section__col").forEach((col) => {
    gsap.from(col, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: col,
        start: "top 80%",
      },
    });
  });

  // Cartes expérience: entrée par la droite avec stagger par rangée
  const experienceRow = document.querySelector(".experience-grid");
  if (experienceRow) {
    gsap.from(".experience-card", {
      x: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: experienceRow,
        start: "top 75%",
      },
    });
  }

  // Galerie statique: zoom léger des vignettes
  const galleryTrack = document.querySelector(".gallery-scroll__track");
  if (galleryTrack) {
    gsap.from(".gallery-scroll__item", {
      scale: 0.9,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: galleryTrack,
        start: "top 80%",
      },
    });
  }

  // Formulaire contact: montée + léger scale
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    gsap.from(contactForm, {
      y: 40,
      scale: 0.97,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contactForm,
        start: "top 80%",
      },
    });
  }

  // Subtle parallax on hero image
  gsap.to(".hero__img", {
    scale: 1.08,
    yPercent: 6,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Galerie : on garde uniquement le layout statique pour le moment

  // Prevent default submit (placeholder)
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Formulaire de démonstration. À connecter à ton back‑end / e‑mail.");
    });
  }
});
