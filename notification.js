 const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('section') && entry.target.querySelector('.analytics-number')) {
        animateNumbers();
      }
      entry.target.classList.add('animated');
    }
  });
}, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});
    // Form submissions
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Thank you for your message! We will contact you soon.');
      this.reset();
    });
    
    document.querySelector('#joinForm form').addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Application submitted successfully! We will contact you shortly.');
      this.reset();
    });
    
    document.querySelector('#validateForm form').addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('validityResult').style.display = 'block';
      this.reset();
    });
    // Notification function
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification-bar';
      notification.innerHTML = `<div class="notification-text">${message}</div>`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    
    // Initialize coaches carousel
    // Add this to your JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Notification system
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationPanel = document.querySelector('.notification-panel');
  const notificationSlides = document.querySelectorAll('.notification-slide');
  const prevBtn = document.querySelector('.nav-arrow.prev'); // Fixed selector
  const nextBtn = document.querySelector('.nav-arrow.next'); // Fixed selector
  const closePanel = document.querySelector('.close-panel');
  const panelOverlay = document.querySelector('.panel-overlay-not');
  const slideCounter = document.querySelector('.slide-counter'); // Add this to HTML

  let currentSlide = 0;

  // Show notification button
  setTimeout(() => {
    notificationBtn.classList.add('visible', 'has-notifications');
  }, 500);

  // Toggle panel
  notificationBtn.addEventListener('click', () => {
    notificationPanel.classList.add('open');
    notificationBtn.classList.remove('visible');
  });

  // Close panel
  function closeNotificationPanel() {
    notificationPanel.classList.remove('open');
    setTimeout(() => {
      notificationBtn.classList.add('visible');
    }, 400);
  }

  closePanel.addEventListener('click', closeNotificationPanel);
  panelOverlay.addEventListener('click', closeNotificationPanel);

  // Navigation between notifications
  function showSlide(index) {
    // Handle wrap-around for infinite navigation
    if (index >= notificationSlides.length) {
      index = 0;
    } else if (index < 0) {
      index = notificationSlides.length - 1;
    }
    
    notificationSlides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      if (i === index) {
        slide.classList.add('active');
      } else if (i < index) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('next');
      }
    });
    
    currentSlide = index;
    
    // Update counter if exists
    if (slideCounter) {
      slideCounter.textContent = `${currentSlide + 1}/${notificationSlides.length}`;
    }
  }

  // Navigation event listeners
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentSlide + 1);
  });

  // Initialize
  showSlide(0);
});