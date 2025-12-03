/**
 * BREATHCARE CLINIC - MEN'S LP v2.0
 * CUTTING-EDGE TECH SHOWCASE
 * 
 * Dependencies:
 * - GSAP + ScrollTrigger
 * - Lenis (Smooth Scroll)
 * - Splitting.js
 * - Three.js
 */

// ============================================
// Initialize when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // Preloader
  // ============================================
  class Preloader {
    constructor() {
      this.preloader = document.querySelector('.preloader');
      this.logo = document.querySelector('.preloader__logo');
      this.progress = document.querySelector('.preloader__progress');
      this.percent = document.querySelector('.preloader__percent');
      this.text = document.querySelector('.preloader__text');
      this.currentProgress = 0;
      this.targetProgress = 0;
    }

    init() {
      if (!this.preloader) return Promise.resolve();

      return new Promise((resolve) => {
        // Animate logo in
        gsap.to(this.logo, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        });

        // Simulate loading
        const interval = setInterval(() => {
          this.targetProgress += Math.random() * 15;
          if (this.targetProgress >= 100) {
            this.targetProgress = 100;
            clearInterval(interval);
          }
        }, 150);

        // Animate progress
        const updateProgress = () => {
          this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
          
          if (this.progress) {
            this.progress.style.width = `${this.currentProgress}%`;
          }
          if (this.percent) {
            this.percent.textContent = `${Math.floor(this.currentProgress)}%`;
          }

          if (this.currentProgress < 99.5) {
            requestAnimationFrame(updateProgress);
          } else {
            this.complete(resolve);
          }
        };

        updateProgress();
      });
    }

    complete(resolve) {
      gsap.timeline()
        .to(this.preloader, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          delay: 0.3
        })
        .add(() => {
          this.preloader.style.display = 'none';
          resolve();
        });
    }
  }

  // ============================================
  // Lenis Smooth Scroll
  // ============================================
  class SmoothScroll {
    constructor() {
      this.lenis = null;
    }

    init() {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      });

      // Connect to GSAP ScrollTrigger
      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Anchor links
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            this.lenis.scrollTo(target, { offset: -80 });
          }
        });
      });
    }
  }

  // ============================================
  // Custom Cursor - DISABLED
  // ============================================
  class Cursor {
    init() {
      // Disabled - using default cursor
      return;
    }
  }

  // ============================================
  // WebGL Background
  // ============================================
  class WebGLBackground {
    constructor() {
      this.canvas = document.getElementById('webgl-canvas');
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.particles = null;
      this.mouse = { x: 0, y: 0 };
      this.time = 0;
    }

    init() {
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.setupScene();
      this.createParticles();
      this.addEventListeners();
      this.animate();
    }

    setupScene() {
      this.scene = new THREE.Scene();
      
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createParticles() {
      const particlesCount = 2000;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 1] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;

        // Color (cyan to magenta)
        const mixRatio = Math.random();
        colors[i3] = mixRatio * 0 + (1 - mixRatio) * 1; // R
        colors[i3 + 1] = mixRatio * 1 + (1 - mixRatio) * 0; // G
        colors[i3 + 2] = mixRatio * 1 + (1 - mixRatio) * 1; // B
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    }

    addEventListeners() {
      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      document.addEventListener('mousemove', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      this.time += 0.001;

      if (this.particles) {
        this.particles.rotation.x = this.time * 0.2;
        this.particles.rotation.y = this.time * 0.1;
        
        // Mouse influence
        this.particles.rotation.x += this.mouse.y * 0.05;
        this.particles.rotation.y += this.mouse.x * 0.05;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  // ============================================
  // Scroll Progress Bar
  // ============================================
  class ScrollProgress {
    constructor() {
      this.progressBar = document.querySelector('.scroll-progress');
    }

    init() {
      if (!this.progressBar) return;

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
      });
    }
  }

  // ============================================
  // Text Animations (Splitting.js style)
  // ============================================
  class TextAnimations {
    constructor() {
      this.heroTitle = document.querySelector('.hero__title');
    }

    init() {
      this.splitText();
      this.animateHeroTitle();
      this.animateSectionTitles();
    }

    splitText() {
      // Split hero title into chars
      if (this.heroTitle) {
        const lines = this.heroTitle.querySelectorAll('.hero__title-line');
        lines.forEach(line => {
          const text = line.textContent;
          line.innerHTML = '';
          
          text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            
            // Wrap gradient text
            if (line.classList.contains('hero__title-gradient')) {
              span.style.background = 'var(--color-accent-gradient)';
              span.style.webkitBackgroundClip = 'text';
              span.style.webkitTextFillColor = 'transparent';
              span.style.backgroundClip = 'text';
            }
            
            line.appendChild(span);
          });
        });
      }
    }

    animateHeroTitle() {
      const chars = document.querySelectorAll('.hero__title .char');
      
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    animateSectionTitles() {
      const titles = document.querySelectorAll('.section__title');
      
      titles.forEach(title => {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });
    }
  }

  // ============================================
  // Horizontal Scroll Section
  // ============================================
  class HorizontalScroll {
    constructor() {
      this.section = document.querySelector('.problems');
      this.wrapper = document.querySelector('.problems__wrapper');
    }

    init() {
      if (!this.section || !this.wrapper || window.innerWidth < 768) return;

      const cards = this.wrapper.querySelectorAll('.problem-card');
      const totalWidth = Array.from(cards).reduce((acc, card) => {
        return acc + card.offsetWidth + 24; // 24px gap
      }, 0);

      gsap.to(this.wrapper, {
        x: () => -(totalWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: {
          trigger: this.section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }
  }

  // ============================================
  // Process Timeline Animation
  // ============================================
  class ProcessTimeline {
    constructor() {
      this.items = document.querySelectorAll('.process__item');
      this.lineProgress = document.querySelector('.process__line-progress');
    }

    init() {
      if (this.items.length === 0) return;

      // Animate line progress
      if (this.lineProgress) {
        gsap.to(this.lineProgress, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.process__timeline',
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        });
      }

      // Animate items
      this.items.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
            onEnter: () => item.classList.add('is-active'),
            onLeaveBack: () => item.classList.remove('is-active')
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      });
    }
  }

  // ============================================
  // Data Bars Animation (Intersection Observer - No GSAP dependency)
  // ============================================
  class DataBars {
    constructor() {
      this.bars = document.querySelectorAll('.data__bar');
      this.chart = document.querySelector('.data__chart');
      this.animated = false;
    }

    init() {
      if (!this.chart || this.bars.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated) {
            this.animated = true;
            this.animateBars();
          }
        });
      }, { 
        threshold: 0.3,
        rootMargin: '0px'
      });

      observer.observe(this.chart);
    }

    animateBars() {
      this.bars.forEach((bar, index) => {
        const height = bar.dataset.height;
        setTimeout(() => {
          bar.style.height = height;
        }, index * 150);
      });
    }
  }

  // ============================================
  // 3D Tilt Cards
  // ============================================
  class TiltCards {
    constructor() {
      this.cards = document.querySelectorAll('.feature-card');
    }

    init() {
      if (window.innerWidth < 1024) return;

      this.cards.forEach(card => {
        card.addEventListener('mousemove', (e) => this.handleMove(e, card));
        card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
      });
    }

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update glow position
      const glow = card.querySelector('.feature-card__glow');
      if (glow) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
      }
    }

    handleLeave(e, card) {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  }

  // ============================================
  // Magnetic Buttons
  // ============================================
  class MagneticButtons {
    constructor() {
      this.buttons = document.querySelectorAll('.magnetic-btn');
    }

    init() {
      if (window.innerWidth < 1024) return;

      this.buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
        btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
      });
    }

    handleMove(e, btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    handleLeave(e, btn) {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  }

  // ============================================
  // FAQ Accordion
  // ============================================
  class FAQAccordion {
    constructor() {
      this.items = document.querySelectorAll('.faq__item');
    }

    init() {
      this.items.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question?.addEventListener('click', () => {
          const isActive = item.classList.contains('is-active');
          
          // Close all
          this.items.forEach(i => i.classList.remove('is-active'));
          
          // Toggle current
          if (!isActive) {
            item.classList.add('is-active');
          }
        });
      });
    }
  }

  // ============================================
  // Scroll-triggered Animations
  // ============================================
  class ScrollAnimations {
    init() {
      // Fade up elements
      gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Scale elements
      gsap.utils.toArray('[data-animate="scale"]').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Stagger children
      gsap.utils.toArray('[data-animate-children]').forEach(parent => {
        const children = parent.children;
        
        gsap.from(children, {
          scrollTrigger: {
            trigger: parent,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      });
    }
  }

  // ============================================
  // Counter Animation
  // ============================================
  class CounterAnimation {
    constructor() {
      this.counters = document.querySelectorAll('[data-counter]');
    }

    init() {
      this.counters.forEach(counter => {
        const target = parseInt(counter.dataset.counter);
        
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              textContent: target,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                counter.textContent = Math.floor(this.targets()[0].textContent).toLocaleString();
              }
            });
          }
        });
      });
    }
  }

  // ============================================
  // Initialize Everything
  // ============================================
  async function init() {
    // Preloader first
    const preloader = new Preloader();
    await preloader.init();

    // Core
    const smoothScroll = new SmoothScroll();
    smoothScroll.init();

    const cursor = new Cursor();
    cursor.init();

    const webgl = new WebGLBackground();
    webgl.init();

    const scrollProgress = new ScrollProgress();
    scrollProgress.init();

    // Animations
    const textAnimations = new TextAnimations();
    textAnimations.init();

    const horizontalScroll = new HorizontalScroll();
    horizontalScroll.init();

    const processTimeline = new ProcessTimeline();
    processTimeline.init();

    const dataBars = new DataBars();
    dataBars.init();

    const tiltCards = new TiltCards();
    tiltCards.init();

    const magneticButtons = new MagneticButtons();
    magneticButtons.init();

    const faqAccordion = new FAQAccordion();
    faqAccordion.init();

    const scrollAnimations = new ScrollAnimations();
    scrollAnimations.init();

    const counterAnimation = new CounterAnimation();
    counterAnimation.init();
  }

  init();
});
