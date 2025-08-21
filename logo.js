document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM ELEMENTS ===== //
    const logoText = document.querySelector('.logo-text');
    const menuIcon = document.querySelector('.menu-icon');
    const container = document.querySelector('.containernav');
    const sections = document.querySelectorAll('section');
    
    // ===== ANIMATION STATE ===== //
    let isAnimating = false;
    let animationState = 'expanded'; // 'expanded' or 'collapsed'
    
    // ===== LETTER WRAPPING ===== //
    function wrapLetters() {
        const text = logoText.textContent.trim();
        logoText.innerHTML = '';
        
        const words = text.split(/\s+/);
        
        words.forEach((word, wordIndex) => {
            if (wordIndex > 0) {
                logoText.appendChild(document.createTextNode(' '));
            }
            
            for (let i = 0; i < word.length; i++) {
                const letter = document.createElement('span');
                letter.className = 'letter';
                letter.textContent = word[i];
                letter.dataset.wordIndex = wordIndex;
                letter.dataset.letterIndex = i;
                logoText.appendChild(letter);
            }
        });
        
        return {
            letters: document.querySelectorAll('.letter'),
            firstLetters: Array.from(document.querySelectorAll('.letter')).filter(letter => 
                letter.dataset.letterIndex === '0'
            )
        };
    }

    const { letters, firstLetters } = wrapLetters();

    // ===== ANIMATION FUNCTIONS ===== //
    // ===== ANIMATION FUNCTIONS ===== //
// ===== ANIMATION FUNCTIONS ===== //
function animateLogoOut() {
    if (isAnimating || animationState === 'collapsed') return;
    
    console.log('Starting collapse animation');
    isAnimating = true;
    
    // 1. First hide all non-first letters
    letters.forEach(letter => {
        if (!firstLetters.includes(letter)) {
            letter.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            letter.style.opacity = '0';
            letter.style.transform = 'scale(0.8)';
        }
    });

    // 2. Calculate target position at menu icon location
    const menuIconRect = menuIcon.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const targetX = menuIconRect.left - containerRect.left +17;
    
    // 3. After non-first letters are hidden, slide first letters to menu icon position
              let gap = 0;

    setTimeout(() => {
        firstLetters.forEach((letter, index) => {
            const currentX = letter.getBoundingClientRect().left - containerRect.left;
            // "g" and "c" will stack at same position (menu icon location)
            letter.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)';
            letter.style.transform = `translateX(${targetX - currentX + gap }px)`;
            gap = 15; 
        });

        // 4. After sliding, fade out first letters and show menu icon
        setTimeout(() => {
            firstLetters.forEach(letter => {
                letter.style.transition = 'opacity 0.2s ease-out';
                letter.style.opacity = '0';
            });
            
            menuIcon.style.transition = 'opacity 0.3s ease-out';
            menuIcon.style.opacity = '1';
            
            isAnimating = false;
            animationState = 'collapsed';
            console.log('Collapse animation complete');
        }, 500);
    }, 300);
}

function animateLogoIn() {
    if (isAnimating || animationState === 'expanded') return;
    
    console.log('Starting expand animation');
    isAnimating = true;

    // 1. Immediately hide menu icon
    menuIcon.style.opacity = '0';

    // 2. Show first letters (still at menu icon position)
    firstLetters.forEach(letter => {
        letter.style.opacity = '1';
    });

    // 3. Slide first letters back to original positions
    setTimeout(() => {
        firstLetters.forEach(letter => {
            letter.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.4, 1)';
            letter.style.transform = 'translateX(0)';
        });

        // 4. After sliding, fade in all other letters
        setTimeout(() => {
            letters.forEach(letter => {
                if (!firstLetters.includes(letter)) {
                    letter.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    letter.style.opacity = '1';
                    letter.style.transform = 'scale(1)';
                }
            });
            
            isAnimating = false;
            animationState = 'expanded';
            console.log('Expand animation complete');
        }, 500);
    }, 50);
}
    // ===== INTERSECTION OBSERVER ===== //
    function initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(sections).indexOf(entry.target);
                    handleSectionChange(sectionIndex);
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => observer.observe(section));
    }

    // ===== SECTION CHANGE HANDLER ===== //
    let currentSection = 0;
    
    function handleSectionChange(newSection) {
        console.log('Section changed to:', newSection);
        
        // Only trigger animations when section actually changes
        if (newSection === currentSection) return;
        
        // Animation rules:
        // - Collapse logo when moving past first section
        // - Expand logo when returning to first section
        if (newSection > 0 && currentSection === 0) {
            animateLogoOut();
        } else if (newSection === 0 && currentSection > 0) {
            animateLogoIn();
        }
        
        currentSection = newSection;
    }

    // ===== INITIALIZATION ===== //
    // Set initial state
    menuIcon.style.opacity = '0';
    animationState = 'expanded';
    
    // Start observing sections
    initIntersectionObserver();

    // Debugging
    console.log('Logo animation system initialized');
    console.log('Letters:', letters);
    console.log('First letters:', firstLetters);
    let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // Detect scroll direction (up/down)
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    // Only trigger if not already animating and not in a section transition
    if (isAnimating || currentSection !== 0) return;

    // Trigger animateLogoOut() if scrolled past 100vh
    if (isScrollingDown && currentScrollY > vh) {
        animateLogoOut();
    } 
    // Trigger animateLogoIn() if returned to top (0-100vh)
    else if (!isScrollingDown && currentScrollY <= vh) {
        animateLogoIn();
    }
});
});    
// ===== SCROLL-BASED ANIMATION TRIGGERS ===== //
