(() => {
  "use strict";

  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      navLinks.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // -----------------------------
  // Scroll reveal
  // -----------------------------
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // -----------------------------
  // Random activity mini-game
  // -----------------------------
  const activities = [
    "Find 5 things around your home that are BLUE.",
    "Find 3 circles around your home.",
    "Name 5 animals you can think of.",
    "Count 10 objects near you.",
    "Find something that begins with the letter B.",
    "Create a story using three objects you can see.",
    "Find something soft, something hard and something smooth.",
    "Make a pattern using your favourite toys.",
    "Name three things that make you happy.",
    "Find five RED objects around your home.",
    "Make up a funny ending to a story you know."
  ];

  const activityText = document.getElementById("activity-text");
  const activityCount = document.getElementById("activity-count");
  const newChallenge = document.getElementById("new-challenge");
  let currentActivity = 0;

  if (newChallenge && activityText && activityCount) {
    newChallenge.addEventListener("click", () => {
      let next = Math.floor(Math.random() * activities.length);
      if (activities.length > 1 && next === currentActivity) {
        next = (next + 1) % activities.length;
      }
      currentActivity = next;
      activityText.textContent = activities[next];
      activityCount.textContent = `Challenge ${next + 1}`;

      activityText.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 280, easing: "ease-out" }
      );
    });
  }

  // -----------------------------
  // Waitlist frontend validation
  // -----------------------------
  const form = document.getElementById("waitlist-form");
  const formContent = document.getElementById("form-content");
  const successState = document.getElementById("success-state");
  const resetForm = document.getElementById("reset-form");

  /*
   * FORM INTEGRATION PLACEHOLDER
   * --------------------------------
   * Version 1 intentionally uses frontend-only validation.
   *
   * Later, connect the validated form data to Google Forms, Formspree,
   * or another form service here. Do not add a fake backend.
   *
   * Example future flow:
   * const payload = new FormData(form);
   * await fetch(YOUR_FORM_ENDPOINT, { method: "POST", body: payload });
   */

  const fields = {
    parentName: {
      input: document.getElementById("parent-name"),
      error: document.getElementById("parent-name-error"),
      message: "Please enter your name."
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      message: "Please enter a valid email."
    },
    childAge: {
      input: document.getElementById("child-age"),
      error: document.getElementById("child-age-error"),
      message: "Please select your child's age."
    },
    city: {
      input: document.getElementById("city"),
      error: document.getElementById("city-error"),
      message: "Please enter your city."
    }
  };

  function clearErrors() {
    Object.values(fields).forEach(field => {
      field.input.classList.remove("input-error");
      field.error.textContent = "";
    });
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    if (!fields.parentName.input.value.trim()) {
      fields.parentName.input.classList.add("input-error");
      fields.parentName.error.textContent = fields.parentName.message;
      valid = false;
    }

    const emailValue = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      fields.email.input.classList.add("input-error");
      fields.email.error.textContent = fields.email.message;
      valid = false;
    }

    if (!fields.childAge.input.value) {
      fields.childAge.input.classList.add("input-error");
      fields.childAge.error.textContent = fields.childAge.message;
      valid = false;
    }

    if (!fields.city.input.value.trim()) {
      fields.city.input.classList.add("input-error");
      fields.city.error.textContent = fields.city.message;
      valid = false;
    }

    return valid;
  }

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!validateForm()) {
        const firstInvalid = form.querySelector(".input-error");
        firstInvalid?.focus();
        return;
      }

      // Frontend-only success state for version 1.
      formContent.hidden = true;
      successState.hidden = false;
    });
  }

  if (resetForm) {
    resetForm.addEventListener("click", () => {
      form.reset();
      clearErrors();
      successState.hidden = true;
      formContent.hidden = false;
      document.getElementById("parent-name")?.focus();
    });
  }

  // Clear individual validation errors when a user edits a field.
  Object.values(fields).forEach(field => {
    field.input?.addEventListener("input", () => {
      field.input.classList.remove("input-error");
      field.error.textContent = "";
    });
    field.input?.addEventListener("change", () => {
      field.input.classList.remove("input-error");
      field.error.textContent = "";
    });
  });

  // -----------------------------
  // Keep only one FAQ open at a time
  // -----------------------------
  const faqItems = document.querySelectorAll(".accordion details");
  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  // -----------------------------
  // Gentle parallax for hero decorations
  // Disabled when reduced motion is preferred.
  // -----------------------------
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && window.innerWidth > 800) {
    const hero = document.querySelector(".hero");
    const floaters = document.querySelectorAll(".float-item");

    hero?.addEventListener("mousemove", event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      floaters.forEach((item, index) => {
        const strength = (index + 1) * 3;
        item.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    });

    hero?.addEventListener("mouseleave", () => {
      floaters.forEach(item => item.style.transform = "");
    });
  }
})();
