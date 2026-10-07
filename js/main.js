/**
 * ANURAG DASHORE - PORTFOLIO INTERACTIVE ENGINE
 * High-performance vanilla JavaScript customized for Anurag Dashore's actual resume:
 * LLM Agents, Offline-First AI, Industrial Systems, and Open-Source Contributions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasBackground();
  initTypewriter();
  initNavbar();
  initStatsCounter();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initClipboardCopy();
  initBackToTop();
  initFooterTime();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

/* --------------------------------------------------------------------------
   2. Interactive Ambient Canvas (Constellation / Particle Network)
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 65;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.5 ? '99, 102, 241' : '6, 182, 212';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.75)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect in Hero (Targeting Anurag's Actual Skills)
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = [
    'LLM Agents Engineer',
    'Open-Source Contributor (GitLab)',
    'Offline-First AI Builder',
    'Industrial & Python Developer',
    'Lean Manufacturing Analyst'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Navbar Scroll & Mobile Navigation
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. Animated Stats Counter
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        stats.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = Math.round(target) + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.round(current) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) observer.observe(statsRow);
}

/* --------------------------------------------------------------------------
   6. Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 220);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Projects Showcase Filter
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 220);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Project Deep Dive Modal System (Accurate Data from Resume)
   -------------------------------------------------------------------------- */
const projectData = {
  mechai: {
    title: 'MechAI — Assembly Line Efficiency',
    subtitle: 'Industrial AI Platform analyzing real manufacturing data across 17 workstations (InnoVent-27)',
    image: 'assets/images/mechai.webp',
    category: 'Industrial AI / Machine Learning',
    tags: ['Python', 'Flask', 'scikit-learn', 'Pandas', 'Plotly', 'SmolLM2-360M', 'Edge AI', 'Kanban'],
    description: 'MechAI is an offline-first industrial AI platform designed for smart manufacturing shop-floors. Developed for InnoVent-27 (Jul 2026), it processes real assembly-line manufacturing data across 17 workstations, completely eliminating cloud API dependency through an on-premise local LLM.',
    highlights: [
      'Developed 4 ML prediction models using scikit-learn across 12 core operational modules: AS-IS Summary, Flow Process Chart, Line Balance Analysis, Plant Layout Generator, Efficiency Comparison, SOP Generator, Cost Calculator, Daily Production Reports, Shop Production Schedules, ABC Inventory Analysis, Kanban System, and Predictive Forecasting.',
      'Integrated SmolLM2-360M-Instruct (local LLM, Apache 2.0) as an offline AI chatbot ("Ask MechAI") for domain-specific manufacturing insights without external API calls or latency.',
      'Created interactive Plotly analytical dashboards and automated PDF exports formatted for edge deployment on shop-floor terminals and embedded touchscreen systems.',
      'Optimized cycle times, smoothed workstation idle times, and established standardized digital work sequences.'
    ],
    liveUrl: 'https://anurag-dashore.github.io/MechAI/',
    liveLabel: 'Live Demo ↗'
  },
  prismpulse: {
    title: 'PrismPulse — GitLab Duo Chat Agent',
    subtitle: 'Autonomous codebase health & security analyzer across 7 dimensions (GitLab Transcend Hackathon)',
    image: 'assets/images/gitlab.webp',
    fit: 'contain',
    category: 'LLM Agents & DevSecOps',
    tags: ['Python', 'GitLab Duo Chat', 'MCP (Model Context Protocol)', 'RAG Concepts', 'Static Analysis'],
    description: 'Built during the GitLab Transcend Hackathon (Jun 2026), PrismPulse is an intelligent GitLab Duo Chat agent that inspects source repositories and diagnoses code health across 7 deep dimensions, delivering automated refactoring suggestions.',
    highlights: [
      'Analyzed codebases across 7 key architectural dimensions: Health Score, Inactive Code, Security, Dependencies, Duplication, Structure, and Test Gaps.',
      'Officially accepted and indexed into the GitLab AI-Agent CatLog (Agent ID: 1011676).',
      'Leveraged Model Context Protocol (MCP) to supply high-fidelity repository context directly to GitLab Duo Chat.',
      'Equipped engineering teams with instant code health audits directly within the GitLab workflow.'
    ],
    liveUrl: 'https://devpost.com/software/prismpulse',
    liveLabel: 'Devpost ↗',
    codeUrl: 'https://gitlab.com/explore/ai-catalog/agents/1011676/',
    codeLabel: 'GitLab AI Catalog ↗'
  },
  igniteengine: {
    title: 'IgniteEngine — 16 Sparks',
    subtitle: 'Slack-native system orchestrating 16 specialized LLM agents (Slack Agent Builder Challenge)',
    image: 'assets/images/ignite-engine.webp',
    category: 'Multi-Agent LLM Orchestration',
    tags: ['Python', 'Slack Bolt/API', 'Groq API', 'Slack Block Kit', 'MCP', 'LLaMA'],
    description: 'IgniteEngine was created for the Slack Agent Builder Challenge (Aug 2026). It orchestrates 16 distinct, specialized LLM agents collaborating directly within Slack to generate interactive story concepts and animation workflows.',
    highlights: [
      'Orchestrates 16 specialized autonomous agents passing sequential context and state through Slack Block Kit interactive message surfaces.',
      'Engineered interactive story branching, dynamic agent rerolling, and post-generation content safety validation checks.',
      'Integrated high-throughput Groq API inference for ultra-fast, sub-second Slack conversational responses.',
      'Utilized Model Context Protocol (MCP) concepts for modular agent tool execution.'
    ],
    codeUrl: 'https://gitlab.com/anuragdashore1024/IgniteEngine',
    codeLabel: 'GitLab Repo ↗'
  },
  assemblyline: {
    title: 'Assembly Line Efficiency & Material Handling Optimization',
    subtitle: 'Final Year Engineering Capstone Project · Mentored by Dr. Devendra Singh Verma · Anand Air Cooler',
    image: 'assets/images/final-year-project.webp',
    fit: 'top',
    category: 'Lean Manufacturing & Systems Engineering',
    tags: ['Lean Manufacturing', 'Kanban', 'JIT', 'Time & Motion Study', 'PLM', 'Muda Reduction'],
    description: 'Conducted under the mentorship of Dr. Devendra Singh Verma (HOD, Institute of Design DAVV — DAVID-DAVV) in active partnership with Anand Air Cooler, Indore. Addressed assembly line bottlenecks, excessive material handling, and inventory buffer imbalances.',
    highlights: [
      'Conducted AS-IS time study, establishing a Standard Time of 33.26 min/unit and identifying 24% cycle time loss due to material transport backtracking through Process Flow Diagrams (PFDs).',
      'Proposed a U-shaped / Continuous Flow layout to replace scattered workstation arrangements, eliminating backtracking and drastically reducing worker transit distance.',
      'Designed a pull-based Kanban system, Daily Production Reports (DPRs), and standardized Shop Production Schedules to eliminate overproduction.',
      'Balanced assembly sequences for Motor, Fan, Cooling Pad, and Pump components, establishing Standard Operating Procedures (SOPs).'
    ],
    liveUrl: 'https://github.com/ANURAG-DASHORE/ANURAG-DASHORE.github.io/tree/main/IMAGES/FINAL_YEAR_PROJECT',
    liveLabel: 'Project Files ↗'
  },
  gitlabmr: {
    title: 'GitLab Open-Source Merge Request #248992',
    subtitle: 'Resolved Flaky Jest Test in GitLab EE Frontend via Apollo GraphQL Mock Refactor (Merged)',
    image: 'assets/images/gitlab.webp',
    fit: 'contain',
    category: 'Open-Source Engineering',
    tags: ['Vue.js', 'Jest', 'Apollo GraphQL', 'GitLab EE', 'Frontend Testing', 'Open Source'],
    description: 'Merged contribution into GitLab\'s open-source repository (gitlab.com/gitlab-org/gitlab). Identified and resolved a persistent flaky test within GitLab\'s Enterprise Edition frontend test suite.',
    highlights: [
      'Pinpointed an elusive asynchronous race condition during Apollo GraphQL mock resolution in GitLab\'s Vue.js frontend test specifications.',
      'Refactored the spec to adopt GitLab\'s standardized createControlledMockApollo pattern, guaranteeing deterministic test executions across CI runners.',
      'Directly reviewed, approved, and merged by two official GitLab maintainers into the main branch.',
      'Demonstrated deep understanding of enterprise-scale frontend architecture and rigorous test discipline.'
    ],
    liveUrl: 'https://gitlab.com/gitlab-org/gitlab/-/merge_requests/248992',
    liveLabel: 'View Merge Request ↗',
    codeUrl: 'https://gitlab.com/gitlab-org/gitlab',
    codeLabel: 'GitLab Repository ↗'
  },
  safetyhelmet: {
    title: 'Optimized Safety Helmet Design',
    subtitle: 'BIS On-Campus Hackathon (Nov – Dec 2024)',
    image: 'assets/images/bis-hackathon.webp',
    category: 'Product Design & IoT Safety',
    tags: ['IS 4151 Standards', 'IoT Integration', 'Ergonomics', 'Material Durability', 'Product Design'],
    description: 'Designed a compliant, high-safety motorcycle helmet conceptual model in accordance with Bureau of Indian Standards (IS 4151) during a campus hackathon competing against 60–80 teams.',
    highlights: [
      'Designed conceptual helmet model conforming strictly to IS 4151 regulatory crash impact standards.',
      'Integrated IoT-based traffic signal detection module for enhanced rider situational awareness.',
      'Collaborated on structural material durability and user ergonomics for real-world commuter adoption.'
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('.open-project-modal');

  if (!modalBackdrop) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    const modalImg = document.getElementById('modal-img');
    modalImg.className = data.fit ? 'fit-' + data.fit : '';
    modalImg.src = data.image;
    document.getElementById('modal-img').alt = data.title;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-desc').textContent = data.description;
    
    const badgesContainer = document.getElementById('modal-badges');
    badgesContainer.innerHTML = data.tags
      .map(tag => `<span class="stack-tag">${tag}</span>`)
      .join('');

    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = data.highlights
      .map(item => `<li>${item}</li>`)
      .join('');

    const liveBtn = document.getElementById('modal-live-link');
    const codeBtn = document.getElementById('modal-code-link');
    const setLink = (el, url, label, fallback) => {
      if (!el) return;
      if (url) {
        el.href = url;
        el.style.display = '';
        const sp = el.querySelector('span');
        if (sp) sp.textContent = label || fallback;
      } else {
        el.style.display = 'none';
      }
    };
    setLink(liveBtn, data.liveUrl, data.liveLabel, 'Project Link ↗');
    setLink(codeBtn, data.codeUrl, data.codeLabel, 'Repository / GitLab ↗');

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   10. Clipboard Copy Utility
   -------------------------------------------------------------------------- */
function initClipboardCopy() {
  const copyBtns = document.querySelectorAll('.copy-trigger');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-success)';
        btn.style.color = 'var(--accent-success)';
        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        showToast('Could not copy to clipboard', 'error');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   12. Live Local Clock in Footer (Indore / IST)
   -------------------------------------------------------------------------- */
function initFooterTime() {
  const timeElem = document.getElementById('live-time');
  if (!timeElem) return;

  function updateTime() {
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    timeElem.textContent = now.toLocaleTimeString('en-US', options) + ' (IST / Indore, India)';
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   13. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   14. Toast Notification Dispatcher
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconSvg = type === 'error'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
