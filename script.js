 const sectionsContainer = document.getElementById('sectionsContainer');
    const menuOverlay = document.getElementById('menuOverlay');
    const sections = document.querySelectorAll('section');
    const careerPage = document.getElementById('careerPage');
const careerLink = document.getElementById('careerLink');
const homeNav = document.getElementById('homeNav');

const hicontainer = document.getElementById('hicontainer');

    let currentSection = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;
    
    let currentWordIndex = 0;
    
    // Menu functionality
   function toggleMenu() {
  menuOverlay.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuOverlay.contains(e.target) && e.target.className !== 'menu-btn') {
    menuOverlay.classList.remove('active');
  }
});

// Career page toggle
// Toggle career page visibility
// Get elements
const mainElement = document.querySelector('main');

// Toggle career page visibility
careerLink.addEventListener('click', (e) => {
  e.preventDefault();
  sectionsContainer.style.display = 'none';
  careerPage.style.display = 'block';
  menuOverlay.classList.remove('active');
});

// Automatic overflow detection
const observerover = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'style') {
      // Check if careerPage is visible
      if (careerPage.style.display === 'block') {
        mainElement.classList.add('career-active');
        hicontainer.style.display = 'flex';
      } else {
        hicontainer.style.display = 'none';
        mainElement.classList.remove('career-active');
      }
    }
  });
});

// Start observing careerPage for style changes
observerover.observe(careerPage, { attributes: true });
// Home navigation

    ////animation 
function triggerSectionAnimations(sectionIndex) {
  // Safeguard against invalid section indices
  if (sectionIndex < 0 || sectionIndex >= sections.length) return;

  const section = sections[sectionIndex];
  if (!section) return;

  // Get all animatable elements
  const content = section.querySelector('.content');
  const galleryImgs = section.querySelectorAll('.gallery-img');
  const galleryTextSection = section.querySelector('.gallery-text-section');
  const cards = section.querySelectorAll('.card'); // Changed to querySelectorAll
  const cardTextSection = section.querySelector('.card-text-section');
  const socialLinks = section.querySelectorAll('.social-link');

  // Reset all animations first
  resetAnimations();

  // Trigger animations with proper sequencing
  triggerAnimations();

  function resetAnimations() {
    if (content) content.classList.remove('visible');
    galleryImgs.forEach(img => img.classList.remove('visible'));
    if (galleryTextSection) galleryTextSection.classList.remove('visible');
    cards.forEach(card => card.classList.remove('visible'));
    if (cardTextSection) cardTextSection.classList.remove('visible');
    socialLinks.forEach(link => link.classList.remove('visible'));
  }

  function triggerAnimations() {
    // Initial delay before starting animations
    setTimeout(() => {
      // Content animation (if exists)
      if (content) content.classList.add('visible');

      // Gallery images (staggered)
      galleryImgs.forEach((img, index) => {
        setTimeout(() => img.classList.add('visible'), index * 340);
      });

      // Gallery text (after images)
      if (galleryTextSection) {
        setTimeout(() => galleryTextSection.classList.add('visible'), 400);
      }

      // Cards (staggered)
      cards.forEach((card, index) => {
        setTimeout(() => card.classList.add('visible'), index * 200);
      });

      // Card text (after cards)
      if (cardTextSection) {
        setTimeout(() => cardTextSection.classList.add('visible'), 400);
      }

      // Social links (staggered)
      socialLinks.forEach((link, index) => {
        setTimeout(() => link.classList.add('visible'), index * 100);
      });
    }, 100);
  }
} 
// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        triggerSectionAnimations(0);
    }, 100); // 100ms delay ensures rendering is complete
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionIndex = Array.from(sections).indexOf(entry.target);
      triggerSectionAnimations(sectionIndex);
    }
  });
}, { threshold: 0.1, rootMargin: '100px 0px' }); // Trigger when 30% visible

// Observe all sections
sections.forEach(section => observer.observe(section));

/////// close animation 

  const words = ['POWER', 'ENERGY', 'STRENGTH', 'FOCUS'];
        let showingMainTitle = true;
        let wordWidths = {};
        let getWidth = 0;
        let heroWidth = 0;
        let currentPosition = 0;
        let targetPosition = 0;
        let isSliding = false;

        function measureElements() {
            const tester = document.createElement('span');
            tester.style.visibility = 'hidden';
            tester.style.position = 'absolute';
            tester.style.whiteSpace = 'nowrap';
            tester.style.font = 'bold 3em Arial, sans-serif';
            document.body.appendChild(tester);
            
            // Measure "GET" width
            tester.textContent = "GET";
            getWidth = tester.offsetWidth;
            
            // Measure all word widths
            words.forEach(word => {
                tester.textContent = word;
                wordWidths[word] = tester.offsetWidth;
            });
            
            document.body.removeChild(tester);
            heroWidth = document.querySelector('.hero-title').offsetWidth;
        }

        function calculateCenterPosition(word) {
            const totalWidth = getWidth + 8 + wordWidths[word];
            return (heroWidth - totalWidth) / 2;
        }

        function smoothSlide(fromPos, toPos, duration, callback) {
            if (isSliding) return;
            
            isSliding = true;
            const startTime = performance.now();
            const distance = toPos - fromPos;
            const getTitle = document.getElementById('getTitle');
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                const currentPos = fromPos + (distance * easeOut);
                getTitle.style.left = currentPos + 'px';
                getTitle.style.transform = 'translateX(0)';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    currentPosition = toPos;
                    isSliding = false;
                    if (callback) callback();
                }
            }
            
            requestAnimationFrame(animate);
        }

        function startAnimationLoop() {
            measureElements();
            if (!isAnimating) {
                changeTitle();
            }
        }
        
        function changeTitle() {
            if (isAnimating) return;
            isAnimating = true;
            
            const mainTitle = document.getElementById('mainTitle');
            const getTitle = document.getElementById('getTitle');
            
            if (showingMainTitle) {
                mainTitle.style.animation = 'slideOutUp 0.8s forwards';
                
                setTimeout(() => {
                    mainTitle.style.display = 'none';
                    getTitle.style.display = 'flex';
                    
                    // Position for first word
                    const initialPos = calculateCenterPosition(words[0]);
                    currentPosition = initialPos;
                    getTitle.style.left = initialPos + 'px';
                    getTitle.style.transform = 'translateX(0)';
                    getTitle.style.animation = 'slideInUp 0.8s forwards';
                    
                    showingMainTitle = false;
                    isAnimating = false;
                    
                    setTimeout(changeWord, 2000);
                }, 800);
            } else {
                getTitle.style.animation = 'slideOutDown 0.8s forwards';
                
                setTimeout(() => {
                    getTitle.style.display = 'none';
                    mainTitle.style.display = 'flex';
                    mainTitle.style.animation = 'slideInUp 0.8s forwards';
                    
                    showingMainTitle = true;
                    isAnimating = false;
                    
                    setTimeout(changeTitle, 3000);
                }, 800);
            }
        }
        
        function changeWord() {
            if (showingMainTitle) return;
            
            const changingWord = document.getElementById('changingWord');
            const nextWordIndex = (currentWordIndex + 1) % words.length;
            const nextWord = words[nextWordIndex];
            
            // Calculate target position for new word
            targetPosition = calculateCenterPosition(nextWord);
            
            // Start word out animation
            changingWord.style.animation = 'wordOutUp 0.5s forwards';
            
            // Start smooth sliding if position needs to change
            if (Math.abs(currentPosition - targetPosition) > 1) {
                smoothSlide(currentPosition, targetPosition, 800);
            }
            
            setTimeout(() => {
                currentWordIndex = nextWordIndex;
                changingWord.textContent = nextWord;
                changingWord.style.animation = 'wordInDown 0.5s forwards';
                
                if (currentWordIndex === words.length - 1) {
                    setTimeout(changeTitle, 2000);
                } else {
                    setTimeout(changeWord, 2000);
                }
            }, 500);
        }
        
        window.addEventListener('load', function() {
            setTimeout(startAnimationLoop, 1000);
        });
    // Card 3D effect
    function setupCard3D() {
      const card = document.getElementById('mainCard');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = (x - centerX) / 10;
        const rotateX = (centerY - y) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    }

   

    
   

    
    // loading
    // Loading Screen Controller
document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const config = {
    opacityPulseSpeed: 800, // Speed of opacity pulsing (ms)
    morphSpeed: 3000,      // Speed of continuous morphing (ms)
    finalUnmorphDuration: 1200, // Final unmorph duration
    decorationFadeIn: 600, // Decoration fade-in duration
    slideUpDuration: 800,  // SVG slide-up duration
    containerSlideDelay: 300, // Delay before container slides
    containerSlideDuration: 500 // Container slide duration
  };

  // DOM Elements
  const loadingScreen = document.getElementById('loading-screen');
  const svgContainer = document.querySelector('.svg-container');
  const svgElement = document.querySelector('.svg-container svg');
  const path1 = document.getElementById('path1');
  const path2 = document.getElementById('path2');
  const leftDecoration = document.getElementById('left-decoration');
  const rightDecoration = document.getElementById('right-decoration');
  const mainContent = document.querySelector('main');

  // Path definitions
  const paths = {
    path1: {
      original: "M2273 3278 c-22 -25 -43 -99 -43 -145 0 -25 9 -81 21 -126 25 -96 27 -163 7 -201 l-14 -27 -43 86 c-83 162 -157 222 -293 234 -123 11 -160 37 -208 143 l-20 43 0 -53 c0 -58 16 -103 60 -173 17 -25 38 -70 49 -101 27 -77 45 -109 82 -146 39 -38 111 -62 186 -62 30 0 62 -4 72 -10 45 -23 53 -101 41 -407 -3 -90 -1 -136 6 -143 8 -8 13 5 18 52 4 35 32 137 61 228 30 91 58 179 62 195 6 25 8 20 11 -32 2 -35 7 -63 11 -63 22 0 55 108 59 195 4 80 1 100 -23 165 -55 152 -76 227 -83 294 -6 57 -9 67 -19 54z m-335 -260 c7 -7 12 -22 12 -34 0 -31 37 -74 65 -74 13 0 36 5 52 11 25 9 31 7 51 -16 13 -15 21 -32 19 -39 -5 -16 -87 -56 -116 -56 -40 0 -109 39 -130 73 -19 32 -24 56 -22 115 1 28 4 32 29 32 15 0 33 -5 40 -12z",
      morphed: "M2273 3278c-22-25-43-99-43-145 0-25 9-81 21-126 25-96 27-163 7-201l-14-27-43 86c-83 162-157 222-293 234-123 11-160 37-208 143l-20 43 0-53c0-58 16-103 60-173 17-25 38-70 49-101 27-77 45-109 82-146 39-38 111-62 186-62 30 0 62-4 72-10 45-23 53-101 41-407-3-90-1-136 6-143 8-8 13 5 18 52 4 35 32 137 61 228 30 91 58 179 62 195 6 25 8 20 11-32 2-35 7-63 11-63 22 0 55 108 59 195 4 80 1 100-23 165-55 152-76 227-83 294-6 57-9 67-19 54zm-398-361c8-22 13-32 24-45 4-3 4-11 50-39 40-19 49-22 72-23 12-1 45 9 83 30 22 11 35 25 33 26-5-16-87-56-116-56-40 0-109 39-130 73-19 32-24 56-22 115 1 28 4 32-1 6 0-20 0-39 2-64z"
    },
    path2: {
      original: "M3050 3235 c0 -83 -18 -147 -86 -305 -39 -92 -39 -178 0 -282 15 -43 32 -78 37 -78 5 0 9 21 10 48 l1 47 13 -40 c7 -22 35 -101 63 -175 28 -74 54 -159 58 -187 3 -29 10 -53 15 -53 18 0 20 75 5 236 -24 259 -10 289 140 306 99 12 152 34 183 76 11 16 54 101 96 189 67 142 76 167 73 210 l-3 48 -28 -58 c-42 -85 -76 -107 -187 -117 -144 -14 -174 -37 -286 -223 -55 -93 -59 -96 -71 -75 -19 34 -16 120 8 211 27 104 22 182 -14 252 l-26 50 -1 -80z m408 -217 c17 -17 15 -93 -3 -128 -16 -31 -64 -64 -108 -74 -34 -8 -97 8 -128 32 -22 19 -22 19 -3 51 14 24 24 31 39 26 64 -19 86 -18 110 5 14 13 25 34 25 46 0 12 3 29 6 38 7 19 45 21 62 4z",
      morphed: "M3050 3235 c0 -83 -18 -147 -86 -305 -39 -92 -39 -178 0 -282 15 -43 32 -78 37 -78 5 0 9 21 10 48 l1 47 13 -40 c7 -22 35 -101 63 -175 28 -74 54 -159 58 -187 3 -29 10 -53 15 -53 18 0 20 75 5 236 -24 259 -10 289 140 306 99 12 152 34 183 76 11 16 54 101 96 189 67 142 76 167 73 210 l-3 48 -28 -58 c-42 -85 -76 -107 -187 -117 -144 -14 -174 -37 -286 -223 -55 -93 -59 -96 -71 -75 -19 34 -16 120 8 211 27 104 22 182 -14 252 l-26 50 -1 -80z m408 -217 c17 -17 15 -93 -3 -128 -16 -31 -64 -64 -108 -74 -34 -8 -97 8 -128 32 -22 19 -22 19 0 0 17 -13 30 -17 54 -26 64 -19 88 -3 119 11 15 9 16 8 40 28 6 7 21 18 29 43 6 19 18 79 -1 112z"
    }
  };

  // State variables
  let isContentLoaded = false;
  let animationFrame;
  let startTime;

  // 1. Initial pulsing opacity effect
  function startOpacityPulse() {
    let lastTime = performance.now();
    let direction = -1;
    let currentOpacity = 1;

    function pulse(timestamp) {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Only continue if content isn't loaded yet
      if (!isContentLoaded) {
        const opacityChange = (deltaTime / config.opacityPulseSpeed) * direction;
        currentOpacity = Math.min(1, Math.max(0.4, currentOpacity + opacityChange));
        
        if (currentOpacity <= 0.4 || currentOpacity >= 1) {
          direction *= -1;
        }
        
        svgElement.style.opacity = currentOpacity;
        animationFrame = requestAnimationFrame(pulse);
      }
    }
    
    animationFrame = requestAnimationFrame(pulse);
  }

  // 2. Continuous morphing animation
  function startContinuousMorph() {
    let morphProgress = 0;
    startTime = performance.now();
    
    function morph(timestamp) {
      const elapsed = timestamp - startTime;
      morphProgress = (elapsed % config.morphSpeed) / config.morphSpeed;
      
      // Only continue if content isn't loaded yet
      if (!isContentLoaded) {
        // Calculate intermediate paths (simplified interpolation)
        path1.setAttribute('d', morphProgress < 0.5 ? paths.path1.morphed : paths.path1.original);
        path2.setAttribute('d', morphProgress < 0.5 ? paths.path2.morphed : paths.path2.original);
        
        animationFrame = requestAnimationFrame(morph);
      }
    }
    
    animationFrame = requestAnimationFrame(morph);
  }

  // 3. Final unmorph and exit sequence
  function startExitSequence() {
    cancelAnimationFrame(animationFrame);
    
    // Reset to full opacity
    svgElement.style.opacity = '1';
    
    // Final unmorph to original state
    path1.setAttribute('d', paths.path1.original);
    path2.setAttribute('d', paths.path2.original);
    
    // Fade in decorations
    leftDecoration.style.transition = `opacity ${config.decorationFadeIn}ms ease-out`;
    rightDecoration.style.transition = `opacity ${config.decorationFadeIn}ms ease-out`;
    leftDecoration.style.opacity = '1';
    rightDecoration.style.opacity = '1';
    
    // After decorations are visible, slide up SVG
    setTimeout(() => {
      svgElement.style.transition = `transform ${config.slideUpDuration}ms cubic-bezier(0.65, 0, 0.35, 1)`;
      svgElement.style.transform = 'translateY(-40px)';
      
      // Then slide up container after delay
      setTimeout(() => {
        loadingScreen.style.transition = `transform ${config.containerSlideDuration}ms cubic-bezier(0.65, 0, 0.35, 1)`;
        loadingScreen.style.transform = 'translateY(-100%)';
        
        // Finally remove from DOM
        setTimeout(() => {
          loadingScreen.remove();
          mainContent.style.opacity = '1';
        }, config.containerSlideDuration);
      }, config.containerSlideDelay);
    }, config.finalUnmorphDuration);
  }

  // Initialize loading screen
  function initLoadingScreen() {
    // Start with morphed state
    path1.setAttribute('d', paths.path1.morphed);
    path2.setAttribute('d', paths.path2.morphed);
    leftDecoration.style.opacity = '0';
    rightDecoration.style.opacity = '0';
    mainContent.style.opacity = '0';
    
    // Start animations
    startOpacityPulse();
    startContinuousMorph();
    
    // When content is loaded
    window.addEventListener('load', () => {
      isContentLoaded = true;
      startExitSequence();    
    });
    
    // Fallback in case load event doesn't fire
    setTimeout(() => {
      if (!isContentLoaded) {
        isContentLoaded = true;
        startExitSequence();
      }
    }, 4000); // 4 second fallback
  }   

  // Start everything
  
function initChatButton() {
    const chatBtn = document.getElementById('aiChatBtn');
    const chatPanel = document.getElementById('aiChatPanel');
    const closeBtn = chatPanel.querySelector('.close-chat');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Draggable button functionality
  let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let dragTimer;
    const maxDragDistance = 100;
    const returnAfterMs = 3000;

    // Set initial position (bottom-right corner)
    function setInitialPosition() {
    // Get button dimensions
    const btnWidth = chatBtn.offsetWidth;
    const btnHeight = chatBtn.offsetHeight;
    
    // Calculate position (30px from bottom-right)
    initialX = window.innerWidth - btnWidth - 20;
    initialY = window.innerHeight - btnHeight - 20;
    
    // Apply styles
    
}

     function startDrag(e) {
        isDragging = true;
        
        // Get starting position
        const rect = chatBtn.getBoundingClientRect();
        startX = (e.clientX || e.touches[0].clientX) - rect.left;
        startY = (e.clientY || e.touches[0].clientY) - rect.top;
        
        // Start 3-second return timer
        dragTimer = setTimeout(() => {
            if (isDragging) {
                returnToPosition();
                isDragging = false;
            }
        }, returnAfterMs);
        
        e.preventDefault();
    }
   function drag(e) {
        if (!isDragging) return;
        
        // Calculate new position
        let newX = (e.clientX || e.touches[0].clientX) - startX;
        let newY = (e.clientY || e.touches[0].clientY) - startY;
        
        // Calculate distance from origin
        const distance = Math.sqrt(
            Math.pow(newX - initialX, 2) + 
            Math.pow(newY - initialY, 2)
        );
        
        // Constrain to max distance
        if (distance > maxDragDistance) {
            const angle = Math.atan2(newY - initialY, newX - initialX);
            newX = initialX + Math.cos(angle) * maxDragDistance;
            newY = initialY + Math.sin(angle) * maxDragDistance;
        }
        
        // Apply new position
        chatBtn.style.left = newX + 'px';
        chatBtn.style.top = newY + 'px';
    }

    // End drag
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        clearTimeout(dragTimer);
        returnToPosition();
    }
    function returnToPosition() {
        chatBtn.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        chatBtn.style.left = initialX + 'px';
        chatBtn.style.top = initialY + 'px';
        
        setTimeout(() => {
            chatBtn.style.transition = '';
        }, 500);
    }

    // Initialize position
     setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    // Event listeners
    chatBtn.addEventListener('mousedown', startDrag);
    chatBtn.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag); 
    // Chat functionality
    // Mobile touch fix - prevent drag from blocking click
let touchStartTime = 0;
let touchMoved = false;

chatBtn.addEventListener('touchstart', function(e) {
  touchStartTime = Date.now();
  touchMoved = false;
}, { passive: true });

chatBtn.addEventListener('touchmove', function(e) {
  touchMoved = true;
}, { passive: true });

chatBtn.addEventListener('touchend', function(e) {
  const touchDuration = Date.now() - touchStartTime;
  // If it was a quick tap (not a drag), trigger click
  if (touchDuration < 200 && !touchMoved) {
    chatPanel.classList.toggle('show');
    chatBtn.style.opacity = chatPanel.classList.contains('show') ? '0' : '1';
  }
});

chatBtn.addEventListener('click', function(e) {
        if (!isDragging) {
            chatPanel.classList.toggle('show');
            chatBtn.style.opacity = chatPanel.classList.contains('show') ? '0' : '1';
        }
    });

    document.addEventListener('click', function(e) {
        if (!chatPanel.contains(e.target) && e.target !== chatBtn) {
            chatPanel.classList.remove('show');
            chatBtn.style.opacity = '1';
        }
    });

    closeBtn.addEventListener('click', function() {
        chatBtn.style.opacity = '1';
        chatPanel.classList.remove('show');
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            setTimeout(() => {
                addMessage("Please try again later. The AI service is currently unavailable.", 'error');
            }, 1000);
        }
    }

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initial greeting
    setTimeout(() => {
        addMessage("Hello! How can I assist you today?", 'ai');
    }, 1500);
}

    initLoadingScreen();
    initChatButton();
    function updateActiveMenuItem() {
        document.querySelectorAll('.menu-item').forEach(item => {
          item.classList.remove('active');
          if (parseInt(item.getAttribute('data-section')) === currentSection) {
            item.classList.add('active'); 
          }
        });
      }
      
      // Call this whenever section changes
      updateActiveMenuItem(); 
});


// Mobile scroll fix - disable custom scroll hijack on mobile
(function() {
  if (window.innerWidth <= 768) {
    // Remove any transform-based scrolling on mobile
    const container = document.getElementById('sectionsContainer');
    if (container) {
      container.style.transform = 'none';
      container.style.height = 'auto';
      container.style.overflow = 'visible';
    }
    
    // Allow natural scrolling
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }
})();
// Mobile touch fix - separate tap from drag
let touchStartTime = 0;
let touchMoved = false;

chatBtn.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
    touchMoved = false;
}, { passive: true });

chatBtn.addEventListener('touchmove', function(e) {
    touchMoved = true;
}, { passive: true });

chatBtn.addEventListener('touchend', function(e) {
    const touchDuration = Date.now() - touchStartTime;
    // If it was a quick tap (not a drag), trigger click
    if (touchDuration < 200 && !touchMoved) {
        chatPanel.classList.toggle('show');
        chatBtn.style.opacity = chatPanel.classList.contains('show') ? '0' : '1';
        e.preventDefault();
    }
});

chatBtn.addEventListener('click', function(e) {
    if (!isDragging) {
        chatPanel.classList.toggle('show');
        chatBtn.style.opacity = chatPanel.classList.contains('show') ? '0' : '1';
    }
});

// Mobile gallery image fallback - force visible if IntersectionObserver fails
(function() {
    if (window.innerWidth <= 768) {
        const galleryImgs = document.querySelectorAll('.gallery-img');
        galleryImgs.forEach(img => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.transform = 'translate(0, 0)';
        });
    }
})();



// =========================================
// SCROLL SYSTEM (Desktop only - mobile uses CSS scroll-snap)
// =========================================
(function() {
  // Skip on mobile - CSS scroll-snap handles it natively
  if (window.innerWidth <= 768) return;
  
  const container = document.getElementById('sectionsContainer');
  if (!container) return;
  
  const sections = Array.from(container.querySelectorAll('section'));
  let currentIndex = 0;
  let isAnimating = false;
  const animationDuration = 800;
  
  function isSectionScrollable(section) {
    const content = section.querySelector('.section-content');
    if (!content) return false;
    return content.scrollHeight > content.clientHeight + 5;
  }
  
  function isSectionAtEdge(section, direction) {
    const content = section.querySelector('.section-content');
    if (!content) return true;
    if (direction === 'up') return content.scrollTop <= 1;
    if (direction === 'down') return content.scrollTop + content.clientHeight >= content.scrollHeight - 2;
    return true;
  }
  
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isAnimating) return;
    isAnimating = true;
    currentIndex = index;
    
    const sectionHeight = window.innerHeight;
    const gap = 150;
    const offset = index * (sectionHeight + gap);
    
    container.style.transform = 'translateY(-' + offset + 'px)';
    
    sections.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    
    if (typeof triggerSectionAnimations === 'function') {
      triggerSectionAnimations(index);
    }
    
    setTimeout(() => { isAnimating = false; }, animationDuration);
  }
  
  function handleScroll(direction) {
    const currentSection = sections[currentIndex];
    
    if (isSectionScrollable(currentSection)) {
      if (direction === 'down' && isSectionAtEdge(currentSection, 'down')) {
        scrollToSection(currentIndex + 1);
      } else if (direction === 'up' && isSectionAtEdge(currentSection, 'up')) {
        scrollToSection(currentIndex - 1);
      }
    } else {
      if (direction === 'down') scrollToSection(currentIndex + 1);
      else if (direction === 'up') scrollToSection(currentIndex - 1);
    }
  }
  
  // Mouse wheel (desktop only)
  let wheelTimeout;
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      handleScroll(e.deltaY > 0 ? 'down' : 'up');
    }, 50);
  }, { passive: false });
  
  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); handleScroll('down'); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); handleScroll('up'); }
  });
  
  // Init
  scrollToSection(0);
  
  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => scrollToSection(currentIndex), 250);
  });
})();