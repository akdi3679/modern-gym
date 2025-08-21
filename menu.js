document.addEventListener('DOMContentLoaded', function() {
  const menuTrack = document.querySelector('.menu-track');
  const menuItems = document.querySelectorAll('.menu-item-menu'); // Fixed selector
  const prevBtn = document.querySelector('.menu-arrow.prev');
  const nextBtn = document.querySelector('.menu-arrow.next');
  const categoryTabs = document.querySelectorAll('.menu-nav-item');
  const counter = document.querySelector('.menu-counter');
  
  let currentPosition = 0;
  const itemWidth = 250;
  const gap = 20;
  let currentIndex = 1;
  let visibleItems = Array.from(menuItems);
  
  function updateCounter() {
    counter.textContent = `${currentIndex + 1}/${visibleItems.length}`;
  }
  
  function centerItem(index) {
    // Handle circular navigation
    if (index < 0) {
      index = visibleItems.length - 1;
    } else if (index >= visibleItems.length) {
      index = 0;
    }
    
    menuItems.forEach((item, i) => {
      item.classList.remove('center');
      if (i === index) {
        item.classList.add('center');
      }
    });
    
    currentIndex = index;
    currentPosition = -(index * (itemWidth + gap)) + (window.innerWidth / 2 - itemWidth / 2 - 40);
    menuTrack.style.transform = `translateX(${currentPosition}px)`;
    updateCounter();
  }
  
  prevBtn.addEventListener('click', () => {
    centerItem(currentIndex - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    centerItem(currentIndex + 1);
  });
  
  // Toggle item details
  menuItems.forEach(item => {
    const name = item.querySelector('.menu-item-name');
    name.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close all other items first
      menuItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // Filter by category
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.dataset.category;
      
      // Update active tab
      categoryTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Filter items
      menuItems.forEach(item => {
        if (item.dataset.category === category || category === 'all') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update visible items
      visibleItems = Array.from(menuItems).filter(item => 
        item.style.display !== 'none'
      );
      
      // Reset to first item
      centerItem(0);
    });
  });
  
  // Initialize
  centerItem(1);
  updateCounter();
});