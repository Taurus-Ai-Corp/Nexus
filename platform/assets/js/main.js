/* ==========================================================================
   NEXUS by Taurus AI — Platform Shared JavaScript
   Handles: sticky nav, mobile toggle, active link, scroll reveals,
            code tabs, FAQ accordion, demo form, console year.
   ========================================================================== */
/* global window, document, IntersectionObserver */

const Nexus = (function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Console brand + year
  function initConsole() {
    const year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = year));
    if (!window.location.hostname.includes('localhost')) {
      // eslint-disable-next-line no-console
      console.log(
        `%c NEXUS by Taurus AI %c ${year} `,
        'background:#7c5cff;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px;',
        'background:#22d3ee;color:#05060a;font-weight:700;padding:4px 8px;border-radius:0 4px 4px 0;'
      );
    }
  }

  // Sticky nav state + active link highlight
  function initNav() {
    const nav = document.querySelector('.nav');
    const links = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a');
    const path = window.location.pathname.replace(/\/$/, '');

    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const linkPath = href.replace(/^\.?\//, '/').replace(/\/$/, '').split('#')[0];
      if (linkPath && (linkPath === path || (path === '' && linkPath === '/index.html'))) {
        a.classList.add('active');
      }
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          nav?.classList.toggle('scrolled', window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    });

    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-links');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
        menu.classList.toggle('hidden');
      });
      menu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => {
          toggle.classList.remove('open');
          menu.classList.remove('open');
          menu.classList.add('hidden');
        })
      );
    }
  }

  // Scroll reveal
  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  // FAQ accordion
  function initFaq() {
    document.querySelectorAll('.faq-q').forEach((q) => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const answer = item.querySelector('.faq-a');
        const open = item.classList.contains('open');
        // close siblings in same faq
        const faq = item.closest('.faq');
        if (faq) {
          faq.querySelectorAll('.faq-item.open').forEach((sib) => {
            if (sib !== item) {
              sib.classList.remove('open');
              sib.querySelector('.faq-a').style.maxHeight = '0';
            }
          });
        }
        item.classList.toggle('open', !open);
        answer.style.maxHeight = open ? '0' : answer.scrollHeight + 'px';
      });
    });
  }

  // Code tabs
  function initCodeTabs() {
    document.querySelectorAll('.code-tabs').forEach((tabs) => {
      const container = tabs.closest('.code-block') || tabs.parentElement;
      const panels = container.querySelectorAll('.code-panel');
      const tabEls = tabs.querySelectorAll('.code-tab');
      tabEls.forEach((tab, idx) => {
        tab.addEventListener('click', () => {
          tabEls.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          panels.forEach((p) => p.classList.remove('active'));
          panels[idx]?.classList.add('active');
        });
      });
    });
  }

  // Demo / contact forms - lightweight client-side validation + feedback
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach((form) => {
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[data-status]') || document.createElement('div');
      if (!form.querySelector('[data-status]')) {
        status.className = 'form-status';
        status.setAttribute('data-status', '');
        status.style.cssText = 'margin-top:14px;font-size:.9rem;min-height:1.4em;';
        form.appendChild(status);
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        // required check
        let ok = true;
        form.querySelectorAll('[required]').forEach((f) => {
          if (!f.value.trim()) {
            ok = false;
            f.style.borderColor = 'var(--danger)';
            f.addEventListener('input', () => (f.style.borderColor = ''), { once: true });
          }
        });
        if (!ok) {
          status.textContent = 'Please fill out all required fields.';
          status.style.color = 'var(--danger)';
          return;
        }

        button.disabled = true;
        const original = button.textContent;
        button.textContent = 'Sending…';

        try {
          const action = form.getAttribute('action') || '/api/contact';
          if (action && action !== '#' && !action.startsWith('javascript')) {
            await fetch(action, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
          }
          status.textContent = 'Message received. We will respond within one business day.';
          status.style.color = 'var(--success)';
          form.reset();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          status.textContent = 'Something went wrong. Please email us at admin@taurusai.io.';
          status.style.color = 'var(--danger)';
        } finally {
          button.disabled = false;
          button.textContent = original;
        }
      });
    });
  }

  // Typewriter helper for terminal commands
  function initTypewriter() {
    if (prefersReduced) return;
    document.querySelectorAll('[data-typewriter]').forEach((el) => {
      const text = el.dataset.typewriter;
      const speed = parseInt(el.dataset.speed || '30', 10);
      let i = 0;
      el.textContent = '';
      const write = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(write, speed);
        }
      };
      setTimeout(write, 300);
    });
  }

  function init() {
    initConsole();
    initNav();
    initReveal();
    initFaq();
    initCodeTabs();
    initForms();
    initTypewriter();
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Nexus.init);
} else {
  Nexus.init();
}
