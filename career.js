 document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const currentSlideEl = document.querySelector('.current-slide');
  const totalSlidesEl = document.querySelector('.total-slides');
  const cards = document.querySelectorAll('.certificate-card');

  // State
  let currentIndex = 0;
  const slidesToShow = 3;
  let isAnimating = false;
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Initialize carousel
  function initCarousel() {
    // Set total slides
    totalSlidesEl.textContent = cards.length;
    
    // Add drag events to all cards
    cards.forEach(card => {
      addDragEvents(card);
      // Add 3D tilt effect only to active card
      if (card.classList.contains('active')) {
        addTiltEffect(card);
      }
    });
    
    // Update carousel
    updateCarousel();
  }

  // Add 3D tilt effect to active card
  function addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
      if (!card.classList.contains('active')) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
      card.style.boxShadow = `0 25px 50px rgba(0, 0, 0, 0.3)`;
    });
    
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('active')) return;
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1.1)';
      card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)';
    });
  }

  // Add drag events for manual sliding
  function addDragEvents(card) {
    card.addEventListener('mousedown', dragStart);
    card.addEventListener('touchstart', dragStart, { passive: true });
    card.addEventListener('mouseup', dragEnd);
    card.addEventListener('mouseleave', dragEnd);
    card.addEventListener('touchend', dragEnd, { passive: true });
    card.addEventListener('mousemove', drag);
    card.addEventListener('touchmove', drag, { passive: true });
  }

  function dragStart(e) {
    if (isAnimating) return;
    
    if (e.type === 'touchstart') {
      startPosition = e.touches[0].clientX;
    } else {
      startPosition = e.clientX;
      e.preventDefault();
    }
    
    isDragging = true;
    track.classList.add('grabbing');
    animationID = requestAnimationFrame(animation);
  }

  function drag(e) {
    if (!isDragging) return;
    
    const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentPosition - startPosition;
    
    currentTranslate = prevTranslate + diff;
    
    track.style.transform = `translateX(${currentTranslate}px)`;
    track.style.transition = 'none';
  }

  function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    cancelAnimationFrame(animationID);
    track.classList.remove('grabbing');
    
    const cardWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-gap'));
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > cardWidth / 3) {
      if (movedBy > 0 && currentIndex > 0) {
        currentIndex--;
      } else if (movedBy < 0 && currentIndex < cards.length - slidesToShow) {
        currentIndex++;
      }
    }
    
    updateCarousel();
  }

  function animation() {
    track.style.transform = `translateX(${currentTranslate}px)`;
    animationID = requestAnimationFrame(animation);
  }

  // Update carousel position
  function updateCarousel() {
    if (isAnimating) return;
    isAnimating = true;
    document.querySelectorAll('.certificate-item').forEach((item, index) => {
    const isActive = index === currentIndex + 1; // Center item is currentIndex + 1
    item.classList.toggle('active', isActive);
    
    // Add/remove tilt effect based on active state
    const card = item.querySelector('.certificate-card');
    if (isActive) {
      addTiltEffect(card);
    } else {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.9)';
    }
  });
    const cardWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-gap'));
    
    // Calculate center position - this ensures the active card is centered
    const centerOffset = (window.innerWidth - cardWidth) / 2;
    const transformValue = centerOffset - (currentIndex * (cardWidth + gap)) - (cardWidth + gap);
    
    track.style.transition = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
    track.style.transform = `translateX(${transformValue}px)`;
    
    currentSlideEl.textContent = currentIndex + 1;
    
    // Update active cards
    cards.forEach((card, index) => {
      const isActive = index === currentIndex + 1; // Center card is currentIndex + 1
      card.classList.toggle('active', isActive);
      
      // Add/remove tilt effect based on active state
      if (isActive) {
        addTiltEffect(card);
      } else {
        // Reset transform for inactive cards
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.9)';
      }
    });
    
    prevTranslate = transformValue;
    currentTranslate = transformValue;
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < cards.length - slidesToShow) {
      currentIndex++;
      updateCarousel();
    }
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Initialize
  initCarousel();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updateCarousel();
  });
});