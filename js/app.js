/**
 * Portfolio Website Main Application
 * Client-side functionality for the portfolio website
 */

(function() {
  'use strict';

  // Application state
  let portfolioData = {};
  let isAnimationsEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM elements
  const elements = {
    // Navigation
    navbar: null,
    hamburger: null,
    navMenu: null,
    navLinks: null,
    themeToggle: null,
    themeIcon: null,

    // Content sections
    heroTitle: null,
    heroSubtitle: null,
    heroPhoto: null,
    skillsPreview: null,
    aboutText: null,
    skillsList: null,
    projectsGrid: null,
    contactEmail: null,
    contactLocation: null,
    socialLinks: null,
    contactForm: null,
    footerName: null,

    // Modal
    projectModal: null,
    modalBody: null,
    modalClose: null,

    // Toast container
    toastContainer: null
  };

  /**
   * Initialize the application
   */
  function init() {
    cacheElements();
    loadPortfolioData();
    setupEventListeners();
    initTheme();
    populateContent();
    
    if (isAnimationsEnabled) {
      initAnimations();
    }
    
    console.log('Portfolio website initialized');
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    // Navigation
    elements.navbar = document.getElementById('navbar');
    elements.hamburger = document.getElementById('hamburger');
    elements.navMenu = document.getElementById('nav-menu');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.themeIcon = elements.themeToggle?.querySelector('.theme-icon');

    // Content sections
    elements.heroTitle = document.getElementById('hero-title');
    elements.heroSubtitle = document.getElementById('hero-subtitle');
    elements.heroPhoto = document.getElementById('hero-photo');
    elements.skillsPreview = document.getElementById('skills-preview');
    elements.aboutText = document.getElementById('about-text');
    elements.skillsList = document.getElementById('skills-list');
    elements.projectsGrid = document.getElementById('projects-grid');
    elements.contactEmail = document.getElementById('contact-email');
    elements.contactLocation = document.getElementById('contact-location');
    elements.socialLinks = document.getElementById('social-links');
    elements.contactForm = document.getElementById('contact-form');
    elements.footerName = document.getElementById('footer-name');

    // Modal
    elements.projectModal = document.getElementById('project-modal');
    elements.modalBody = document.getElementById('modal-body');
    elements.modalClose = elements.projectModal?.querySelector('.modal-close');

    // Toast container
    elements.toastContainer = document.getElementById('toast-container');
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    if (elements.hamburger) {
      elements.hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    // Contact form
    if (elements.contactForm) {
      elements.contactForm.addEventListener('submit', handleContactForm);
    }

    // Project modal
    if (elements.modalClose) {
      elements.modalClose.addEventListener('click', closeProjectModal);
    }

    if (elements.projectModal) {
      elements.projectModal.addEventListener('click', (e) => {
        if (e.target === elements.projectModal) {
          closeProjectModal();
        }
      });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);

    // Window resize
    window.addEventListener('resize', handleResize);
  }

  /**
   * Load portfolio data from localStorage or use defaults
   */
  function loadPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedData) {
      try {
        portfolioData = JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved portfolio data:', error);
        loadDefaultData();
      }
    } else {
      loadDefaultData();
    }
  }

  /**
   * Load default portfolio data
   */
  function loadDefaultData() {
    portfolioData = {
      general: {
        siteTitle: 'John Doe',
        siteDescription: 'Full Stack Developer specializing in modern web technologies. View my portfolio and get in touch.'
      },
      hero: {
        title: 'Full Stack Developer',
        subtitle: 'Creating digital experiences that inspire and engage',
        photo: '/assets/default-photo.jpg'
      },
      about: {
        content: `
          <p>I'm a passionate full-stack developer with over 5 years of experience creating web applications that solve real-world problems. I specialize in modern JavaScript frameworks, cloud technologies, and user-centered design.</p>
          
          <p>When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community.</p>
          
          <h3>Achievements & Certifications</h3>
          <ul>
            <li>AWS Certified Solutions Architect</li>
            <li>Google Cloud Professional Developer</li>
            <li>React Specialist Certification</li>
            <li>Contributing member to 10+ open source projects</li>
          </ul>
        `
      },
      skills: [
        { id: 1, name: 'JavaScript', proficiency: 95, color: '#F7DF1E' },
        { id: 2, name: 'React', proficiency: 90, color: '#61DAFB' },
        { id: 3, name: 'Node.js', proficiency: 85, color: '#339933' },
        { id: 4, name: 'Python', proficiency: 80, color: '#3776AB' },
        { id: 5, name: 'AWS', proficiency: 75, color: '#FF9900' },
        { id: 6, name: 'Docker', proficiency: 70, color: '#2496ED' }
      ],
      projects: [
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
          tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          projectLink: 'https://github.com/johndoe/ecommerce'
        },
        {
          id: 2,
          title: 'Task Management App',
          description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
          tags: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
          thumbnail: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: 'https://vimeo.com/123456789',
          projectLink: 'https://github.com/johndoe/taskmanager'
        },
        {
          id: 3,
          title: 'Weather Dashboard',
          description: 'A responsive weather dashboard that provides current conditions and forecasts using multiple weather APIs with beautiful data visualizations.',
          tags: ['JavaScript', 'Chart.js', 'OpenWeather API', 'CSS Grid'],
          thumbnail: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: '',
          projectLink: 'https://github.com/johndoe/weather-dashboard'
        }
      ],
      contact: {
        email: 'john@example.com',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe'
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#14B8A6',
        accentColor: '#F97316',
        defaultTheme: 'light'
      }
    };
  }

  /**
   * Initialize theme
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || portfolioData.theme?.defaultTheme || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Apply custom colors if available
    if (portfolioData.theme) {
      applyCustomColors(portfolioData.theme);
    }
  }

  /**
   * Apply custom theme colors
   */
  function applyCustomColors(theme) {
    const root = document.documentElement;
    
    if (theme.primaryColor) {
      root.style.setProperty('--primary', theme.primaryColor);
    }
    if (theme.secondaryColor) {
      root.style.setProperty('--secondary', theme.secondaryColor);
    }
    if (theme.accentColor) {
      root.style.setProperty('--accent', theme.accentColor);
    }
  }

  /**
   * Toggle theme
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  /**
   * Update theme icon
   */
  function updateThemeIcon(theme) {
    if (elements.themeIcon) {
      elements.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.hamburger.classList.toggle('active');
  }

  /**
   * Handle navigation clicks
   */
  function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu if open
    elements.navMenu.classList.remove('active');
    elements.hamburger.classList.remove('active');
  }

  /**
   * Handle contact form submission
   */
  function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Create mailto link
    const mailtoLink = `mailto:${portfolioData.contact.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message
    showToast('Email client opened! If you prefer to use a web form, see the integration options in the README.', 'success');
    
    // Reset form
    e.target.reset();
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    const scrolled = window.pageYOffset;
    
    // Add/remove navbar background
    if (scrolled > 50) {
      elements.navbar.classList.add('scrolled');
    } else {
      elements.navbar.classList.remove('scrolled');
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
      elements.navMenu.classList.remove('active');
      elements.hamburger.classList.remove('active');
    }
  }

  /**
   * Populate content with portfolio data
   */
  function populateContent() {
    // Update document title
    if (portfolioData.general?.siteTitle) {
      document.title = `${portfolioData.general.siteTitle} - Portfolio`;
      if (elements.footerName) {
        elements.footerName.textContent = portfolioData.general.siteTitle;
      }
    }

    // Update meta description
    if (portfolioData.general?.siteDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', portfolioData.general.siteDescription);
      }
    }

    // Hero section
    if (portfolioData.hero) {
      if (elements.heroTitle && portfolioData.hero.title) {
        elements.heroTitle.textContent = portfolioData.hero.title;
      }
      if (elements.heroSubtitle && portfolioData.hero.subtitle) {
        elements.heroSubtitle.textContent = portfolioData.hero.subtitle;
      }
      if (elements.heroPhoto && portfolioData.hero.photo) {
        elements.heroPhoto.src = portfolioData.hero.photo;
      }
    }

    // About section
    if (elements.aboutText && portfolioData.about?.content) {
      elements.aboutText.innerHTML = portfolioData.about.content;
    }

    // Skills
    if (portfolioData.skills) {
      populateSkills();
      populateSkillsPreview();
    }

    // Projects
    if (portfolioData.projects) {
      populateProjects();
    }

    // Contact
    if (portfolioData.contact) {
      populateContact();
    }
  }

  /**
   * Populate skills section
   */
  function populateSkills() {
    if (!elements.skillsList) return;

    elements.skillsList.innerHTML = '';

    portfolioData.skills.forEach(skill => {
      const skillElement = createSkillElement(skill);
      elements.skillsList.appendChild(skillElement);
    });

    // Animate skill bars when they come into view
    if (isAnimationsEnabled) {
      animateSkillBars();
    }
  }

  /**
   * Create skill element
   */
  function createSkillElement(skill) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item fade-in';
    
    skillItem.innerHTML = `
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-percentage">${skill.proficiency}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" style="background-color: ${skill.color}; width: 0%;" data-width="${skill.proficiency}%"></div>
      </div>
    `;

    return skillItem;
  }

  /**
   * Populate skills preview in hero section
   */
  function populateSkillsPreview() {
    if (!elements.skillsPreview) return;

    elements.skillsPreview.innerHTML = '';

    // Show top 4 skills
    const topSkills = portfolioData.skills
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 4);

    topSkills.forEach(skill => {
      const skillPreview = document.createElement('div');
      skillPreview.className = 'skill-preview';
      skillPreview.innerHTML = `
        <div class="skill-preview-header">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-percentage">${skill.proficiency}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" style="background-color: ${skill.color}; width: 0%;" data-width="${skill.proficiency}%"></div>
        </div>
      `;
      elements.skillsPreview.appendChild(skillPreview);
    });

    // Animate preview skill bars
    if (isAnimationsEnabled) {
      setTimeout(() => {
        const previewBars = elements.skillsPreview.querySelectorAll('.skill-fill');
        previewBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }, 500);
    }
  }

  /**
   * Populate projects section
   */
  function populateProjects() {
    if (!elements.projectsGrid) return;

    elements.projectsGrid.innerHTML = '';

    portfolioData.projects.forEach(project => {
      const projectElement = createProjectElement(project);
      elements.projectsGrid.appendChild(projectElement);
    });
  }

  /**
   * Create project element
   */
  function createProjectElement(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card scale-in';
    projectCard.addEventListener('click', () => openProjectModal(project));

    const tagsHtml = project.tags.map(tag => 
      `<span class="project-tag">${tag}</span>`
    ).join('');

    projectCard.innerHTML = `
      <img src="${project.thumbnail}" alt="${project.title}" class="project-image" loading="lazy">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-actions">
          <button class="btn btn-primary btn-small">View Demo</button>
          ${project.projectLink ? `<a href="${project.projectLink}" target="_blank" rel="noopener" class="btn btn-secondary btn-small" onclick="event.stopPropagation()">View Code</a>` : ''}
        </div>
      </div>
    `;

    return projectCard;
  }

  /**
   * Populate contact section
   */
  function populateContact() {
    if (elements.contactEmail && portfolioData.contact.email) {
      elements.contactEmail.textContent = portfolioData.contact.email;
      elements.contactEmail.href = `mailto:${portfolioData.contact.email}`;
    }

    if (elements.contactLocation && portfolioData.contact.location) {
      elements.contactLocation.textContent = portfolioData.contact.location;
    }

    if (elements.socialLinks) {
      const socialLinksHtml = [];
      
      if (portfolioData.contact.linkedin) {
        socialLinksHtml.push(`<a href="${portfolioData.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
      }
      if (portfolioData.contact.github) {
        socialLinksHtml.push(`<a href="${portfolioData.contact.github}" target="_blank" rel="noopener">GitHub</a>`);
      }
      if (portfolioData.contact.twitter) {
        socialLinksHtml.push(`<a href="${portfolioData.contact.twitter}" target="_blank" rel="noopener">Twitter</a>`);
      }
      
      elements.socialLinks.innerHTML = socialLinksHtml.join('');
    }
  }

  /**
   * Open project modal
   */
  function openProjectModal(project) {
    if (!elements.projectModal || !elements.modalBody) return;

    const tagsHtml = project.tags.map(tag => 
      `<span class="project-tag">${tag}</span>`
    ).join('');

    let videoHtml = '';
    if (project.videoUrl) {
      if (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')) {
        const videoId = extractYouTubeId(project.videoUrl);
        videoHtml = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      } else if (project.videoUrl.includes('vimeo.com')) {
        const videoId = extractVimeoId(project.videoUrl);
        videoHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        videoHtml = `<video controls><source src="${project.videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }
    }

    elements.modalBody.innerHTML = `
      <h2>${project.title}</h2>
      ${videoHtml ? `<div class="project-video">${videoHtml}</div>` : ''}
      <img src="${project.thumbnail}" alt="${project.title}" class="project-modal-image" style="width: 100%; border-radius: var(--radius-md); margin: var(--space-lg) 0;">
      <p>${project.description}</p>
      <div class="project-tags" style="margin: var(--space-md) 0;">${tagsHtml}</div>
      <div class="project-modal-actions" style="display: flex; gap: var(--space-md); margin-top: var(--space-lg);">
        ${project.projectLink ? `<a href="${project.projectLink}" target="_blank" rel="noopener" class="btn btn-primary">View Project</a>` : ''}
        <button class="btn btn-secondary" onclick="document.getElementById('project-modal').classList.remove('active')">Close</button>
      </div>
    `;

    elements.projectModal.classList.add('active');
  }

  /**
   * Close project modal
   */
  function closeProjectModal() {
    elements.projectModal.classList.remove('active');
  }

  /**
   * Extract YouTube video ID from URL
   */
  function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  /**
   * Extract Vimeo video ID from URL
   */
  function extractVimeoId(url) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Show toast notification
   */
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  /**
   * Initialize GSAP animations
   */
  function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.from('.hero-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    });

    gsap.from('.hero-subtitle', {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.2,
      ease: 'power2.out'
    });

    gsap.from('.hero-buttons', {
      duration: 1,
      y: 20,
      opacity: 0,
      delay: 0.4,
      ease: 'power2.out'
    });

    gsap.from('.profile-photo', {
      duration: 1.2,
      scale: 0.8,
      opacity: 0,
      delay: 0.3,
      ease: 'back.out(1.7)'
    });

    // Section animations
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 80%'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out'
      });
    });

    // Stagger animations for cards and items
    gsap.utils.toArray('.project-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        },
        duration: 0.6,
        y: 50,
        opacity: 0,
        delay: index * 0.1,
        ease: 'power2.out'
      });

      // Hover animations
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          duration: 0.3,
          y: -8,
          scale: 1.02,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.3,
          y: 0,
          scale: 1,
          ease: 'power2.out'
        });
      });
    });

    // Navigation link hover animations
    elements.navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          duration: 0.2,
          y: -2,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          duration: 0.2,
          y: 0,
          ease: 'power2.out'
        });
      });
    });

    // Skills preview animation
    gsap.from('.skills-preview', {
      scrollTrigger: {
        trigger: '.skills-preview',
        start: 'top 85%'
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    });
  }

  /**
   * Animate skill bars
   */
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skills-list .skill-fill');
    
    skillBars.forEach((bar, index) => {
      gsap.from(bar, {
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%'
        },
        duration: 1.2,
        width: 0,
        delay: index * 0.1,
        ease: 'power2.out',
        onComplete: () => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        }
      });
    });
  }

  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();