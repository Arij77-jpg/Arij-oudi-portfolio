/* ==========================================================================
   Arij Oudi Portfolio — Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navLinksEl = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const yearEl = document.getElementById('year');
  const toastEl = document.getElementById('toast');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     1. Dark / Light Theme Persistence
     ------------------------------------------------------------------------ */
  const savedTheme = localStorage.getItem('arij-portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  themeToggleBtn?.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('arij-portfolio-theme', next);
    showToast(`Switched to ${next} mode`);
  });

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer & Scrollspy
     ------------------------------------------------------------------------ */
  mobileToggleBtn?.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 130;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-links .nav-link[href="#${id}"]`);
      if (matchingLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((l) => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ------------------------------------------------------------------------
     3. Role Typing Effect
     ------------------------------------------------------------------------ */
  const typedRoleEl = document.getElementById('typed-role');
  const roles = [
    'Software Engineering Student',
    'AI & Deep Learning Enthusiast',
    'Cloud & DevOps Explorer',
    'Full-Stack Web Developer',
    'HoriBot Club Founder & President'
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedRoleEl && !prefersReducedMotion) {
    let roleIdx = 0;
    let charIdx = roles[0].length;
    let isDeleting = true;

    const tick = () => {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        charIdx--;
        typedRoleEl.textContent = currentRole.slice(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 320);
          return;
        }
        setTimeout(tick, 32);
      } else {
        charIdx++;
        typedRoleEl.textContent = currentRole.slice(0, charIdx);
        if (charIdx === currentRole.length) {
          isDeleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 55);
      }
    };
    setTimeout(tick, 1800);
  }

  /* ------------------------------------------------------------------------
     4. Subtle Interactive Hero Constellation Canvas
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const heroSection = canvas.parentElement;
    let width = 0;
    let height = 0;
    let nodes = [];
    const mouse = { x: null, y: null };

    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const resize = () => {
      width = canvas.width = heroSection.offsetWidth;
      height = canvas.height = heroSection.offsetHeight;
      const count = Math.min(38, Math.max(18, Math.floor(width / 38)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.48,
        vy: (Math.random() - 0.5) * 0.48,
        r: Math.random() * 1.6 + 1.1
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = htmlEl.getAttribute('data-theme') === 'light';
      const dotColor = isLight ? 'rgba(2, 132, 199, 0.38)' : 'rgba(56, 189, 248, 0.48)';
      const lineBase = isLight ? '2, 132, 199' : '56, 189, 248';

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 160) {
            const mAlpha = (1 - mDist / 160) * (isLight ? 0.22 : 0.32);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${lineBase}, ${mAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 135) {
            const alpha = (1 - dist / 135) * (isLight ? 0.14 : 0.22);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${lineBase}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  /* ------------------------------------------------------------------------
     5. Staggered Scroll Reveal, Scroll Progress & Stat Count-Up
     ------------------------------------------------------------------------ */
  const scrollProgressEl = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!scrollProgressEl) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    scrollProgressEl.style.width = `${pct.toFixed(2)}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Animated count-up for hero stats
  const statValues = document.querySelectorAll('.stat-value[data-count]');
  if (!prefersReducedMotion) {
    statValues.forEach((el) => {
      const target = Number(el.getAttribute('data-count')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 380);
    });
  }

  // Assign smooth stagger delays per grid container
  document.querySelectorAll('.projects-grid, .skills-grid, .certs-grid, .leadership-grid').forEach((grid) => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, idx) => {
      child.style.transitionDelay = `${Math.min(idx % 4, 3) * 75}ms`;
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Interactive cursor spotlight & subtle 3D tilt on desktop pointers
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const spotlightEls = document.querySelectorAll('.card, .hero-profile-card, .terminal-card, .stat-card');
    spotlightEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);

        if (el.classList.contains('project-card') || el.classList.contains('hero-profile-card') || el.classList.contains('terminal-card')) {
          const rx = ((y / rect.height) - 0.5) * -5;
          const ry = ((x / rect.width) - 0.5) * 5;
          el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        if (el.classList.contains('project-card') || el.classList.contains('hero-profile-card') || el.classList.contains('terminal-card')) {
          el.style.transform = '';
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Project Filter & Details Modal
     ------------------------------------------------------------------------ */
  const projectFilterBtns = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleIdx = 0;
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
        card.classList.remove('filtering-in');
        if (show) {
          card.classList.add('visible');
          card.style.animationDelay = `${visibleIdx * 55}ms`;
          void card.offsetWidth;
          card.classList.add('filtering-in');
          visibleIdx++;
        }
      });
    });
  });

  const projectDetails = {
    horizonexam: {
      tag: 'Full-Stack Web Application',
      title: 'HorizonExam',
      desc: 'An examination management platform built to coordinate assessment workflows across three distinct user roles: administrators, teachers, and students.',
      highlights: [
        'Role-based interfaces tailored for administrators, teachers, and students.',
        'Built with a React front-end and Node.js back-end architecture.',
        'Structured UI workflows for organizing exams, tracking sessions, and managing participants.'
      ],
      tech: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS']
    },
    snitch: {
      tag: 'Interactive Algorithmic Game',
      title: "The Snitch's Path",
      desc: 'An interactive Harry Potter-inspired browser game designed around path-finding concepts, turning traversal algorithms into an engaging playable experience.',
      highlights: [
        'Applies path-finding concepts to interactive grid and route navigation.',
        'Responsive browser interface built with semantic HTML, CSS, and vanilla JavaScript.',
        'Combines algorithmic problem-solving with themed visual storytelling.'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'Path-Finding Concepts']
    },
    adventure: {
      tag: '2D Browser Game',
      title: 'Adventure Time Treasure Hunt',
      desc: 'A 2D treasure hunt game inspired by Adventure Time, built directly in the browser with custom movement controls, collectibles, and game-state management.',
      highlights: [
        '2D treasure hunt mechanics with interactive player navigation and collision detection.',
        'Clean front-end implementation using vanilla JavaScript, HTML, and CSS.',
        'Focused on responsive controls, clear visual feedback, and replayable level flow.'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', '2D Game Logic']
    },
    'robot-teleguide': {
      tag: 'Robotics & Embedded Control',
      title: 'Robot Téléguidé',
      desc: 'A remote-controlled robotic vehicle engineered for responsive wireless driving, accurate motor actuation, and reliable hardware-software communication.',
      highlights: [
        'Wireless remote control architecture for directional maneuvering and speed control.',
        'Integrated motor driver wiring, power distribution, and embedded control logic.',
        'Tested for stability, responsiveness, and competition-ready mechanical assembly.'
      ],
      tech: ['Robotics', 'Embedded C', 'Wireless Control', 'Motors']
    },
    'smart-home': {
      tag: 'IoT & Home Automation',
      title: 'Smart Home',
      desc: 'An automated smart home prototype integrating sensor monitoring and smart actuator control for safer, more efficient residential living.',
      highlights: [
        'Automated lighting, environmental sensing, and security monitoring workflows.',
        'Real-time sensor feedback integrated with microcontroller decision logic.',
        'Designed as a scalable IoT model demonstrating connected home automation.'
      ],
      tech: ['IoT', 'Sensors', 'Automation', 'Embedded Systems']
    },
    'ski-teleguide': {
      tag: 'Robotics Prototype',
      title: 'Ski Téléguidé',
      desc: 'A remote-controlled motorized ski system engineered for smooth directional control and balance on low-friction surfaces.',
      highlights: [
        'Remote-controlled propulsion and steering tailored for ski-style gliding mechanics.',
        'Lightweight structural design balancing center of gravity and wireless responsiveness.',
        'Built and tuned through iterative mechanical and control testing.'
      ],
      tech: ['Robotics', 'Remote Control', 'Actuators', 'Prototyping']
    },
    'smart-city': {
      tag: 'IoT & Smart Urban Systems',
      title: 'Smart City',
      desc: 'A connected smart city model illustrating how IoT sensors and automation improve urban infrastructure, traffic flow, and energy efficiency.',
      highlights: [
        'Automated smart street lighting and sensor-assisted traffic coordination.',
        'Integrates multiple subsystems into a unified urban monitoring prototype.',
        'Demonstrates sustainable smart-infrastructure concepts with embedded electronics.'
      ],
      tech: ['Smart City', 'IoT', 'Automation', 'Sensors']
    },
    'tout-terrain': {
      tag: 'All-Terrain Robotics',
      title: 'Robot Tout-Terrain',
      desc: 'A rugged all-terrain rover built to navigate uneven ground, slopes, and physical obstacles with strong traction and durable mechanics.',
      highlights: [
        'High-torque drive system engineered for off-road stability and obstacle traversal.',
        'Reinforced chassis architecture designed for demanding robotics challenges.',
        'Responsive control loop tuned for varied surfaces and terrain transitions.'
      ],
      tech: ['Robotics', 'All-Terrain', 'Hardware', 'Control Systems']
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalTech = document.getElementById('modal-tech');
  const closeModalBtn = document.getElementById('close-modal');

  const openModal = (key) => {
    const data = projectDetails[key];
    if (!data || !modalBackdrop) return;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalHighlights.innerHTML = data.highlights.map((item) => `<li>${item}</li>`).join('');
    modalTech.innerHTML = data.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('');
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-project'));
    });
  });

  closeModalBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------------
     7. Leadership & Achievements Filter
     ------------------------------------------------------------------------ */
  const leadFilterBtns = document.querySelectorAll('[data-lead-filter]');
  const leadItems = document.querySelectorAll('.lead-item');

  leadFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-lead-filter');
      leadFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleIdx = 0;
      leadItems.forEach((item) => {
        const cat = item.getAttribute('data-lead-cat');
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('hidden', !show);
        item.classList.remove('filtering-in');
        if (show) {
          item.classList.add('visible');
          item.style.animationDelay = `${visibleIdx * 40}ms`;
          void item.offsetWidth;
          item.classList.add('filtering-in');
          visibleIdx++;
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     8. Copy Email & Contact Form
     ------------------------------------------------------------------------ */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  copyEmailBtn?.addEventListener('click', async () => {
    const email = copyEmailBtn.getAttribute('data-copy');
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!');
    } catch {
      showToast('Email: ' + email);
    }
  });

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) return;

    const mailtoBody = `Hi Arij,%0D%0A%0D%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailtoUrl = `mailto:arij.oudi@horizon-university.tn?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    window.location.href = mailtoUrl;
    if (formStatus) {
      formStatus.textContent = 'Opening your email client with the composed message...';
    }
    showToast('Ready to send via your email client!');
    contactForm.reset();
  });

  /* ------------------------------------------------------------------------
     9. Toast Helper
     ------------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }
});
