(function () {
  'use strict';

  const SELECTORS = {
    header: '.header',
    navToggle: '.nav-toggle',
    mobileNav: '.mobile-nav',
    mobileNavLinks: '.mobile-nav__link',
    fadeElements: '.fade-in, .fade-in--left, .fade-in--right',
    testimonialTrack: '.testimonials__track',
    testimonialDots: '.testimonials__dot',
    accordionItems: '.accordion__item',
    accordionHeaders: '.accordion__header',
    navLinks: '.nav__link',
    forms: '[data-validate]',
  };

  const CLASSES = {
    headerSolid: 'header--solid',
    headerTransparent: 'header--transparent',
    navToggleActive: 'nav-toggle--active',
    mobileNavOpen: 'mobile-nav--open',
    fadeVisible: 'fade-in--visible',
    accordionOpen: 'accordion__item--open',
    dotActive: 'testimonials__dot--active',
    navActive: 'nav__link--active',
    formError: 'form-group--error',
  };

  function initHeaderScroll() {
    const header = document.querySelector(SELECTORS.header);
    if (!header) return;

    const SCROLL_THRESHOLD = 60;

    function updateHeader() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.remove(CLASSES.headerTransparent);
        header.classList.add(CLASSES.headerSolid);
      } else {
        header.classList.remove(CLASSES.headerSolid);
        header.classList.add(CLASSES.headerTransparent);
      }
    }

    updateHeader();

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector(SELECTORS.navToggle);
    const mobileNav = document.querySelector(SELECTORS.mobileNav);
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.contains(CLASSES.navToggleActive);

      toggle.classList.toggle(CLASSES.navToggleActive);
      mobileNav.classList.toggle(CLASSES.mobileNavOpen);

      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    const mobileLinks = mobileNav.querySelectorAll(SELECTORS.mobileNavLinks);
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove(CLASSES.navToggleActive);
        mobileNav.classList.remove(CLASSES.mobileNavOpen);
        document.body.style.overflow = '';
      });
    });
  }

  function initScrollAnimations() {
    var elements = document.querySelectorAll(SELECTORS.fadeElements);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add(CLASSES.fadeVisible);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add(CLASSES.fadeVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initActiveNavHighlight() {
    var navLinks = document.querySelectorAll(SELECTORS.navLinks);
    if (!navLinks.length) return;

    var currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkPath = href.split('/').pop();

      if (
        linkPath === currentPath ||
        (currentPath === '' && linkPath === 'index.html') ||
        (currentPath === 'index.html' && linkPath === 'index.html')
      ) {
        link.classList.add(CLASSES.navActive);
      }
    });
  }

  function initTestimonialCarousel() {
    var track = document.querySelector(SELECTORS.testimonialTrack);
    var dots = document.querySelectorAll(SELECTORS.testimonialDots);
    if (!track || !dots.length) return;

    var currentSlide = 0;
    var totalSlides = track.children.length;
    var autoplayInterval = null;
    var AUTOPLAY_DELAY = 5000;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentSlide = index;
      track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle(CLASSES.dotActive, i === currentSlide);
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        goToSlide(index);
        startAutoplay();
      });
    });

    var carouselContainer = track.closest('.testimonials');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoplay);
      carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    goToSlide(0);
    startAutoplay();
  }

  function initAccordion() {
    var headers = document.querySelectorAll(SELECTORS.accordionHeaders);
    if (!headers.length) return;

    headers.forEach(function (header) {
      header.addEventListener('click', function () {
        var item = this.closest('.accordion__item');
        if (!item) return;

        var isOpen = item.classList.contains(CLASSES.accordionOpen);

        var allItems = document.querySelectorAll(SELECTORS.accordionItems);
        allItems.forEach(function (i) {
          i.classList.remove(CLASSES.accordionOpen);
        });

        if (!isOpen) {
          item.classList.add(CLASSES.accordionOpen);
        }
      });
    });
  }

  function initFormValidation() {
    var forms = document.querySelectorAll(SELECTORS.forms);
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var isValid = true;
        var requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(function (field) {
          var group = field.closest('.form-group');
          if (!group) return;

          group.classList.remove(CLASSES.formError);

          if (!field.value.trim()) {
            group.classList.add(CLASSES.formError);
            isValid = false;
            return;
          }

          if (field.type === 'email' && field.value.trim()) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
              group.classList.add(CLASSES.formError);
              isValid = false;
            }
          }

          if (field.type === 'tel' && field.value.trim()) {
            var phonePattern = /^[+]?[\d\s()-]{7,15}$/;
            if (!phonePattern.test(field.value.trim())) {
              group.classList.add(CLASSES.formError);
              isValid = false;
            }
          }
        });

        if (!isValid) {
          e.preventDefault();
          var firstError = form.querySelector('.' + CLASSES.formError);
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });

      var fields = form.querySelectorAll('[required]');
      fields.forEach(function (field) {
        field.addEventListener('input', function () {
          var group = this.closest('.form-group');
          if (group) {
            group.classList.remove(CLASSES.formError);
          }
        });
      });
    });
  }

  function init() {
    initHeaderScroll();
    initMobileNav();
    initScrollAnimations();
    initSmoothScrolling();
    initActiveNavHighlight();
    initTestimonialCarousel();
    initAccordion();
    initFormValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
