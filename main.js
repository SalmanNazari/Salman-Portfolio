// dd.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initThreeJSBackground();
  initSmoothScrolling();
  initThemeToggle();
  initScrollAnimations();
  initNavigationHighlight();
  initSkillBars();
  initTypewriter();
  initFormValidation();
  initCurrentYear();
});

// Three.js Background Implementation
function initThreeJSBackground() {
  // Check if Three.js is loaded
  if (typeof THREE === "undefined") {
    console.error("Three.js is not loaded");
    return;
  }

  // Set up Three.js scene
  const container = document.getElementById("threejs-background");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background

  // Find the canvas element and position it correctly
  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";

  // Insert the canvas at the beginning of the container
  container.insertBefore(canvas, container.firstChild);

  // Create particles for background
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;

  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);

  // Root CSS variables for colors
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryColor = rootStyles.getPropertyValue("--primary").trim();
  const accentColor = rootStyles.getPropertyValue("--accent").trim();

  // Convert CSS colors to Three.js colors
  const primaryThree = new THREE.Color(primaryColor);
  const accentThree = new THREE.Color(accentColor);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position particles in a 3D space
    posArray[i] = (Math.random() - 0.5) * 10;
    posArray[i + 1] = (Math.random() - 0.5) * 10;
    posArray[i + 2] = (Math.random() - 0.5) * 10;

    // Assign colors with gradient between primary and accent
    const t = Math.random();
    const color = new THREE.Color().lerpColors(primaryThree, accentThree, t);

    colorArray[i] = color.r;
    colorArray[i + 1] = color.g;
    colorArray[i + 2] = color.b;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3)
  );

  // Create particle material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  // Create the particle system
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Add some larger "star" particles
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 100;

  const starsPosArray = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    starsPosArray[i] = (Math.random() - 0.5) * 15;
    starsPosArray[i + 1] = (Math.random() - 0.5) * 15;
    starsPosArray[i + 2] = (Math.random() - 0.5) * 15;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starsPosArray, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starsMesh);

  // Position camera
  camera.position.z = 5;

  // Mouse movement for interactive background
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.001;

    // Move camera slightly based on mouse position
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

  // Start animation
  animate();
}

// Smooth Scrolling Implementation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll(
    ".nav-links a, .footer-links a, .hero-cta a"
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId.startsWith("#")) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      // Calculate position to scroll to (adjusting for fixed header)
      const headerOffset = 100;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without scrolling
      history.pushState(null, null, targetId);
    });
  });
}

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (savedTheme === "light" || (!savedTheme && !systemPrefersDark)) {
    document.body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove("light-theme");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".glass-card, .section-header, .skill-bar, .project-card"
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Navigation Highlight Based on Scroll Position
function initNavigationHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  function highlightNavLink() {
    let currentSection = "";
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNavLink);
}

// Animate Skill Bars on Scroll
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar");

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressFill = entry.target.querySelector(".progress-fill");
        const percent = progressFill.style.getPropertyValue("--percent");

        // Reset and animate
        progressFill.style.width = "0";
        setTimeout(() => {
          progressFill.style.width = percent;
        }, 100);

        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  skillBars.forEach((bar) => {
    observer.observe(bar);
  });
}

// Typewriter Effect for Hero Section
function initTypewriter() {
  const typewriterElement = document.querySelector(".typewriter h2");
  if (!typewriterElement) return;

  const text = typewriterElement.textContent;
  typewriterElement.textContent = "";
  typewriterElement.style.width = "0";
  typewriterElement.style.borderRight = "0.15em solid var(--primary)";

  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typewriterElement.textContent += text.charAt(i);
      typewriterElement.style.width = `${typewriterElement.textContent.length}ch`;
      i++;
      setTimeout(typeWriter, 45);
    } else {
      // Keep cursor blinking after typing is complete
      setInterval(() => {
        typewriterElement.style.borderRightColor =
          typewriterElement.style.borderRightColor === "transparent"
            ? "var(--primary)"
            : "transparent";
      }, 1000);
    }
  }

  // Start typing after a short delay
  setTimeout(typeWriter, 350);
}

// Form Validation for Contact Form
function initFormValidation() {
  const contactForm = document.querySelector(".contact-form form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const inputs = this.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        isValid = false;
        input.style.borderColor = "var(--secondary)";
      } else {
        input.style.borderColor = "";
      }

      // Email validation
      if (input.type === "email" && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          isValid = false;
          input.style.borderColor = "var(--secondary)";
        }
      }
    });

    if (isValid) {
      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        alert("Message sent successfully! (This is a demo)");
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }
  });
}

// Set Current Year in Footer
function initCurrentYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
