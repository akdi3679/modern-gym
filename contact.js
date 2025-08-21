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
    
document.addEventListener('DOMContentLoaded', function() {
  const menuTrack = document.querySelector('.menu-track');
  const menuItems = document.querySelectorAll('.menu-item');
  const prevBtn = document.querySelector('.menu-arrow.prev');
  const nextBtn = document.querySelector('.menu-arrow.next');
  const categoryTabs = document.querySelectorAll('.menu-nav-item');
  const counter = document.querySelector('.menu-counter');
  
  let currentPosition = 0;
  const itemWidth = 250;
  const gap = 20;
  let currentIndex = 1; // Start with center item
  let visibleItems = Array.from(menuItems);
  
  // Update counter
  function updateCounter() {
    counter.textContent = `${currentIndex + 1}/${visibleItems.length}`;
  }
  
  // Center item
  function centerItem(index) {
    menuItems.forEach((item, i) => {
      item.classList.toggle('center', i === index);
    });
    currentIndex = index;
    currentPosition = -(index * (itemWidth + gap)) + (window.innerWidth / 2 - itemWidth / 2 - 40);
    menuTrack.style.transform = `translateX(${currentPosition}px)`;
    updateCounter();
  }
  
  // Navigation arrows
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      centerItem(currentIndex - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < visibleItems.length - 1) {
      centerItem(currentIndex + 1);
    }
  });
  
  // Toggle item details
  menuItems.forEach(item => {
    const name = item.querySelector('.menu-item-name');
    name.addEventListener('click', function() {
      item.classList.toggle('active');
      
      // Close other items
      menuItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
    });
  });
  
  // Initialize
  centerItem(1);
  updateCounter();
  
  // Filter by category
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.dataset.category;
      
      // Update active tab
      categoryTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Filter items
      visibleItems = Array.from(menuItems).filter(item => {
        if (item.dataset.category === category) {
          item.style.display = 'block';
          return true;
        } else {
          item.style.display = 'none';
          return false;
        }
      });
      
      // Reset to first item
      centerItem(Math.min(1, visibleItems.length - 1));
    });
  });
});