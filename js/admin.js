/**
 * Portfolio Admin Panel
 * Content management system for portfolio website
 */

(function() {
  'use strict';

  // Admin state
  let isLoggedIn = false;
  let portfolioData = {};
  let hasUnsavedChanges = false;
  let currentEditingSkill = null;
  let currentEditingProject = null;
  let nextSkillId = 1;
  let nextProjectId = 1;

  // DOM elements
  const elements = {
    // Login
    loginModal: null,
    loginForm: null,
    adminInterface: null,

    // Navigation
    adminMenuItems: null,
    adminSections: null,

    // Publish controls
    draftStatus: null,
    statusText: null,
    publishBtn: null,

    // Form elements
    siteTitle: null,
    siteDescription: null,
    heroTitle: null,
    heroSubtitle: null,
    heroPhoto: null,
    heroPhotoPreview: null,
    aboutContent: null,
    contactEmail: null,
    contactLocation: null,
    linkedinInput: null,
    githubInput: null,
    twitterInput: null,

    // Theme controls
    primaryColor: null,
    secondaryColor: null,
    accentColor: null,
    defaultTheme: null,

    // Settings
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,

    // Skill management
    skillsManager: null,
    addSkillBtn: null,
    skillModal: null,
    skillForm: null,
    skillName: null,
    skillProficiency: null,
    skillColor: null,
    proficiencyValue: null,

    // Project management
    projectsManager: null,
    addProjectBtn: null,
    projectModal: null,
    projectForm: null,
    projectTitle: null,
    projectDescription: null,
    projectTags: null,
    projectThumbnail: null,
    projectVideo: null,
    projectLink: null,

    // Actions
    previewBtn: null,
    exportBtn: null,
    importBtn: null,
    importFile: null,
    logoutBtn: null,
    changePasswordBtn: null,
    resetThemeBtn: null,
    resetAllBtn: null,

    // Toast container
    toastContainer: null
  };

  /**
   * Initialize the admin panel
   */
  function init() {
    cacheElements();
    loadData();
    setupEventListeners();
    checkAuthStatus();
    
    console.log('Admin panel initialized');
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    // Login
    elements.loginModal = document.getElementById('login-modal');
    elements.loginForm = document.getElementById('login-form');
    elements.adminInterface = document.getElementById('admin-interface');

    // Navigation
    elements.adminMenuItems = document.querySelectorAll('.admin-menu-item');
    elements.adminSections = document.querySelectorAll('.admin-section');

    // Publish controls
    elements.draftStatus = document.getElementById('draft-status');
    elements.statusText = document.getElementById('status-text');
    elements.publishBtn = document.getElementById('publish-btn');

    // Form elements
    elements.siteTitle = document.getElementById('site-title-input');
    elements.siteDescription = document.getElementById('site-description-input');
    elements.heroTitle = document.getElementById('hero-title-input');
    elements.heroSubtitle = document.getElementById('hero-subtitle-input');
    elements.heroPhoto = document.getElementById('hero-photo-input');
    elements.heroPhotoPreview = document.getElementById('hero-photo-preview');
    elements.aboutContent = document.getElementById('about-content-input');
    elements.contactEmail = document.getElementById('contact-email-input');
    elements.contactLocation = document.getElementById('contact-location-input');
    elements.linkedinInput = document.getElementById('linkedin-input');
    elements.githubInput = document.getElementById('github-input');
    elements.twitterInput = document.getElementById('twitter-input');

    // Theme controls
    elements.primaryColor = document.getElementById('primary-color');
    elements.secondaryColor = document.getElementById('secondary-color');
    elements.accentColor = document.getElementById('accent-color');
    elements.defaultTheme = document.querySelectorAll('input[name="default-theme"]');

    // Settings
    elements.currentPassword = document.getElementById('current-password');
    elements.newPassword = document.getElementById('new-password');
    elements.confirmPassword = document.getElementById('confirm-password');

    // Skill management
    elements.skillsManager = document.getElementById('skills-manager');
    elements.addSkillBtn = document.getElementById('add-skill-btn');
    elements.skillModal = document.getElementById('skill-modal');
    elements.skillForm = document.getElementById('skill-form');
    elements.skillName = document.getElementById('skill-name');
    elements.skillProficiency = document.getElementById('skill-proficiency');
    elements.skillColor = document.getElementById('skill-color');
    elements.proficiencyValue = document.getElementById('proficiency-value');

    // Project management
    elements.projectsManager = document.getElementById('projects-manager');
    elements.addProjectBtn = document.getElementById('add-project-btn');
    elements.projectModal = document.getElementById('project-modal');
    elements.projectForm = document.getElementById('project-form');
    elements.projectTitle = document.getElementById('project-title');
    elements.projectDescription = document.getElementById('project-description');
    elements.projectTags = document.getElementById('project-tags');
    elements.projectThumbnail = document.getElementById('project-thumbnail');
    elements.projectVideo = document.getElementById('project-video');
    elements.projectLink = document.getElementById('project-link');

    // Actions
    elements.previewBtn = document.getElementById('preview-btn');
    elements.exportBtn = document.getElementById('export-btn');
    elements.importBtn = document.getElementById('import-btn');
    elements.importFile = document.getElementById('import-file');
    elements.logoutBtn = document.getElementById('logout-btn');
    elements.changePasswordBtn = document.getElementById('change-password-btn');
    elements.resetThemeBtn = document.getElementById('reset-theme-btn');
    elements.resetAllBtn = document.getElementById('reset-all-btn');

    // Toast container
    elements.toastContainer = document.getElementById('toast-container');
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Login
    if (elements.loginForm) {
      elements.loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    elements.adminMenuItems.forEach(item => {
      item.addEventListener('click', () => switchSection(item.dataset.section));
    });

    // Publish controls
    if (elements.publishBtn) {
      elements.publishBtn.addEventListener('click', publishChanges);
    }

    // Form changes
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('change', markAsChanged);
      input.addEventListener('input', markAsChanged);
    });

    // Photo upload
    if (elements.heroPhoto) {
      elements.heroPhoto.addEventListener('change', handlePhotoUpload);
    }

    // Theme controls
    if (elements.primaryColor) elements.primaryColor.addEventListener('change', updateThemePreview);
    if (elements.secondaryColor) elements.secondaryColor.addEventListener('change', updateThemePreview);
    if (elements.accentColor) elements.accentColor.addEventListener('change', updateThemePreview);

    // Skill management
    if (elements.addSkillBtn) {
      elements.addSkillBtn.addEventListener('click', () => openSkillModal());
    }
    if (elements.skillForm) {
      elements.skillForm.addEventListener('submit', handleSkillSave);
    }
    if (elements.skillProficiency) {
      elements.skillProficiency.addEventListener('input', updateProficiencyDisplay);
    }

    // Project management
    if (elements.addProjectBtn) {
      elements.addProjectBtn.addEventListener('click', () => openProjectModal());
    }
    if (elements.projectForm) {
      elements.projectForm.addEventListener('submit', handleProjectSave);
    }

    // Actions
    if (elements.previewBtn) {
      elements.previewBtn.addEventListener('click', () => window.open('/', '_blank'));
    }
    if (elements.exportBtn) {
      elements.exportBtn.addEventListener('click', exportData);
    }
    if (elements.importBtn) {
      elements.importBtn.addEventListener('click', () => elements.importFile.click());
    }
    if (elements.importFile) {
      elements.importFile.addEventListener('change', handleImport);
    }
    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener('click', logout);
    }
    if (elements.changePasswordBtn) {
      elements.changePasswordBtn.addEventListener('click', changePassword);
    }
    if (elements.resetThemeBtn) {
      elements.resetThemeBtn.addEventListener('click', resetTheme);
    }
    if (elements.resetAllBtn) {
      elements.resetAllBtn.addEventListener('click', resetAllData);
    }

    // Modal close handlers
    document.querySelectorAll('.modal-close').forEach(close => {
      close.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModals();
        }
      });
    });

    // Cancel buttons
    document.getElementById('cancel-skill-btn')?.addEventListener('click', closeModals);
    document.getElementById('cancel-project-btn')?.addEventListener('click', closeModals);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModals();
      }
    });
  }

  /**
   * Load data from localStorage
   */
  function loadData() {
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedData) {
      try {
        portfolioData = JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
        loadDefaultData();
      }
    } else {
      loadDefaultData();
    }

    // Set next IDs
    if (portfolioData.skills) {
      nextSkillId = Math.max(...portfolioData.skills.map(s => s.id), 0) + 1;
    }
    if (portfolioData.projects) {
      nextProjectId = Math.max(...portfolioData.projects.map(p => p.id), 0) + 1;
    }
  }

  /**
   * Load default data structure
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
        content: `<p>I'm a passionate full-stack developer with over 5 years of experience creating web applications that solve real-world problems. I specialize in modern JavaScript frameworks, cloud technologies, and user-centered design.</p>

<p>When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community.</p>

<h3>Achievements & Certifications</h3>
<ul>
<li>AWS Certified Solutions Architect</li>
<li>Google Cloud Professional Developer</li>
<li>React Specialist Certification</li>
<li>Contributing member to 10+ open source projects</li>
</ul>`
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
   * Check authentication status
   */
  function checkAuthStatus() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (isAuthenticated) {
      showAdminInterface();
    } else {
      showLoginModal();
    }
  }

  /**
   * Handle login
   */
  async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    const isValid = await validatePassword(password);
    
    if (isValid) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      showAdminInterface();
      showToast('Successfully logged in!', 'success');
    } else {
      showToast('Invalid password. Default password is: admin123', 'error');
    }
  }

  /**
   * Validate password
   */
  async function validatePassword(password) {
    const storedHash = localStorage.getItem('adminPasswordHash');
    
    if (!storedHash) {
      // Default password: admin123
      const defaultPassword = 'admin123';
      return password === defaultPassword;
    }
    
    // Hash the input password and compare
    const inputHash = await hashPassword(password);
    return inputHash === storedHash;
  }

  /**
   * Hash password using Web Crypto API
   */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'portfolio_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Show login modal
   */
  function showLoginModal() {
    isLoggedIn = false;
    elements.loginModal.classList.add('active');
    elements.adminInterface.style.display = 'none';
  }

  /**
   * Show admin interface
   */
  function showAdminInterface() {
    isLoggedIn = true;
    elements.loginModal.classList.remove('active');
    elements.adminInterface.style.display = 'block';
    populateFormData();
    updateDraftStatus();
  }

  /**
   * Logout
   */
  function logout() {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
        return;
      }
    }
    
    sessionStorage.removeItem('adminAuthenticated');
    showLoginModal();
    showToast('Logged out successfully', 'success');
  }

  /**
   * Switch admin section
   */
  function switchSection(sectionId) {
    // Update menu items
    elements.adminMenuItems.forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    elements.adminSections.forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(`${sectionId}-section`).classList.add('active');
  }

  /**
   * Populate form data
   */
  function populateFormData() {
    // General
    if (elements.siteTitle && portfolioData.general?.siteTitle) {
      elements.siteTitle.value = portfolioData.general.siteTitle;
    }
    if (elements.siteDescription && portfolioData.general?.siteDescription) {
      elements.siteDescription.value = portfolioData.general.siteDescription;
    }

    // Hero
    if (elements.heroTitle && portfolioData.hero?.title) {
      elements.heroTitle.value = portfolioData.hero.title;
    }
    if (elements.heroSubtitle && portfolioData.hero?.subtitle) {
      elements.heroSubtitle.value = portfolioData.hero.subtitle;
    }
    if (elements.heroPhotoPreview && portfolioData.hero?.photo) {
      elements.heroPhotoPreview.src = portfolioData.hero.photo;
    }

    // About
    if (elements.aboutContent && portfolioData.about?.content) {
      elements.aboutContent.value = portfolioData.about.content;
    }

    // Contact
    if (elements.contactEmail && portfolioData.contact?.email) {
      elements.contactEmail.value = portfolioData.contact.email;
    }
    if (elements.contactLocation && portfolioData.contact?.location) {
      elements.contactLocation.value = portfolioData.contact.location;
    }
    if (elements.linkedinInput && portfolioData.contact?.linkedin) {
      elements.linkedinInput.value = portfolioData.contact.linkedin;
    }
    if (elements.githubInput && portfolioData.contact?.github) {
      elements.githubInput.value = portfolioData.contact.github;
    }
    if (elements.twitterInput && portfolioData.contact?.twitter) {
      elements.twitterInput.value = portfolioData.contact.twitter;
    }

    // Theme
    if (portfolioData.theme) {
      if (elements.primaryColor && portfolioData.theme.primaryColor) {
        elements.primaryColor.value = portfolioData.theme.primaryColor;
      }
      if (elements.secondaryColor && portfolioData.theme.secondaryColor) {
        elements.secondaryColor.value = portfolioData.theme.secondaryColor;
      }
      if (elements.accentColor && portfolioData.theme.accentColor) {
        elements.accentColor.value = portfolioData.theme.accentColor;
      }
      if (elements.defaultTheme && portfolioData.theme.defaultTheme) {
        elements.defaultTheme.forEach(radio => {
          if (radio.value === portfolioData.theme.defaultTheme) {
            radio.checked = true;
          }
        });
      }
    }

    // Skills and Projects
    populateSkillsManager();
    populateProjectsManager();

    // Apply current theme
    updateThemePreview();
  }

  /**
   * Mark as changed
   */
  function markAsChanged() {
    if (!hasUnsavedChanges) {
      hasUnsavedChanges = true;
      updateDraftStatus();
    }
  }

  /**
   * Update draft status
   */
  function updateDraftStatus() {
    if (hasUnsavedChanges) {
      elements.statusText.textContent = 'You have unpublished changes';
      elements.draftStatus.querySelector('.status-indicator').classList.add('draft');
      elements.publishBtn.disabled = false;
    } else {
      elements.statusText.textContent = 'All changes published';
      elements.draftStatus.querySelector('.status-indicator').classList.remove('draft');
      elements.publishBtn.disabled = true;
    }
  }

  /**
   * Publish changes
   */
  function publishChanges() {
    try {
      collectFormData();
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      hasUnsavedChanges = false;
      updateDraftStatus();
      showToast('Changes published successfully!', 'success');
    } catch (error) {
      console.error('Error publishing changes:', error);
      showToast('Error publishing changes. Please try again.', 'error');
    }
  }

  /**
   * Collect form data
   */
  function collectFormData() {
    // General
    portfolioData.general = {
      siteTitle: elements.siteTitle?.value || '',
      siteDescription: elements.siteDescription?.value || ''
    };

    // Hero
    portfolioData.hero = {
      title: elements.heroTitle?.value || '',
      subtitle: elements.heroSubtitle?.value || '',
      photo: elements.heroPhotoPreview?.src || '/assets/default-photo.jpg'
    };

    // About
    portfolioData.about = {
      content: elements.aboutContent?.value || ''
    };

    // Contact
    portfolioData.contact = {
      email: elements.contactEmail?.value || '',
      location: elements.contactLocation?.value || '',
      linkedin: elements.linkedinInput?.value || '',
      github: elements.githubInput?.value || '',
      twitter: elements.twitterInput?.value || ''
    };

    // Theme
    const selectedTheme = document.querySelector('input[name="default-theme"]:checked')?.value || 'light';
    portfolioData.theme = {
      primaryColor: elements.primaryColor?.value || '#3B82F6',
      secondaryColor: elements.secondaryColor?.value || '#14B8A6',
      accentColor: elements.accentColor?.value || '#F97316',
      defaultTheme: selectedTheme
    };
  }

  /**
   * Handle photo upload
   */
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file is too large. Please select a file under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      elements.heroPhotoPreview.src = e.target.result;
      markAsChanged();
    };
    reader.readAsDataURL(file);
  }

  /**
   * Update theme preview
   */
  function updateThemePreview() {
    const root = document.documentElement;
    
    if (elements.primaryColor) {
      root.style.setProperty('--primary', elements.primaryColor.value);
    }
    if (elements.secondaryColor) {
      root.style.setProperty('--secondary', elements.secondaryColor.value);
    }
    if (elements.accentColor) {
      root.style.setProperty('--accent', elements.accentColor.value);
    }

    markAsChanged();
  }

  /**
   * Populate skills manager
   */
  function populateSkillsManager() {
    if (!elements.skillsManager) return;

    elements.skillsManager.innerHTML = '';

    if (portfolioData.skills && portfolioData.skills.length > 0) {
      portfolioData.skills.forEach(skill => {
        const skillElement = createSkillManagerItem(skill);
        elements.skillsManager.appendChild(skillElement);
      });
    } else {
      elements.skillsManager.innerHTML = '<div class="empty-state"><p>No skills added yet.</p></div>';
    }
  }

  /**
   * Create skill manager item
   */
  function createSkillManagerItem(skill) {
    const item = document.createElement('div');
    item.className = 'skill-manager-item';
    item.innerHTML = `
      <div class="skill-manager-info">
        <div class="skill-manager-name">${skill.name}</div>
        <div class="skill-manager-proficiency">${skill.proficiency}% proficiency</div>
      </div>
      <div class="skill-manager-actions">
        <button class="btn btn-secondary btn-icon" onclick="editSkill(${skill.id})" aria-label="Edit skill">✏️</button>
        <button class="btn btn-danger btn-icon" onclick="deleteSkill(${skill.id})" aria-label="Delete skill">🗑️</button>
      </div>
    `;
    return item;
  }

  /**
   * Open skill modal
   */
  function openSkillModal(skill = null) {
    currentEditingSkill = skill;
    
    if (skill) {
      document.getElementById('skill-modal-title').textContent = 'Edit Skill';
      elements.skillName.value = skill.name;
      elements.skillProficiency.value = skill.proficiency;
      elements.skillColor.value = skill.color;
      updateProficiencyDisplay();
    } else {
      document.getElementById('skill-modal-title').textContent = 'Add Skill';
      elements.skillForm.reset();
      elements.skillProficiency.value = 50;
      updateProficiencyDisplay();
    }
    
    elements.skillModal.classList.add('active');
  }

  /**
   * Update proficiency display
   */
  function updateProficiencyDisplay() {
    if (elements.proficiencyValue) {
      elements.proficiencyValue.textContent = elements.skillProficiency.value;
    }
  }

  /**
   * Handle skill save
   */
  function handleSkillSave(e) {
    e.preventDefault();
    
    const skillData = {
      name: elements.skillName.value.trim(),
      proficiency: parseInt(elements.skillProficiency.value),
      color: elements.skillColor.value
    };

    if (!skillData.name) {
      showToast('Please enter a skill name', 'error');
      return;
    }

    if (currentEditingSkill) {
      // Update existing skill
      const skillIndex = portfolioData.skills.findIndex(s => s.id === currentEditingSkill.id);
      if (skillIndex !== -1) {
        portfolioData.skills[skillIndex] = { ...currentEditingSkill, ...skillData };
      }
    } else {
      // Add new skill
      const newSkill = { id: nextSkillId++, ...skillData };
      portfolioData.skills.push(newSkill);
    }

    populateSkillsManager();
    closeModals();
    markAsChanged();
    showToast('Skill saved successfully!', 'success');
  }

  /**
   * Edit skill (global function for button onclick)
   */
  window.editSkill = function(skillId) {
    const skill = portfolioData.skills.find(s => s.id === skillId);
    if (skill) {
      openSkillModal(skill);
    }
  };

  /**
   * Delete skill (global function for button onclick)
   */
  window.deleteSkill = function(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
      portfolioData.skills = portfolioData.skills.filter(s => s.id !== skillId);
      populateSkillsManager();
      markAsChanged();
      showToast('Skill deleted successfully!', 'success');
    }
  };

  /**
   * Populate projects manager
   */
  function populateProjectsManager() {
    if (!elements.projectsManager) return;

    elements.projectsManager.innerHTML = '';

    if (portfolioData.projects && portfolioData.projects.length > 0) {
      portfolioData.projects.forEach(project => {
        const projectElement = createProjectManagerItem(project);
        elements.projectsManager.appendChild(projectElement);
      });
    } else {
      elements.projectsManager.innerHTML = '<div class="empty-state"><p>No projects added yet.</p></div>';
    }
  }

  /**
   * Create project manager item
   */
  function createProjectManagerItem(project) {
    const item = document.createElement('div');
    item.className = 'project-manager-item';
    item.innerHTML = `
      <div class="project-manager-info">
        <div class="project-manager-title">${project.title}</div>
        <div class="project-manager-tags">${project.tags.join(', ')}</div>
      </div>
      <div class="project-manager-actions">
        <button class="btn btn-secondary btn-icon" onclick="editProject(${project.id})" aria-label="Edit project">✏️</button>
        <button class="btn btn-danger btn-icon" onclick="deleteProject(${project.id})" aria-label="Delete project">🗑️</button>
      </div>
    `;
    return item;
  }

  /**
   * Open project modal
   */
  function openProjectModal(project = null) {
    currentEditingProject = project;
    
    if (project) {
      document.getElementById('project-modal-title').textContent = 'Edit Project';
      elements.projectTitle.value = project.title;
      elements.projectDescription.value = project.description;
      elements.projectTags.value = project.tags.join(', ');
      elements.projectVideo.value = project.videoUrl || '';
      elements.projectLink.value = project.projectLink || '';
    } else {
      document.getElementById('project-modal-title').textContent = 'Add Project';
      elements.projectForm.reset();
    }
    
    elements.projectModal.classList.add('active');
  }

  /**
   * Handle project save
   */
  function handleProjectSave(e) {
    e.preventDefault();
    
    const projectData = {
      title: elements.projectTitle.value.trim(),
      description: elements.projectDescription.value.trim(),
      tags: elements.projectTags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
      videoUrl: elements.projectVideo.value.trim(),
      projectLink: elements.projectLink.value.trim(),
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800' // Default thumbnail
    };

    if (!projectData.title) {
      showToast('Please enter a project title', 'error');
      return;
    }

    if (!projectData.description) {
      showToast('Please enter a project description', 'error');
      return;
    }

    // Handle thumbnail upload
    const thumbnailFile = elements.projectThumbnail.files[0];
    if (thumbnailFile) {
      if (!thumbnailFile.type.startsWith('image/')) {
        showToast('Please select a valid image file for thumbnail', 'error');
        return;
      }

      if (thumbnailFile.size > 5 * 1024 * 1024) {
        showToast('Thumbnail file is too large. Please select a file under 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        projectData.thumbnail = e.target.result;
        saveProject(projectData);
      };
      reader.readAsDataURL(thumbnailFile);
    } else {
      saveProject(projectData);
    }
  }

  /**
   * Save project data
   */
  function saveProject(projectData) {
    if (currentEditingProject) {
      // Update existing project
      const projectIndex = portfolioData.projects.findIndex(p => p.id === currentEditingProject.id);
      if (projectIndex !== -1) {
        portfolioData.projects[projectIndex] = { ...currentEditingProject, ...projectData };
      }
    } else {
      // Add new project
      const newProject = { id: nextProjectId++, ...projectData };
      portfolioData.projects.push(newProject);
    }

    populateProjectsManager();
    closeModals();
    markAsChanged();
    showToast('Project saved successfully!', 'success');
  }

  /**
   * Edit project (global function for button onclick)
   */
  window.editProject = function(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (project) {
      openProjectModal(project);
    }
  };

  /**
   * Delete project (global function for button onclick)
   */
  window.deleteProject = function(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
      portfolioData.projects = portfolioData.projects.filter(p => p.id !== projectId);
      populateProjectsManager();
      markAsChanged();
      showToast('Project deleted successfully!', 'success');
    }
  };

  /**
   * Export data
   */
  function exportData() {
    collectFormData();
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Portfolio data exported successfully!', 'success');
  }

  /**
   * Handle import
   */
  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      showToast('Please select a valid JSON file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!importedData || typeof importedData !== 'object') {
          throw new Error('Invalid data format');
        }

        // Confirm import
        if (confirm('This will replace all current data. Are you sure you want to continue?')) {
          portfolioData = importedData;
          
          // Update next IDs
          if (portfolioData.skills) {
            nextSkillId = Math.max(...portfolioData.skills.map(s => s.id), 0) + 1;
          }
          if (portfolioData.projects) {
            nextProjectId = Math.max(...portfolioData.projects.map(p => p.id), 0) + 1;
          }
          
          populateFormData();
          markAsChanged();
          showToast('Portfolio data imported successfully!', 'success');
        }
      } catch (error) {
        console.error('Import error:', error);
        showToast('Error importing data. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
  }

  /**
   * Change password
   */
  async function changePassword() {
    const currentPass = elements.currentPassword.value;
    const newPass = elements.newPassword.value;
    const confirmPass = elements.confirmPassword.value;

    if (!currentPass || !newPass || !confirmPass) {
      showToast('Please fill in all password fields', 'error');
      return;
    }

    if (newPass !== confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPass.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    // Validate current password
    const isValid = await validatePassword(currentPass);
    if (!isValid) {
      showToast('Current password is incorrect', 'error');
      return;
    }

    // Hash and save new password
    const newHash = await hashPassword(newPass);
    localStorage.setItem('adminPasswordHash', newHash);

    // Clear form
    elements.currentPassword.value = '';
    elements.newPassword.value = '';
    elements.confirmPassword.value = '';

    showToast('Password changed successfully!', 'success');
  }

  /**
   * Reset theme
   */
  function resetTheme() {
    if (confirm('Reset theme colors to default values?')) {
      elements.primaryColor.value = '#3B82F6';
      elements.secondaryColor.value = '#14B8A6';
      elements.accentColor.value = '#F97316';
      
      elements.defaultTheme.forEach(radio => {
        radio.checked = radio.value === 'light';
      });
      
      updateThemePreview();
      showToast('Theme reset to defaults', 'success');
    }
  }

  /**
   * Reset all data
   */
  function resetAllData() {
    const confirmText = 'RESET';
    const userInput = prompt(`This will permanently delete all your portfolio data and restore defaults.\n\nType "${confirmText}" to confirm:`);
    
    if (userInput === confirmText) {
      loadDefaultData();
      localStorage.removeItem('portfolioData');
      populateFormData();
      hasUnsavedChanges = false;
      updateDraftStatus();
      showToast('All data reset to defaults', 'success');
    }
  }

  /**
   * Close all modals
   */
  function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
    currentEditingSkill = null;
    currentEditingProject = null;
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Warn about unsaved changes when leaving
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();