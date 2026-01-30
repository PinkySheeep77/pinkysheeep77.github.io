// Gestion du scroll : repartir en haut au chargement
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Équivalent natif de :
// $(document).ready(function(){ $(this).scrollTop(0); });
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  const body = document.body;
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

  // Animation d'entrée simple pour le hero centré et le header
  gsap.from([
    ".header__logo",
    ".header__nav--left .nav-link",
    ".header__nav--right .nav-link",
    ".hero__label",
    ".hero__portrait",
  ], {
    opacity: 0,
    y: 24,
    stagger: 0.08,
    duration: 0.7,
    ease: "power2.out",
  });

  // Gestion de l'apparition / disparition du header selon le scroll
  let lastScrollY = window.scrollY;
  let headerHidden = false;

  gsap.set(header, { y: 0 });

  const handleScroll = () => {
    const currentY = window.scrollY;
    const scrolled = currentY > 40;
    header.classList.toggle("header--scrolled", scrolled);

    const delta = currentY - lastScrollY;
    const isScrollingDown = delta > 4;
    const isScrollingUp = delta < -4;

    // Masquer le header quand on descend, seulement après un léger offset
    if (isScrollingDown && currentY > 120 && !headerHidden && !burger.classList.contains("is-open")) {
      headerHidden = true;
      gsap.to(header, {
        y: -90,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    // Réafficher le header quand on remonte
    if (isScrollingUp && headerHidden) {
      headerHidden = false;
      gsap.to(header, {
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    lastScrollY = currentY;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // Mobile menu
  const toggleMenu = () => {
    const isOpen = burger.classList.toggle("is-open");
    body.classList.toggle("no-scroll", isOpen);

    // Si le menu est ouvert, on force le header visible
    if (isOpen) {
      headerHidden = false;
      gsap.to(header, { y: 0, duration: 0.25, ease: "power2.out" });
    }

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

  // Effet parallax un peu plus marqué sur l'image du hero
  gsap.to(".hero__img", {
    scale: 1.1,
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Parallax combiné scroll + souris pour les anneaux de fond
  const rings = gsap.utils.toArray(".bg-ring");

  // Mouvement au scroll : les lignes se rapprochent et se croisent vers le centre
  const ringsScrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom+=600 top",
      scrub: true,
    },
  });

  ringsScrollTl
    .to(".bg-ring--1", { yPercent: -22, xPercent: 14, rotation: -12 }, 0)
    .to(".bg-ring--2", { yPercent: -10, xPercent: -12, rotation: 10 }, 0)
    .to(".bg-ring--3", { yPercent: 26, xPercent: 10, rotation: -8 }, 0)
    .to(".bg-ring--4", { yPercent: 18, xPercent: -8, rotation: 8 }, 0)
    .to(".bg-ring--5", { yPercent: -18, xPercent: 6, rotation: -6 }, 0)
    .to(".bg-ring--6", { yPercent: 20, xPercent: -4, rotation: 6 }, 0);

  // Léger parallax à la souris
  const mouseTweens = rings.map((ring, index) => ({
    x: gsap.quickTo(ring, "x", { duration: 0.7, ease: "power3.out" }),
    y: gsap.quickTo(ring, "y", { duration: 0.7, ease: "power3.out" }),
    strength: 10 + index * 4,
  }));

  window.addEventListener("mousemove", (event) => {
    const { innerWidth, innerHeight } = window;
    const relX = (event.clientX / innerWidth - 0.5) * 2; // -1 à 1
    const relY = (event.clientY / innerHeight - 0.5) * 2;

    mouseTweens.forEach((tw, index) => {
      const factor = tw.strength;
      tw.x(relX * factor);
      tw.y(relY * factor);
    });
  });

  // Prevent default submit (placeholder)
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Formulaire de démonstration. À connecter à ton back‑end / e‑mail.");
    });
  }

  // Carrousel automatique avec fade
  const carouselImages = document.querySelectorAll(".carousel-img");
  if (carouselImages.length > 1) {
    let currentIndex = 0;
    
    const showNextImage = () => {
      carouselImages[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % carouselImages.length;
      carouselImages[currentIndex].classList.add("active");
    };
    
    // Change d'image toutes les 4 secondes
    setInterval(showNextImage, 4000);
  }
});
