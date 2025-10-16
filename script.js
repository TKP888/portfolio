// Navigation menu functionality
const toggleButton = document.querySelector(".menu-toggle");
const closeButton = document.querySelector(".close-menu");
const overlayNav = document.querySelector(".overlay-nav");
const navLinks = document.querySelectorAll(".overlay-links a");

// Prevent initial scroll snap behavior on page load
function preventInitialScroll() {
  // Temporarily disable scroll snap
  const wrapper = document.querySelector(".page.wrapper");
  if (wrapper) {
    wrapper.style.scrollSnapType = "none";

    // Force scroll to top
    window.scrollTo(0, 0);

    // Re-enable scroll snap after a short delay
    setTimeout(() => {
      wrapper.style.scrollSnapType = "y mandatory";
    }, 100);
  }
}

toggleButton.addEventListener("click", () => {
  overlayNav.classList.add("active");
});

closeButton.addEventListener("click", () => {
  overlayNav.classList.remove("active");
});

// Close menu when a nav link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    overlayNav.classList.remove("active");
  });
});

// Smooth scrolling for all navigation links (desktop and mobile)
function addSmoothScrolling() {
  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Contact form functionality
const showFormButton = document.getElementById("show-form");
const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");

// Check if device is mobile
function isMobile() {
  return window.innerWidth <= 1023;
}

function showForm() {
  // For mobile, just scroll to contact section since form is always visible
  if (isMobile()) {
    const contactSection = document.querySelector(".contact");
    contactSection.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Desktop behavior - animate title and show form
  const contactTitle = document.getElementById("contacttitle");
  contactTitle.classList.add("animate-up");

  // Hide the button with animation
  showFormButton.classList.add("hidden");

  // Scroll to contact section smoothly
  const contactSection = document.querySelector(".contact");
  contactSection.scrollIntoView({ behavior: "smooth", block: "center" });

  // After title animation and scroll, show the form
  setTimeout(() => {
    contactForm.style.display = "flex";
    // Force a reflow to ensure the transition works
    contactForm.offsetHeight;
    contactForm.classList.add("visible");
  }, 800); // Increased to match the new transition duration
}

function hideForm() {
  // For mobile, don't hide the form since it should always be visible
  if (isMobile()) {
    return;
  }

  // Desktop behavior - hide the form with animation
  contactForm.classList.remove("visible");

  // After form animation completes, restore the title and show the button
  setTimeout(() => {
    const contactTitle = document.getElementById("contacttitle");
    contactTitle.classList.remove("animate-up");
    showFormButton.classList.remove("hidden");
    // Clear the form status message
    formStatus.textContent = "";
    formStatus.style.color = "";
  }, 800); // Increased to match the new transition duration
}

showFormButton.addEventListener("click", showForm);

// Add escape key handler to close form
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && contactForm.classList.contains("visible")) {
    hideForm();
  }
});

// Optional: Add click outside to close
document.addEventListener("click", (e) => {
  if (
    contactForm.classList.contains("visible") &&
    !contactForm.contains(e.target) &&
    e.target !== showFormButton
  ) {
    hideForm();
  }
});

// Form submission handling
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitButton = document.getElementById("sendmessage");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      formStatus.textContent =
        "Message sent successfully! I'll get back to you soon.";
      formStatus.style.color = "#4CAF50";
      contactForm.reset();

      // Clear status message after 3 seconds on mobile, or hide form after 2 seconds on desktop
      if (isMobile()) {
        setTimeout(() => {
          formStatus.textContent = "";
          formStatus.style.color = "";
        }, 3000);
      } else {
        setTimeout(hideForm, 2000);
      }
    } else {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    formStatus.textContent =
      "Sorry, there was a problem sending your message. Please try again.";
    formStatus.style.color = "#f44336";

    // Clear error message after 3 seconds on mobile
    if (isMobile()) {
      setTimeout(() => {
        formStatus.textContent = "";
        formStatus.style.color = "";
      }, 3000);
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});

// Enhanced scroll animation for intro paragraphs
function initScrollAnimations() {
  // Check if device is mobile
  const isMobile = window.innerWidth <= 768;

  const observerOptions = {
    threshold: isMobile
      ? [0, 0.5, 1]
      : [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    rootMargin: isMobile ? "0px 0px -20% 0px" : "0px 0px -10% 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const isIntersecting = entry.isIntersecting;
      const intersectionRatio = entry.intersectionRatio;

      // Add smooth animation based on intersection ratio
      if (isIntersecting) {
        // Element is entering viewport
        element.style.opacity = Math.min(intersectionRatio * 2, 1);
        element.style.transform = `translateY(${
          30 - intersectionRatio * 30
        }px)`;
        element.classList.add("animate-in");
      } else {
        // Element is leaving viewport
        element.style.opacity = 0;
        element.style.transform = "translateY(30px)";
        element.classList.remove("animate-in");
      }
    });
  }, observerOptions);

  // Observe all paragraphs in the intro section
  const introParagraphs = document.querySelectorAll(".intro p");
  introParagraphs.forEach((paragraph) => {
    observer.observe(paragraph);
  });
}

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".carousel-image");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Show current slide
  if (slides[index]) {
    slides[index].classList.add("active");
  }
  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
}

function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  showSlide(currentSlideIndex);
}

// Auto-advance carousel every 3 seconds
function startCarousel() {
  setInterval(() => {
    nextSlide();
  }, 3000);
}

// Active navigation highlighting based on scroll position
function initActiveNavigation() {
  // Only select sections that have corresponding nav links
  const sections = document.querySelectorAll(
    "#about, #projects, #timeline, #contact"
  );
  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .overlay-links a[href^="#"]'
  );

  // Function to set active nav link
  function setActiveLink(sectionId) {
    // Remove active class from all nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to corresponding nav link
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });
  }

  // Set initial active section on page load
  function setInitialActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    let currentSection = null;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section;
      }
    });

    if (currentSection) {
      setActiveLink(currentSection.getAttribute("id"));
    }
  }

  const observerOptions = {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better detection
    rootMargin: "-100px 0px -40% 0px", // Account for fixed header
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Only trigger when section is significantly visible
      if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
        const sectionId = entry.target.getAttribute("id");
        setActiveLink(sectionId);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Set initial active section
  setInitialActiveSection();
}

// Initialize scroll animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
  preventInitialScroll(); // Prevent initial scroll snap behavior
  initScrollAnimations();
  addSmoothScrolling(); // Initialize smooth scrolling

  // Initialize contact form for mobile
  if (isMobile()) {
    contactForm.style.display = "flex";
    contactForm.classList.add("visible");
  }

  startCarousel(); // Start carousel auto-advance
  initActiveNavigation(); // Initialize active nav highlighting

  // Handle window resize to adjust form visibility
  window.addEventListener("resize", () => {
    if (isMobile()) {
      contactForm.style.display = "flex";
      contactForm.classList.add("visible");
    } else {
      // Reset to desktop behavior
      contactForm.style.display = "";
      contactForm.classList.remove("visible");
      const contactTitle = document.getElementById("contacttitle");
      contactTitle.classList.remove("animate-up");
      showFormButton.classList.remove("hidden");
    }
  });
});
