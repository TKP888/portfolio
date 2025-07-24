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

// Logo click functionality - scroll to top
function initLogoClick() {
  const logo = document.querySelector(".site-title");
  console.log("Logo element found:", logo); // Debug log

  if (logo) {
    logo.addEventListener("click", () => {
      console.log("Logo clicked!"); // Debug log
      // Reload the page
      window.location.reload();
    });
    console.log("Logo click event listener added"); // Debug log
  } else {
    console.log("Logo element not found"); // Debug log
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

  // Define sections with their selectors
  const sections = [
    { id: "about", selector: ".intro" },
    { id: "projects", selector: ".projects" },
    { id: "timeline", selector: "#timeline" },
    { id: "contact", selector: "#contact" },
  ];

  // Function to update active marker based on scroll position
  function updateActiveMarker() {
    const scrollPosition = window.scrollY + window.innerHeight / 3; // Use 1/3 down the viewport
    let activeSectionIndex = -1;

    // Clear all active markers first
    scrollMarkers.forEach((marker) => marker.classList.remove("active"));

    // Check each section
    sections.forEach((section, index) => {
      let element;

      if (section.id === "about") {
        // For about section, get the first intro section
        element = document.querySelector(".intro");
      } else if (section.id === "projects") {
        // For projects section, get the projects div
        element = document.querySelector(".projects");
      } else {
        // For other sections, get by ID
        element = document.getElementById(section.id);
      }

      if (element) {
        // Use offsetTop for more reliable positioning
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        // Debug logging
        console.log(
          `Section ${section.id}: top=${elementTop}, bottom=${elementBottom}, scroll=${scrollPosition}`
        );

        // Check if scroll position is within this section
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          activeSectionIndex = index;
          console.log(`✅ Active section: ${section.id}`);
        }
      }
    });

    // If we're at the very top of the page, activate the first section
    if (activeSectionIndex === -1 && window.scrollY < 200) {
      activeSectionIndex = 0;
      console.log("At top of page, activating first section");
    }

    // Activate the correct marker
    if (activeSectionIndex >= 0) {
      scrollMarkers[activeSectionIndex].classList.add("active");
      console.log(`🎯 Active marker: ${sections[activeSectionIndex].id}`);
    } else {
      console.log("❌ No active section found");
    }
  }

  // Add click event listeners to markers
  scrollMarkers.forEach((marker, index) => {
    marker.addEventListener("click", () => {
      const section = sections[index];
      let targetElement;

      if (section.id === "about") {
        // Scroll to first intro section
        targetElement = document.querySelector(".intro");
      } else if (section.id === "projects") {
        // Scroll to projects div
        targetElement = document.querySelector(".projects");
      } else {
        // For other sections, get by ID
        targetElement = document.getElementById(section.id);
      }

      if (targetElement) {
        targetElement.scrollIntoView({
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

  // Also update on window resize to handle any layout changes
  window.addEventListener("resize", throttle(updateActiveMarker, 100));

  // Initial update after a short delay to ensure DOM is ready
  setTimeout(updateActiveMarker, 100);

  // Force an update after a longer delay to ensure everything is loaded
  setTimeout(updateActiveMarker, 500);
}

// Initialize scroll animations when the page loads
document.addEventListener("DOMContentLoaded", () => {
  preventInitialScroll(); // Prevent initial scroll snap behavior
  initScrollAnimations();
  addSmoothScrolling(); // Initialize smooth scrolling
  initScrollMarkers(); // Initialize scroll markers
  initLogoClick(); // Initialize logo click functionality
});
