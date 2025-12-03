/**
 * BREATHCARE CLINIC - MEN'S LP
 * Advanced JavaScript with Three.js & GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // Loading Screen
  // ============================================
  const initLoading = () => {
    const loading = document.querySelector('.loading');
    if (!loading) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loading.classList.add('is-hidden');
      }, 500);
    });
  };

  // ============================================
  // Three.js Particle Background
  // ============================================
  const initParticles = () => {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Camera position
    camera.position.z = 3;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      targetX = mouseX * 0.3;
      targetY = mouseY * 0.3;

      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  // ============================================
  // Custom Cursor
  // ============================================
  const initCursor = () => {
    if (window.innerWidth < 1024) return;

    const cursorDot = document.querySelector('.cursor__dot');
    const cursorRing = document.querySelector('.cursor__ring');
    if (!cursorDot || !cursorRing) return;

    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    const animateCursor = () => {
      // Dot follows immediately
      dotX += (cursorX - dotX) * 0.3;
      dotY += (cursorY - dotY) * 0.3;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      // Ring follows with delay
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    const cursor = document.querySelector('.cursor');

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursor?.classList.remove('cursor--hover'));
    });
  };

  // ============================================
  // Header Scroll Behavior
  // ============================================
  const initHeader = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > scrollThreshold) {
        header.classList.add('is-visible');
      } else {
        header.classList.remove('is-visible');
      }

      lastScroll = currentScroll;
    });
  };

  // ============================================
  // Scroll Animations
  // ============================================
  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  };

  // ============================================
  // Data Visualization Animation
  // ============================================
  const initDataBars = () => {
    const bars = document.querySelectorAll('.data__bar');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const height = bar.getAttribute('data-height');
          bar.style.height = height;
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => {
      bar.style.height = '0';
      observer.observe(bar);
    });
  };

  // ============================================
  // FAQ Accordion
  // ============================================
  const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq__item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('is-active');

        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('is-active');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('is-active');
        }
      });
    });
  };

  // ============================================
  // Smooth Scroll
  // ============================================
  const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ============================================
  // Stats Counter Animation
  // ============================================
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-counter'));
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current).toLocaleString();
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };

          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  // ============================================
  // Parallax Effect
  // ============================================
  const initParallax = () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  };

  // ============================================
  // Text Scramble Effect
  // ============================================
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span class="text-gradient">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  // ============================================
  // Initialize All
  // ============================================
  initLoading();
  initParticles();
  initCursor();
  initHeader();
  initScrollAnimations();
  initDataBars();
  initFAQ();
  initSmoothScroll();
  initCounters();
  initParallax();

});
