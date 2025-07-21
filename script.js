// Navigation menu functionality
const toggleButton = document.querySelector(".menu-toggle");
const closeButton = document.querySelector(".close-menu");
const overlayNav = document.querySelector(".overlay-nav");
const navLinks = document.querySelectorAll(".overlay-links a");

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

function showForm() {
  // First animate the title
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
  // Hide the form with animation
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
      // Hide form after successful submission
      setTimeout(hideForm, 2000);
    } else {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    formStatus.textContent =
      "Sorry, there was a problem sending your message. Please try again.";
    formStatus.style.color = "#f44336";
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

// Scroll markers functionality
function initScrollMarkers() {
  const scrollMarkers = document.querySelectorAll(".scroll-marker");
  const sections = ["about", "projects", "timeline", "contact"];

  // Function to update active marker based on scroll position
  function updateActiveMarker() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    // Clear all active markers first
    scrollMarkers.forEach((marker) => marker.classList.remove("active"));

    // Get all sections and their positions
    const sectionPositions = [];

    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      if (section) {
        let sectionTop, sectionBottom;

        if (sectionId === "about") {
          // For about section, get the range of all intro sections
          const introSections = document.querySelectorAll(".intro");
          if (introSections.length > 0) {
            sectionTop = introSections[0].offsetTop;
            sectionBottom =
              introSections[introSections.length - 1].offsetTop +
              introSections[introSections.length - 1].offsetHeight;
          } else {
            sectionTop = section.offsetTop;
            sectionBottom = section.offsetTop + section.offsetHeight;
          }
        } else {
          sectionTop = section.offsetTop;
          sectionBottom = section.offsetTop + section.offsetHeight;
        }

        sectionPositions.push({
          index,
          sectionId,
          top: sectionTop,
          bottom: sectionBottom,
        });
      }
    });

    // Find which section the scroll position is in
    let activeSectionIndex = -1;

    // Check sections in order (first match wins)
    for (let i = 0; i < sectionPositions.length; i++) {
      const section = sectionPositions[i];
      if (scrollPosition >= section.top && scrollPosition < section.bottom) {
        activeSectionIndex = section.index;
        break;
      }
    }

    // If no section found and we're at the top, activate first section
    if (activeSectionIndex === -1 && window.scrollY < 200) {
      activeSectionIndex = 0;
    }

    // Activate the correct marker
    if (activeSectionIndex >= 0) {
      scrollMarkers[activeSectionIndex].classList.add("active");
      console.log(
        `Active section: ${sections[activeSectionIndex]}, Scroll position: ${scrollPosition}, Window scroll: ${window.scrollY}`
      );
    } else {
      console.log(
        `No active section found. Scroll position: ${scrollPosition}, Window scroll: ${window.scrollY}`
      );
    }
  }

  // Add click event listeners to markers
  scrollMarkers.forEach((marker, index) => {
    marker.addEventListener("click", () => {
      const sectionId = sections[index];
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Update markers on scroll with throttling
  window.addEventListener("scroll", throttle(updateActiveMarker, 50));

  // Initial update
  updateActiveMarker();
}

// Initialize scroll animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  addSmoothScrolling(); // Initialize smooth scrolling
  initScrollMarkers(); // Initialize scroll markers
});
