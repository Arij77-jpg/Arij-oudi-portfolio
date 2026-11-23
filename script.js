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
    'Mobile & Full-Stack Developer',
    'AI & Deep Learning Enthusiast',
    'Cloud & DevOps Explorer',
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
  document.querySelectorAll('.projects-grid, .skills-grid, .certs-grid, .leadership-grid, .gallery-grid').forEach((grid) => {
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
        const category = card.getAttribute('data-category') || '';
        const cats = category.split(/\s+/);
        const show = filter === 'all' || category === filter || cats.includes(filter);
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
    bledi: {
      tag: 'CivicTech Mobile Platform',
      title: 'Bledi+ (بلادي+)',
      desc: 'A civic technology mobile platform enabling Tunisian citizens to report urban issues and municipal staff to track, resolve, and verify repairs with Before/After photo proof. Designed for transparency and regional municipal accountability.',
      highlights: [
        'Civic issue reporting system with camera integration for Before/After repair verification and audit trails.',
        'Domain-based Role-Based Access Control (RBAC) separating citizens, municipal field operators, and supervisors.',
        'Regional Délégation isolation ensuring municipal staff only manage issues within their geographic jurisdiction.',
        'Real-time automated push notifications alerting citizens as issue statuses update from submitted to in-progress and resolved.',
        'Engineered with React Native, Expo, and TypeScript; backed by Firebase Firestore, Auth, Storage, and Cloud Functions.'
      ],
      tech: ['React Native', 'Expo', 'TypeScript', 'Firebase Firestore', 'Firebase Auth', 'Cloud Storage', 'Cloud Functions']
    },
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
     7b. Activities Photo Albums & Lightbox Viewer (38 Photos, 4 Albums)
     ------------------------------------------------------------------------ */
  const GALLERY_ALBUMS = [
    {
      id: 'competitions',
      shortName: 'Competitions',
      title: 'Robotics Competitions & Awards',
      desc: 'Podium finishes, Zarzis Robots 1.0 (2nd Prize), NPC 2.0 Polytechnique Sousse, ENIMROBOT medals & national arenas.',
      photos: [
        {
          src: 'assets/activities/zarzis-robots-1-second-prize.jpg',
          badge: '2nd Prize',
          title: 'Zarzis Robots 1.0 — 2nd Prize Winners',
          sub: 'Winning 2nd Place at AJIZ & Jeunes et Science Zarzis Robots 1.0 (April 2023)',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/npc2-polyrobots-tout-terrain.jpg',
          badge: 'NPC 2.0',
          title: 'NPC 2.0 Polytechnique Sousse — Tout-Terrain',
          sub: 'Challenge Tout Terrain off-road robot & certificate from Club PolyRobots',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/enimrobot-medal-collage.jpg',
          badge: 'ENIMROBOT',
          title: 'ENIMROBOT 8th Edition — Medal & 20/20 Scores',
          sub: 'Competition highlights, medal celebration & AJIZ robotics squad',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/robotics-competition-podium-group.jpg',
          badge: 'Podium',
          title: 'Robotics Competition Podium & Teams',
          sub: 'Celebrating around the 1st–2nd–3rd podium with competitors and our robots',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/robotics-speed-team.jpg',
          badge: 'Speed Run',
          title: 'Robotics Speed Competition Team',
          sub: 'Prepping and testing our red remote-controlled racing robot on competition day',
          pos: ''
        },
        {
          src: 'assets/activities/ajiz-competition-robot.jpg',
          badge: 'Track Run',
          title: 'AJIZ Competition Robot on Track',
          sub: 'Custom remote-controlled robot with AJIZ spoiler navigating arena obstacles',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/zarzis-robots-1-team.jpg',
          badge: 'Team',
          title: 'Team Showcase — Zarzis Robots 1.0',
          sub: 'Presenting our competition robot with teammates at Zarzis Robots 1.0 (2023)',
          pos: ''
        },
        {
          src: 'assets/activities/competitions-outside-delegation.jpg',
          badge: 'Delegation',
          title: 'Robotics Competition Delegation',
          sub: 'Student engineering teams with custom competition robots outside the venue',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/participant-badge-competition.jpg',
          badge: 'All-Terrain',
          title: 'All-Terrain Challenge Participant',
          sub: 'Representing Zarzis & Horizon at national robotics challenges',
          pos: ''
        }
      ]
    },
    {
      id: 'leadership',
      shortName: 'Leadership & Events',
      title: 'Leadership, Clubs & Certifications',
      desc: 'HoriBot Club Founder & President, GAICA Global AI Congress staff, Horizon delegation, AJIZ Zarzis & 15+ certifications.',
      photos: [
        {
          src: 'assets/activities/horibot-stage-presentation.jpg',
          badge: 'HoriBot Club',
          title: 'HoriBot Club — Horizon University',
          sub: 'Leading and presenting HoriBot Club on stage as Founder & President',
          pos: ''
        },
        {
          src: 'assets/activities/gaica-staff-badge.jpg',
          badge: 'AI Congress',
          title: 'GAICA Global AI Congress — Staff',
          sub: 'Official staff badge at GAICA Global AI Congress in Sousse, Tunisia',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/certificates-collection-collage.jpg',
          badge: '15+ Certs',
          title: '15+ Certifications & Competition Awards',
          sub: "Horizon Nuit de l'Info, ESPRIT RAS Robot 3.0, Zarzis Robots, FTSAAA & AJIZ",
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/horizon-campus-delegation.jpg',
          badge: 'Horizon Tech',
          title: 'Horizon School of Digital Technologies',
          sub: 'Representing Horizon University with our student tech delegation',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/ajiz-zitha-teamwork-hub.jpg',
          badge: 'Teamwork',
          title: 'AJIZ × Zitha Working Hub',
          sub: 'Collaborative robotics bootcamp and teamwork session in Zarzis',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/ajiz-certificate.jpg',
          badge: 'AJIZ Zarzis',
          title: 'AJIZ — Young Engineers Association of Zarzis',
          sub: 'Receiving Attestation de Participation with Association des Jeunes Ingénieurs de Zarzis',
          pos: ''
        },
        {
          src: 'assets/activities/secourisme-certificate-ajiz.jpg',
          badge: 'First Aid Cert',
          title: 'Secourisme Certification — AJIZ Zarzis',
          sub: 'Receiving First Aid & Health Awareness certification during AJIZ awareness days',
          pos: ''
        },
        {
          src: 'assets/activities/ajiz-ftsaaa-certificates-group.jpg',
          badge: 'Ceremony',
          title: 'Training Certification Ceremony',
          sub: 'Celebrating completion with certificates alongside cohort and instructors',
          pos: ''
        }
      ]
    },
    {
      id: 'robotics',
      shortName: 'Robotics & Builds',
      title: 'Robotics & Hardware Builds',
      desc: 'Smart City Zarzis prototype, Arduino UNO firmware, mecanum chassis, line-follower robots & off-road rovers.',
      photos: [
        {
          src: 'assets/activities/smart-city-model.jpg',
          badge: 'Smart City',
          title: 'Smart City Prototype — Zarzis Model',
          sub: 'Miniature automated urban infrastructure & smart traffic prototype',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/arduino-mecanum-workshop.jpg',
          badge: 'Mecanum',
          title: 'Arduino & Mecanum Robotics Build',
          sub: 'Hands-on Arduino wiring, mecanum wheels, and chassis assembly',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/line-follower-robots-track.jpg',
          badge: 'Line Follower',
          title: 'Autonomous Line-Follower Robots',
          sub: 'Dual Arduino & motor-driver line-follower robots calibrated on the test track',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/tout-terrain-rover-build.jpg',
          badge: 'Tout-Terrain',
          title: 'Robot Tout-Terrain — Hardware Testing',
          sub: 'All-terrain rover assembly with gamepad controller and multimeter diagnostics',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/dexter-robot-prototype.jpg',
          badge: 'Dexter Robot',
          title: 'Dexter Robot — Zarzis Robots 1.0',
          sub: 'Acrylic-chassis Arduino Bluetooth robot built for Zarzis Robots 1.0',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/arduino-ide-buzzer-coding.jpg',
          badge: 'Embedded C',
          title: 'Arduino UNO Embedded C Programming',
          sub: 'Writing real-time microcontroller code and live circuit testing on Arduino UNO',
          pos: 'pos-center'
        }
      ]
    },
    {
      id: 'training',
      shortName: 'Teaching & Workshops',
      title: 'Teaching, Scouts & Workshops',
      desc: 'Robotics trainer at Collège Mouansa & École de la Vie, Scouts Robotics Club, Fondation Orange, FTSAAA Cerf-volant & Secourisme.',
      photos: [
        {
          src: 'assets/activities/college-mouansa-robotics-class.jpg',
          badge: 'Collège Mouansa',
          title: 'Robotics Workshop — Collège Mouansa, Zarzis',
          sub: 'Training middle school students in electronics & robotics in the Technology lab',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/l298n-motor-driver-lecture.jpg',
          badge: 'Lecture',
          title: 'Teaching L298N Motor Drivers — AJIZ',
          sub: 'Delivering electronics & PWM motor-control lessons during Formation Robotique AJIZ',
          pos: ''
        },
        {
          src: 'assets/activities/scouts-robot-build-session.jpg',
          badge: 'Scouts Club',
          title: 'Scouts Robotics Club — Arduino Build',
          sub: 'Young scout building and wiring an Arduino motor-driven robot in Zarzis',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/ecole-de-la-vie-cert.jpg',
          badge: 'Formatrice',
          title: 'Robotics Trainer — École de la Vie, Zarzis',
          sub: 'Trainer recognition certificate after robotics workshops at École de la Vie',
          pos: ''
        },
        {
          src: 'assets/activities/orange-fondation-smart-home-team.jpg',
          badge: 'Maisons Digitales',
          title: 'Fondation Orange — Smart Home & Robotics',
          sub: 'Maisons Digitales cohort showcasing Smart Home wooden prototype & robots',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/zarzis-robotics-expo.jpg',
          badge: 'Showcase',
          title: 'Zarzis Robotics 2.0 Showcase',
          sub: 'Demonstrating student robotics & Smart City prototypes to visitors',
          pos: ''
        },
        {
          src: 'assets/activities/guild-fighters-student-robot.jpg',
          badge: 'Student Build',
          title: 'Guild Fighters — Student Robotics Build',
          sub: 'Middle school trainees proudly showcasing their custom camo robot',
          pos: ''
        },
        {
          src: 'assets/activities/student-team-zoro-robot.jpg',
          badge: 'Mentorship',
          title: 'Student Robotics Team & Custom Build',
          sub: 'Celebrating with middle school trainees and their custom-built robot',
          pos: ''
        },
        {
          src: 'assets/activities/ajiz-zarzis-day2-workshop.jpg',
          badge: 'Bootcamp',
          title: 'AJIZ Zarzis — Hands-On Robotics Bootcamp',
          sub: 'Students programming on laptops & wiring robotics circuits during Day 2',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/students-wiring-robotics-lab.jpg',
          badge: 'Electronics Lab',
          title: 'Collaborative Electronics & Wiring Lab',
          sub: 'Guiding students through circuit debugging and sensor assembly',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/formation-robotique-ajiz-kids.jpg',
          badge: 'Jeunes & Sciences',
          title: 'Formation Robotique AJIZ — Jeunes & Sciences',
          sub: 'Group photo with young robotics trainees in cooperation with Jeunes et Sciences',
          pos: ''
        },
        {
          src: 'assets/activities/student-windmill-demo.jpg',
          badge: 'STEM Youth',
          title: 'Youth STEM Robotics Workshop',
          sub: 'Young learners presenting their hands-on motorized hardware prototype',
          pos: ''
        },
        {
          src: 'assets/activities/cerf-volant-workshop.jpg',
          badge: 'FTSAAA',
          title: 'Cerf-volant Aeronautics Workshop (FTSAAA)',
          sub: 'Structural kite frame assembly and aerodynamics workshop at AJIZ Academy',
          pos: ''
        },
        {
          src: 'assets/activities/secourisme-cpr-training.jpg',
          badge: 'Secourisme',
          title: 'Secourisme (First Aid) Practical Training',
          sub: 'Hands-on CPR & emergency response simulation at AJIZ Academy',
          pos: 'pos-center'
        },
        {
          src: 'assets/activities/young-students-hug-workshop.jpg',
          badge: 'Impact',
          title: 'Community Impact — Young Robotics Trainees',
          sub: 'Memorable wrap-up moment with enthusiastic young robotics students in Zarzis',
          pos: ''
        }
      ]
    }
  ];

  const albumsGridEl = document.getElementById('albums-grid');
  const albumDetailViewEl = document.getElementById('album-detail-view');
  const albumDetailTitleEl = document.getElementById('album-detail-title');
  const albumDetailSubEl = document.getElementById('album-detail-sub');
  const albumDetailCountEl = document.getElementById('album-detail-count');
  const albumSwitcherEl = document.getElementById('album-switcher');
  const backToAlbumsBtn = document.getElementById('back-to-albums');
  const galleryGridEl = document.getElementById('gallery-grid');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxClose = document.getElementById('lightbox-close');

  let activeAlbum = null;
  let currentLightboxIdx = 0;

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const renderAlbumOverview = () => {
    if (!albumsGridEl) return;
    albumsGridEl.innerHTML = GALLERY_ALBUMS.map((album) => {
      const [p1, p2, p3] = album.photos;
      return `
        <button type="button" class="album-card" data-open-album="${album.id}">
          <div class="album-mosaic">
            <span class="album-count-pill">${album.photos.length} Photos</span>
            <div class="album-mosaic-main">
              <img src="${p1.src}" alt="${escapeHtml(p1.title)}" loading="lazy" />
            </div>
            <div class="album-mosaic-sub">
              <img src="${p2.src}" alt="${escapeHtml(p2.title)}" loading="lazy" />
            </div>
            <div class="album-mosaic-sub">
              <img src="${p3.src}" alt="${escapeHtml(p3.title)}" loading="lazy" />
            </div>
          </div>
          <div class="album-info">
            <div class="album-title-row">
              <h3 class="album-title">${escapeHtml(album.title)}</h3>
              <span class="album-arrow">Open Album &rarr;</span>
            </div>
            <p class="album-desc">${escapeHtml(album.desc)}</p>
          </div>
        </button>
      `;
    }).join('');

    albumsGridEl.querySelectorAll('[data-open-album]').forEach((card) => {
      card.addEventListener('click', () => {
        openAlbum(card.getAttribute('data-open-album'));
      });
    });
  };

  const openAlbum = (albumId) => {
    const album = GALLERY_ALBUMS.find((a) => a.id === albumId);
    if (!album || !albumsGridEl || !albumDetailViewEl || !galleryGridEl) return;

    activeAlbum = album;
    albumsGridEl.classList.add('hidden');
    albumDetailViewEl.classList.remove('hidden');

    albumDetailTitleEl.textContent = album.title;
    albumDetailSubEl.textContent = album.desc;
    albumDetailCountEl.textContent = `${album.photos.length} Photos`;

    if (albumSwitcherEl) {
      albumSwitcherEl.innerHTML = GALLERY_ALBUMS.map(
        (a) => `
          <button
            type="button"
            class="filter-btn ${a.id === album.id ? 'active' : ''}"
            data-switch-album="${a.id}"
          >
            ${escapeHtml(a.shortName)} (${a.photos.length})
          </button>
        `
      ).join('');

      albumSwitcherEl.querySelectorAll('[data-switch-album]').forEach((btn) => {
        btn.addEventListener('click', () => {
          openAlbum(btn.getAttribute('data-switch-album'));
        });
      });
    }

    galleryGridEl.innerHTML = album.photos
      .map(
        (photo, idx) => `
        <button
          type="button"
          class="gallery-card visible filtering-in"
          style="animation-delay: ${Math.min(idx, 12) * 40}ms"
          data-photo-index="${idx}"
        >
          <span class="gallery-badge">${escapeHtml(photo.badge)}</span>
          <span class="gallery-zoom-icon" aria-hidden="true">&#10530;</span>
          <img
            src="${photo.src}"
            alt="${escapeHtml(photo.title)}"
            class="gallery-img ${photo.pos || ''}"
            loading="lazy"
          />
          <div class="gallery-overlay">
            <div class="gallery-title">${escapeHtml(photo.title)}</div>
            <div class="gallery-sub">${escapeHtml(photo.sub)}</div>
          </div>
        </button>
      `
      )
      .join('');

    galleryGridEl.querySelectorAll('[data-photo-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openLightbox(Number(btn.getAttribute('data-photo-index')));
      });
    });

    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  backToAlbumsBtn?.addEventListener('click', () => {
    if (!albumsGridEl || !albumDetailViewEl) return;
    albumDetailViewEl.classList.add('hidden');
    albumsGridEl.classList.remove('hidden');
    albumsGridEl.classList.add('visible');
  });

  const renderLightbox = () => {
    if (!activeAlbum || !lightboxImg) return;
    const photo = activeAlbum.photos[currentLightboxIdx];
    if (!photo) return;
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxTag.textContent = `${activeAlbum.shortName} // ${photo.badge}`;
    lightboxTitle.textContent = photo.title;
    lightboxSub.textContent = photo.sub;
    lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${activeAlbum.photos.length}`;
  };

  const openLightbox = (index) => {
    if (!activeAlbum) return;
    currentLightboxIdx = index;
    renderLightbox();
    lightbox?.classList.add('open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const stepLightbox = (delta) => {
    if (!activeAlbum) return;
    const len = activeAlbum.photos.length;
    currentLightboxIdx = (currentLightboxIdx + delta + len) % len;
    renderLightbox();
  };

  lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
  lightboxNext?.addEventListener('click', () => stepLightbox(1));
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  renderAlbumOverview();

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
