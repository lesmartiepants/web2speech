/**
 * Web2Speech - Frontend JavaScript
 * Mobile-first, accessible, and performant
 */

class Web2Speech {
  constructor() {
    this.currentTab = 'url';
    this.isProcessing = false;
    this.audioContext = null;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupEventListeners();
    this.setupServiceWorker();
    this.setupThemeToggle();
    this.initializeAudioContext();
    this.setupFileUpload();
    this.setupRangeInputs();
    
    console.log('Web2Speech initialized successfully');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTabClick(e));
    });

    // Generate speech button
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.addEventListener('click', () => this.handleGenerate());

    // Paste button
    const pasteBtn = document.querySelector('.input-action-btn');
    if (pasteBtn) {
      pasteBtn.addEventListener('click', () => this.handlePaste());
    }

    // Audio controls
    const downloadBtn = document.querySelector('.download-btn');
    const shareBtn = document.querySelector('.share-btn');
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.handleDownload());
    }
    
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.handleShare());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Form validation
    this.setupFormValidation();
  }

  /**
   * Handle tab switching
   */
  handleTabClick(e) {
    const button = e.currentTarget;
    const tabId = button.dataset.tab;
    
    if (tabId === this.currentTab) return;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    
    // Update panels
    document.querySelectorAll('.input-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tabId}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    
    this.currentTab = tabId;
    
    // Focus the main input in the new tab
    this.focusTabInput(tabId);
    
    // Announce to screen readers
    this.announceTabChange(tabId);
  }

  /**
   * Focus the main input element in the active tab
   */
  focusTabInput(tabId) {
    const inputs = {
      'url': '#url-input',
      'pdf': '#pdf-input',
      'text': '#text-input'
    };
    
    const input = document.querySelector(inputs[tabId]);
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  /**
   * Announce tab change to screen readers
   */
  announceTabChange(tabId) {
    const announcements = {
      'url': 'URL input selected',
      'pdf': 'PDF upload selected', 
      'text': 'Text input selected'
    };
    
    this.showToast(announcements[tabId], 'info', 2000);
  }

  /**
   * Handle paste from clipboard
   */
  async handlePaste() {
    try {
      if (!navigator.clipboard) {
        this.showToast('Clipboard not supported in this browser', 'warning');
        return;
      }
      
      const text = await navigator.clipboard.readText();
      const urlInput = document.getElementById('url-input');
      
      if (urlInput && text) {
        urlInput.value = text;
        urlInput.focus();
        this.showToast('Pasted from clipboard', 'success');
        
        // Validate URL
        this.validateUrl(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      this.showToast('Failed to paste from clipboard', 'error');
    }
  }

  /**
   * Validate URL input
   */
  validateUrl(url) {
    const urlInput = document.getElementById('url-input');
    
    try {
      new URL(url);
      urlInput.setCustomValidity('');
      urlInput.classList.remove('invalid');
    } catch {
      urlInput.setCustomValidity('Please enter a valid URL');
      urlInput.classList.add('invalid');
    }
  }

  /**
   * Handle speech generation
   */
  async handleGenerate() {
    if (this.isProcessing) return;
    
    const content = this.getInputContent();
    
    if (!content) {
      this.showToast('Please provide content to convert to speech', 'warning');
      return;
    }
    
    try {
      this.isProcessing = true;
      this.showLoading(true);
      this.updateGenerateButton(true);
      
      // Simulate API call (replace with actual API integration)
      const audioData = await this.processContent(content);
      
      if (audioData) {
        this.displayAudio(audioData);
        this.showToast('Speech generated successfully!', 'success');
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      this.showToast('Failed to generate speech. Please try again.', 'error');
    } finally {
      this.isProcessing = false;
      this.showLoading(false);
      this.updateGenerateButton(false);
    }
  }

  /**
   * Get content from the active input
   */
  getInputContent() {
    switch (this.currentTab) {
      case 'url':
        const url = document.getElementById('url-input').value.trim();
        return url ? { type: 'url', content: url } : null;
        
      case 'pdf':
        const file = document.getElementById('pdf-input').files[0];
        return file ? { type: 'pdf', content: file } : null;
        
      case 'text':
        const text = document.getElementById('text-input').value.trim();
        return text ? { type: 'text', content: text } : null;
        
      default:
        return null;
    }
  }

  /**
   * Process content (mock implementation)
   */
  async processContent(contentData) {
    // Simulate API processing time
    await this.delay(2000 + Math.random() * 2000);
    
    // Mock response - in real implementation, this would call the backend API
    return {
      audioUrl: this.generateMockAudioUrl(),
      duration: 120,
      format: 'mp3',
      filename: `web2speech-${Date.now()}.mp3`
    };
  }

  /**
   * Generate a mock audio URL (replace with actual audio from API)
   */
  generateMockAudioUrl() {
    // This creates a simple tone for demo purposes
    // In production, this would be the URL from your TTS API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    // Return a blob URL for demo purposes
    return 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjU3LjEwMAA';
  }

  /**
   * Display the generated audio
   */
  displayAudio(audioData) {
    const audioSection = document.querySelector('.audio-section');
    const audioElement = document.querySelector('.audio-element');
    const audioSource = audioElement.querySelector('source');
    
    if (audioSource) {
      audioSource.src = audioData.audioUrl;
      audioElement.load();
    }
    
    audioSection.classList.remove('hidden');
    audioElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Store audio data for download
    this.currentAudioData = audioData;
  }

  /**
   * Handle audio download
   */
  handleDownload() {
    if (!this.currentAudioData) {
      this.showToast('No audio to download', 'warning');
      return;
    }
    
    const link = document.createElement('a');
    link.href = this.currentAudioData.audioUrl;
    link.download = this.currentAudioData.filename;
    link.click();
    
    this.showToast('Download started', 'success');
  }

  /**
   * Handle audio sharing
   */
  async handleShare() {
    if (!this.currentAudioData) {
      this.showToast('No audio to share', 'warning');
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Speech - Web2Speech',
          text: 'Check out this generated speech from Web2Speech',
          url: window.location.href
        });
        
        this.showToast('Shared successfully', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Sharing failed:', err);
          this.fallbackShare();
        }
      }
    } else {
      this.fallbackShare();
    }
  }

  /**
   * Fallback sharing method
   */
  async fallbackShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showToast('Link copied to clipboard', 'success');
    } catch {
      this.showToast('Sharing not supported', 'warning');
    }
  }

  /**
   * Setup file upload functionality
   */
  setupFileUpload() {
    const dropZone = document.getElementById('pdf-drop-zone');
    const fileInput = document.getElementById('pdf-input');
    
    if (!dropZone || !fileInput) return;
    
    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files.find(file => file.type === 'application/pdf');
      
      if (pdfFile) {
        fileInput.files = e.dataTransfer.files;
        this.handleFileSelection(pdfFile);
      } else {
        this.showToast('Please select a PDF file', 'warning');
      }
    });
    
    // File selection
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    });
  }

  /**
   * Handle file selection
   */
  handleFileSelection(file) {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showToast('File size too large. Maximum 10MB allowed.', 'error');
      return;
    }
    
    // Update UI to show selected file
    const uploadContent = document.querySelector('.file-upload-content');
    if (uploadContent) {
      uploadContent.innerHTML = `
        <svg class="upload-icon" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M28 8v12h12" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="24" cy="24" r="3" fill="currentColor"/>
        </svg>
        <div class="upload-text">
          <span class="upload-primary">${file.name}</span>
          <span class="upload-secondary">${this.formatFileSize(file.size)}</span>
        </div>
      `;
    }
    
    this.showToast('PDF selected successfully', 'success');
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Setup range input interactions
   */
  setupRangeInputs() {
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    
    if (speedSlider && speedValue) {
      speedSlider.addEventListener('input', (e) => {
        speedValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
      });
    }
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    const urlInput = document.getElementById('url-input');
    const textInput = document.getElementById('text-input');
    
    if (urlInput) {
      urlInput.addEventListener('blur', (e) => {
        if (e.target.value) {
          this.validateUrl(e.target.value);
        }
      });
    }
    
    if (textInput) {
      textInput.addEventListener('input', (e) => {
        const maxLength = 10000;
        const remaining = maxLength - e.target.value.length;
        
        // You could add a character counter here
        if (remaining < 0) {
          e.target.setCustomValidity(`Text exceeds maximum length by ${Math.abs(remaining)} characters`);
        } else {
          e.target.setCustomValidity('');
        }
      });
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboard(e) {
    // Ctrl/Cmd + Enter to generate speech
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.handleGenerate();
    }
    
    // Tab navigation with arrow keys
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      this.navigateTabs(e.key === 'ArrowRight' ? 1 : -1);
    }
  }

  /**
   * Navigate tabs with keyboard
   */
  navigateTabs(direction) {
    const tabs = ['url', 'pdf', 'text'];
    const currentIndex = tabs.indexOf(this.currentTab);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = tabs.length - 1;
    if (newIndex >= tabs.length) newIndex = 0;
    
    const newTabButton = document.querySelector(`[data-tab="${tabs[newIndex]}"]`);
    if (newTabButton) {
      newTabButton.click();
    }
  }

  /**
   * Setup theme toggle
   */
  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.showToast(`${isDark ? 'Dark' : 'Light'} theme enabled`, 'info');
      });
      
      // Load saved theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      }
    }
  }

  /**
   * Setup service worker for PWA functionality
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  /**
   * Initialize audio context for better audio handling
   */
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  /**
   * Show loading state
   */
  showLoading(show) {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      if (show) {
        loadingOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        loadingOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  }

  /**
   * Update generate button state
   */
  updateGenerateButton(isLoading) {
    const generateBtn = document.querySelector('.generate-btn');
    const btnIcon = generateBtn.querySelector('.btn-icon');
    
    if (isLoading) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; margin: 0;"></div>
        Processing...
      `;
    } else {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2a8 8 0 108 8c0-.3 0-.6-.1-.9A5.5 5.5 0 015.1 4.1c.3 0 .6-.1.9-.1z"/>
        </svg>
        Generate Speech
      `;
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        ${message}
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.removeToast(toast));
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => this.removeToast(toast), duration);
    
    // Announce to screen readers
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
  }

  /**
   * Remove toast notification
   */
  removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  /**
   * Utility: Delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Web2Speech();
  });
} else {
  new Web2Speech();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Web2Speech;
}