/**
 * AHMED RAZA — FULL STACK DEVELOPER PORTFOLIO
 * Main Interactive Logic Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCursorFollower();
  initSoundEngine();
  initTypewriter();
  initTerminal();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModal();
  init3DTilt();
  initScrollSpy();
  initLiveClock();
  initContactForm();
  initCopyButtons();
  initMobileNav();
  initIntersectionObserver();
});

/* ==========================================================================
   1. INTERACTIVE CONSTELLATION PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 85);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 3;
          const dirY = (dy / dist) * force * 3;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowColor = this.color + '0.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. CUSTOM CURSOR AURA
   ========================================================================== */
function initCursorFollower() {
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursorGlow || !cursorDot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  // Hover scale on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, select, textarea, .glass-panel, .skill-card');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(2.2)';
      cursorDot.style.background = 'var(--accent-purple)';
      cursorDot.style.boxShadow = '0 0 14px var(--accent-purple)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.background = 'var(--accent-cyan)';
      cursorDot.style.boxShadow = '0 0 10px var(--accent-cyan)';
    });
  });
}

/* ==========================================================================
   3. WEB AUDIO API SOUND ENGINE (Haptic audio FX)
   ========================================================================== */
let soundEnabled = true;
let audioCtx = null;

function initSoundEngine() {
  const toggleBtn = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08, vol = 0.04) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        icon.className = 'ri-volume-up-line';
        playTone(600, 'sine', 0.1, 0.08);
        showToast('🔊 Audio feedback enabled', 'info');
      } else {
        icon.className = 'ri-volume-mute-line';
        showToast('🔇 Audio feedback muted', 'info');
      }
    });
  }

  // Attach subtle audio feedback to clicks
  document.querySelectorAll('button, .nav-link, .btn, .filter-btn, .skill-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      playTone(520, 'triangle', 0.06, 0.03);
    });
  });
}

/* ==========================================================================
   4. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  const phrases = [
    'Scalable Distributed Microservices.',
    'High-Performance Next.js & React Apps.',
    'Resilient Cloud-Native Architectures.',
    'Fluid 60FPS Interactive Web Interfaces.',
    'Zero-Downtime Automated CI/CD Pipelines.'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      textEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      textEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* ==========================================================================
   5. INTERACTIVE DEVELOPER TERMINAL & CLI
   ========================================================================== */
function initTerminal() {
  const tabs = document.querySelectorAll('.term-tab');
  const contents = document.querySelectorAll('.term-content');
  const copyBtn = document.getElementById('copyCodeBtn');
  const cliInput = document.getElementById('cliInput');
  const cliOutput = document.getElementById('cliOutput');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) {
        target.classList.add('active');
      }
      if (tab.dataset.tab === 'cli' && cliInput) {
        setTimeout(() => cliInput.focus(), 100);
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeContent = document.querySelector('.term-content.active pre code');
      if (activeContent) {
        navigator.clipboard.writeText(activeContent.innerText);
        showToast('📋 Code copied to clipboard!', 'success');
      }
    });
  }

  // Interactive CLI commands
  if (cliInput && cliOutput) {
    const commandMap = {
      help: () => `
        <div class="cli-line text-muted">Available Commands:</div>
        <div class="cli-line">  <span class="cli-highlight">skills</span>    - List core engineering capabilities</div>
        <div class="cli-line">  <span class="cli-highlight">projects</span>  - Display top featured projects</div>
        <div class="cli-line">  <span class="cli-highlight">contact</span>   - Get direct developer contact info</div>
        <div class="cli-line">  <span class="cli-highlight">whoami</span>    - About the engineer</div>
        <div class="cli-line">  <span class="cli-highlight">uptime</span>    - Current production status</div>
        <div class="cli-line">  <span class="cli-highlight">clear</span>     - Clear terminal screen</div>
      `,
      skills: () => `
        <div class="cli-line"><span class="cli-highlight">Frontend:</span> React, Next.js 15, TypeScript, Tailwind, Three.js</div>
        <div class="cli-line"><span class="cli-highlight">Backend:</span> Node.js, Go, Express, GraphQL, REST, gRPC, WebSockets</div>
        <div class="cli-line"><span class="cli-highlight">Cloud/DB:</span> AWS, Docker, Kubernetes, PostgreSQL, Redis, MongoDB</div>
      `,
      projects: () => `
        <div class="cli-line">1. <span class="cli-highlight">DevFlow</span> — AI Developer Platform (Next.js/FastAPI)</div>
        <div class="cli-line">2. <span class="cli-highlight">NexusCloud</span> — Distributed Kubernetes Telemetry (Go/Prometheus)</div>
        <div class="cli-line">3. <span class="cli-highlight">PulsePay</span> — Global Fintech & Crypto Hub (Next.js/PostgreSQL)</div>
        <div class="cli-line">4. <span class="cli-highlight">OmniSync</span> — Real-Time Multiplayer Canvas (WASM/CRDT)</div>
        <div class="cli-line">5. <span class="cli-highlight">SentinelAI</span> — Cyber Threat SOC Radar (Python/Kafka)</div>
      `,
      contact: () => `
        <div class="cli-line">Email: <span class="cli-highlight">ahmedraza.dev@gmail.com</span></div>
        <div class="cli-line">GitHub: <a href="https://github.com" target="_blank" style="color: #38bdf8;">github.com/ahmedraza-dev</a></div>
        <div class="cli-line">LinkedIn: <a href="https://linkedin.com" target="_blank" style="color: #38bdf8;">linkedin.com/in/ahmedraza</a></div>
      `,
      whoami: () => `
        <div class="cli-line">Ahmed Raza — Senior Full Stack Developer & Distributed Systems Architect.</div>
        <div class="cli-line">5+ years shipping high-throughput web applications with 99.99% uptime.</div>
      `,
      uptime: () => `
        <div class="cli-line">System Uptime: 99.99% (All 14 microservices healthy)</div>
        <div class="cli-line">Avg Latency: 38ms | Active Region: us-east-1</div>
      `,
      clear: () => {
        cliOutput.innerHTML = '';
        return '';
      }
    };

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        if (!cmd) return;

        const cmdRow = document.createElement('div');
        cmdRow.className = 'cli-line';
        cmdRow.innerHTML = `<span class="cli-prompt">guest@ahmed:~$</span> <span>${cliInput.value}</span>`;
        cliOutput.appendChild(cmdRow);

        if (cmd === 'clear') {
          cliOutput.innerHTML = '';
        } else if (commandMap[cmd]) {
          const res = document.createElement('div');
          res.innerHTML = commandMap[cmd]();
          cliOutput.appendChild(res);
        } else {
          const err = document.createElement('div');
          err.className = 'cli-line text-muted';
          err.innerHTML = `zsh: command not found: ${cmd}. Type <span class="cli-highlight">'help'</span> for list of commands.`;
          cliOutput.appendChild(err);
        }

        cliInput.value = '';
        cliOutput.scrollTop = cliOutput.scrollHeight;
      }
    });
  }
}

/* ==========================================================================
   6. TECH STACK MATRIX FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.skillFilter;
      skillCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECTS SHOWCASE FILTER
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   8. PROJECT QUICK VIEW MODAL
   ========================================================================== */
const projectDetails = {
  devflow: {
    title: 'DevFlow — Intelligent AI Developer Workspace',
    category: 'Full Stack AI SaaS',
    image: 'assets/images/devflow.jpg',
    overview: 'DevFlow is an end-to-end cloud platform providing real-time AI code completion, automated workflow CI/CD pipelines, and microservice telemetry for modern software development teams.',
    architecture: [
      { title: 'Frontend Stack', desc: 'Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Monaco Editor' },
      { title: 'Backend & Inference', desc: 'Python FastAPI microservices with LangChain, async workers & streaming tokens' },
      { title: 'Data Persistence', desc: 'PostgreSQL with pgvector for semantic code search + Redis caching' },
      { title: 'Cloud & Scale', desc: 'Docker containers orchestrated on AWS ECS with auto-scaling triggers' }
    ],
    features: [
      'Sub-50ms token-streaming code recommendations',
      'Real-time automated code refactoring & security analysis',
      'Interactive workflow pipeline graph generator',
      'Team multiplayer code reviews with live comments'
    ],
    demoUrl: '#contact',
    githubUrl: 'https://github.com'
  },
  nexuscloud: {
    title: 'NexusCloud — Kubernetes Cluster Telemetry & Mesh',
    category: 'Cloud & Infrastructure',
    image: 'assets/images/nexuscloud.jpg',
    overview: 'High-performance distributed telemetry platform visualizing worldwide Kubernetes clusters, ingress traffic, pod health metrics, and automated failure recovery in real-time.',
    architecture: [
      { title: 'Core Telemetry Engine', desc: 'High-throughput Go (Golang) agents collecting 100k+ events/second' },
      { title: 'Ingress & Networking', desc: 'Envoy Proxy, gRPC stream channels with sub-10ms packet sync' },
      { title: 'Dashboard UI', desc: 'React, D3.js real-time topological mesh canvas, WebSockets' },
      { title: 'Alert Pipeline', desc: 'Prometheus metrics aggregation with automated Slack & PagerDuty triggers' }
    ],
    features: [
      'Zero packet loss distributed telemetry collection',
      'Automated pod crash recovery & memory leak diagnostics',
      'Real-time global geographic node latency map',
      'Custom threshold anomaly detection'
    ],
    demoUrl: '#contact',
    githubUrl: 'https://github.com'
  },
  pulsepay: {
    title: 'PulsePay — Global Digital Banking & Crypto Hub',
    category: 'Fintech & Web3',
    image: 'assets/images/pulsepay.jpg',
    overview: 'Institutional-grade financial payment gateway supporting multi-currency accounts, instant crypto liquidity settlement, and biometric authentication under strict PCI-DSS compliance.',
    architecture: [
      { title: 'Application Layer', desc: 'Next.js 14, Node.js cluster, Express, TypeScript' },
      { title: 'Financial Database', desc: 'PostgreSQL with 2-Phase Commit transactions & immutable audit logs' },
      { title: 'Settlement Engine', desc: 'Stripe API + Web3 EVM smart contract listeners with 0.12s finality' },
      { title: 'Security & Auth', desc: 'OAuth 2.0 PKCE, biometric WebAuthn, RSA-4096 transaction signing' }
    ],
    features: [
      'Multi-currency fiat and crypto instant swap engine',
      'Biometric and WebAuthn hardware key support',
      'Interactive financial analytics & spending forecasting',
      'PCI-DSS and SOC-2 Type II audit compliance'
    ],
    demoUrl: '#contact',
    githubUrl: 'https://github.com'
  },
  omnisync: {
    title: 'OmniSync — Collaborative Node Workflow Studio',
    category: 'Real-Time Multiplayer',
    image: 'assets/images/omnisync.jpg',
    overview: 'Multi-user real-time interactive canvas with CRDT conflict-free resolution, live audio-visual node pipelines, and instant cloud execution triggers.',
    architecture: [
      { title: 'Canvas Engine', desc: 'Custom HTML5 Canvas 2D / WebGL renderer running at solid 60 FPS' },
      { title: 'Multiplayer Sync', desc: 'Yjs CRDT over binary WebSockets with delta compression' },
      { title: 'Execution Runtime', desc: 'Rust compiled to WebAssembly (WASM) for ultra-fast local DAG evaluation' },
      { title: 'Audio & Presence', desc: 'WebRTC P2P mesh for live spatial cursor voice channels' }
    ],
    features: [
      'Conflict-free multi-user simultaneous editing with cursors',
      'Node-based data transformation pipeline builder',
      'Instant WebAssembly sandbox execution',
      'Live workflow export to cloud serverless functions'
    ],
    demoUrl: '#contact',
    githubUrl: 'https://github.com'
  },
  sentinel: {
    title: 'SentinelAI — Real-Time SOC Incident Radar',
    category: 'Cybersecurity Threat Intelligence',
    image: 'assets/images/sentinel.jpg',
    overview: 'Machine learning-driven cybersecurity platform mapping global attack surfaces, automated honeypot telemetry, and automated mitigation playbooks.',
    architecture: [
      { title: 'Data Streaming', desc: 'Apache Kafka pipeline ingesting 10M+ raw security logs per day' },
      { title: 'AI Anomaly Detector', desc: 'Python Isolation Forests & Graph Neural Networks on PyTorch' },
      { title: 'Search & Indexing', desc: 'ElasticSearch cluster with sub-second queries across terabytes of logs' },
      { title: 'Frontend UI', desc: 'Custom dark radar map visualizer with D3.js and Tailwind' }
    ],
    features: [
      'Global live threat radar and honeypot network telemetry',
      'Automated IP blacklisting and firewall mitigation triggers',
      'Incident severity triage with MITRE ATT&CK framework mapping',
      'Zero-day vulnerability predictive risk scoring'
    ],
    demoUrl: '#contact',
    githubUrl: 'https://github.com'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    const archHtml = data.architecture.map((item) => `
      <div class="arch-card">
        <h5>${item.title}</h5>
        <p>${item.desc}</p>
      </div>
    `).join('');

    const featHtml = data.features.map((f) => `
      <li style="margin-bottom: 0.4rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
        <i class="ri-checkbox-circle-fill" style="color: var(--accent-cyan);"></i>
        <span>${f}</span>
      </li>
    `).join('');

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-banner-img">
      <div class="modal-header-info">
        <div>
          <span class="section-tag" style="margin-bottom: 0.5rem;">${data.category}</span>
          <h3 class="modal-title">${data.title}</h3>
        </div>
        <div style="display: flex; gap: 0.6rem;">
          <a href="${data.demoUrl}" class="btn btn-primary btn-sm">
            <i class="ri-external-link-line"></i> Live Demo
          </a>
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <i class="ri-github-line"></i> GitHub Repo
          </a>
        </div>
      </div>
      
      <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem; margin-bottom: 1.5rem;">
        ${data.overview}
      </p>

      <h4 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: #fff;">
        <i class="ri-mind-map" style="color: var(--accent-purple);"></i> Technical Architecture Breakdown
      </h4>
      <div class="modal-arch-grid">
        ${archHtml}
      </div>

      <h4 style="font-size: 1.15rem; margin: 1.5rem 0 0.75rem 0; color: #fff;">
        <i class="ri-sparkling-fill" style="color: var(--accent-cyan);"></i> Key Production Features
      </h4>
      <ul style="list-style: none; padding: 0;">
        ${featHtml}
      </ul>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.dataset.project);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. 3D CARD TILT EFFECT
   ========================================================================== */
function init3DTilt() {
  const elements = document.querySelectorAll('.tilt-element');
  if (window.innerWidth < 768) return; // Skip on mobile

  elements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ==========================================================================
   10. SCROLLSPY & ACTIVE NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar background blur
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link update
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.dataset.nav === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   11. LIVE CLOCK & TIMEZONE
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' Local';
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   12. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const messageInput = document.getElementById('formMessage');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');

  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = `${messageInput.value.length} / 1000`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please provide your full name.';
        isValid = false;
      } else {
        nameError.textContent = '';
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageError.textContent = 'Please enter a message of at least 10 characters.';
        isValid = false;
      } else {
        messageError.textContent = '';
      }

      if (!isValid) return;

      // Submit State Simulation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i class="ri-loader-4-line ri-spin"></i>
        <span>Transmitting Encrypted Payload...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="btn-text">Transmit Message</span>
          <i class="ri-send-plane-fill btn-icon-send"></i>
        `;
        form.reset();
        if (charCount) charCount.textContent = '0 / 1000';
        showToast('🚀 Message received! I will reply within 2 hours.', 'success');
      }, 1400);
    });
  }
}

/* ==========================================================================
   13. ONE-CLICK COPY TO CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
      }
    });
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="${type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-information-fill'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 3500);
}

/* ==========================================================================
   14. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.getElementById('menuIcon');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuIcon.className = isOpen ? 'ri-close-line' : 'ri-menu-4-line';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuIcon.className = 'ri-menu-4-line';
      });
    });
  }
}

/* ==========================================================================
   15. INTERSECTION OBSERVER FOR STAGGERED REVEALS
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));
}
