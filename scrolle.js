document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('sectionsContainer');
  const sections = document.querySelectorAll('section');
  const homeNav = document.getElementById('homeNav');

  let currentSection = 0;
  let isAnimating = false;
  const GAP_SIZE = 150; 

  // ===== YOUR PREFERENCES ===== //
  const SWIPE_THRESHOLD = 100;
  const WHEEL_THRESHOLD = 60;
  const EDGE_BUFFER = 5;
  const SCROLL_DURATION = 800;
  const EASING = 'cubic-bezier(0.3, 1, 0.5, 1)';

  // Store actual section positions for precise scrolling
  let sectionOffsets = [];

  // Initialize
  setupScrollableSections();
  calculateSectionPositions();
  updatePosition();

  function setupScrollableSections() {
    sections.forEach(section => {
      const content = section.querySelector('.section-content') || document.createElement('div');
      if (!section.querySelector('.section-content')) {
        content.className = 'section-content';
        while (section.firstChild) {
          content.appendChild(section.firstChild);
        }
        section.appendChild(content);
      }
      // Ensure tall sections are scrollable
      if (section.classList.contains('tall-section')) {
        content.style.overscrollBehavior = 'none';
      }
    });
  }
homeNav.addEventListener('click', () => {
  sectionsContainer.style.display = 'flex';
  careerPage.style.display = 'none';
  scrollToSection(0); // Scroll to home section
}); 
  // NEW: Calculate actual section positions accounting for margins/padding
  function calculateSectionPositions() {
    sectionOffsets = [];
    let cumulativeOffset = 0;
    
    sections.forEach((section, index) => {
      sectionOffsets.push(cumulativeOffset);
      
      // Get the actual height including margins/padding
      const rect = section.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(section);
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginBottom = parseFloat(computedStyle.marginBottom);
      
      // Add section height + margins + gap
      cumulativeOffset += rect.height + marginTop + marginBottom;
      
      // Add gap except for last section
      if (index < sections.length - 1) {
        cumulativeOffset += GAP_SIZE;
      }
    });
  }

  // UPDATED: Use actual positions instead of calculated percentages
  function updatePosition() {
    const targetOffset = sectionOffsets[currentSection] || 0;
    container.style.transform = `translateY(-${targetOffset}px)`;
  }

  function scrollToSection(index) {
  if (isAnimating || index < 0 || index >= sections.length) return;
  
  isAnimating = true;
  currentSection = index;
  const content = sections[currentSection].querySelector('.section-content');
  if (content) content.scrollTop = 0;
  
  menuOverlay.classList.remove('active');
  
  container.style.transition = `transform ${SCROLL_DURATION}ms ${EASING}`;
  updatePosition();
  
  setTimeout(() => {
    isAnimating = false;
    container.style.transition = 'none';
  }, SCROLL_DURATION);
} 

// Menu navigation for other sections
document.querySelectorAll('.menu-item:not(#careerLink)').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    sectionsContainer.style.display = 'flex';
    careerPage.style.display = 'none';
    const sectionIndex = parseInt(this.getAttribute('data-section'));
    scrollToSection(sectionIndex);
  });
});

  // IMPROVED: Touch handling with better edge detection
  let touchStartY = 0;
  let isDragging = false;

  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    isDragging = true;
    container.style.transition = 'none';
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging || isAnimating) return;
    
    const touchY = e.touches[0].clientY;
    const diffY = touchY - touchStartY;
    const content = sections[currentSection].querySelector('.section-content');
    
    // Visual feedback with correct positioning
    const baseOffset = sectionOffsets[currentSection] || 0;
    container.style.transform = `translateY(${-baseOffset + (diffY * 0.6)}px)`;
    
    // Allow content scrolling near edges
    if (content.scrollHeight > content.clientHeight) {
      const atEdge = {
        top: content.scrollTop <= EDGE_BUFFER,
        bottom: content.scrollTop + content.clientHeight >= content.scrollHeight - EDGE_BUFFER
      };
      
      if ((atEdge.top && diffY > 0) || (atEdge.bottom && diffY < 0)) {
        content.scrollTop -= diffY * 0.3;
      }
    }
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const touchY = e.changedTouches[0].clientY;
    const diffY = touchY - touchStartY;
    
    if (Math.abs(diffY) > SWIPE_THRESHOLD * 0.7) {
      const direction = diffY > 0 ? 1 : -1;
      scrollToSection(currentSection + direction);
    } else {
      container.style.transition = `transform ${SCROLL_DURATION * 0.4}ms ${EASING}`;
      updatePosition();
    }
  }, { passive: true });

  // IMPROVED: Wheel handling with better content scrolling
  container.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    
    const content = sections[currentSection].querySelector('.section-content');
    const atEdge = {
      top: content.scrollTop <= EDGE_BUFFER,
      bottom: content.scrollTop + content.clientHeight >= content.scrollHeight - EDGE_BUFFER
    };
    
    // Only prevent default and switch sections if at edge
    if (Math.abs(e.deltaY) > WHEEL_THRESHOLD) {
      if ((e.deltaY > 0 && atEdge.bottom) || (e.deltaY < 0 && atEdge.top)) {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        scrollToSection(currentSection + direction);
      }
    }
  }, { passive: false });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    const content = sections[currentSection].querySelector('.section-content');
    const atEdge = {
      top: content.scrollTop <= 0,
      bottom: content.scrollTop + content.clientHeight >= content.scrollHeight
    };
    
    if (e.key === 'ArrowDown' && atEdge.bottom && currentSection < sections.length - 1) {
      scrollToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' && atEdge.top && currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  });

  // IMPORTANT: Recalculate positions on resize
  window.addEventListener('resize', () => {
    calculateSectionPositions();
    updatePosition();
  });
});  

// ============================================
// SCROLL HANDLER - NEVER SKIP SECTIONS
// ============================================
(function() {
  const container = document.getElementById('sectionsContainer');
  if (!container) return;
  
  const sections = Array.from(container.querySelectorAll('section'));
  let currentIndex = 0;
  let isLocked = false;
  let lastScrollTime = 0;
  const LOCK_DURATION = 1200; // Prevent scrolling for 1.2s after each section change
  
  // Function to scroll to a specific section
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    if (isLocked) return; // Prevent multiple scrolls
    
    // Lock immediately to prevent any other scroll
    isLocked = true;
    currentIndex = index;
    
    // Calculate position
    const sectionHeight = window.innerHeight;
    const offset = index * sectionHeight;
    
    // Apply transform
    container.style.transform = 'translateY(-' + offset + 'px)';
    
    // Update active section
    sections.forEach((section, i) => {
      if (i === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    
    // Trigger animations for new section
    if (typeof triggerSectionAnimations === 'function') {
      setTimeout(() => triggerSectionAnimations(index), 300);
    }
    
    // Update menu
    if (typeof updateActiveMenuItem === 'function') {
      updateActiveMenuItem();
    }
    
    // Release lock after animation completes
    setTimeout(() => {
      isLocked = false;
    }, LOCK_DURATION);
  }
  
  // Wheel event - ANY scroll = ONE section change
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If locked, ignore completely
    if (isLocked) return;
    
    // Determine direction (doesn't matter how strong the scroll is)
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Move exactly ONE section
    if (direction === 'down') {
      scrollToSection(currentIndex + 1);
    } else {
      scrollToSection(currentIndex - 1);
    }
  }, { passive: false });
  
  // Touch events for mobile
  let touchStartY = 0;
  let touchStartTime = 0;
  
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });
  
  container.addEventListener('touchend', (e) => {
    if (isLocked) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const timeDiff = Date.now() - touchStartTime;
    
    // Any swipe (fast or slow) = ONE section
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        scrollToSection(currentIndex + 1);
      } else {
        scrollToSection(currentIndex - 1);
      }
    }
  }, { passive: true });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isLocked) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToSection(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToSection(currentIndex - 1);
    }
  });
  
  // Initialize first section
  scrollToSection(0);
  
  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const sectionHeight = window.innerHeight;
      const offset = currentIndex * sectionHeight;
      container.style.transform = 'translateY(-' + offset + 'px)';
    }, 250);
  });
  
  // Expose for menu clicks
  window.scrollToSection = scrollToSection;
})();
