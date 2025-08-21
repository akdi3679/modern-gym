// Main IntersectionObserver for fade-content elements
const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Typewriter effect
            if (entry.target.querySelector('#typewriterText')) {
                typewriterEffect();
            }
            
            // Sixth section animation
            if (entry.target.id === 'sixthSection') {
                entry.target.classList.add('animated');
            }
        }
    });
});

document.querySelectorAll('.fade-content').forEach(el => {
    contentObserver.observe(el);
});

contentObserver.observe(document.getElementById('sixthSection'));

// Typewriter effect
function animateWords() {
    const textElement = document.querySelector('.typewriter-text');
    const originalText = textElement.textContent;
    
    // Split text into words (keeping punctuation with words)
    const words = originalText.split(/(\s+)/).filter(word => word.trim().length > 0);
    
    // Clear the original text
    textElement.innerHTML = '';
    
    // Create and append word spans
    words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'typewriter-word';
        wordSpan.textContent = word;
        textElement.appendChild(wordSpan);
        
        // Add space after word if it's not punctuation
        if (!/[.,;!?]$/.test(word)) {
            textElement.appendChild(document.createTextNode(' '));
        }
    });
    
    // Animate words one by one
    const wordElements = document.querySelectorAll('.typewriter-word');
    let index = 0;
    
    function showNextWord() {
        if (index < wordElements.length) {
            wordElements[index].classList.add('visible');
            index++;
            
            // Random delay between words (50-150ms)
            setTimeout(showNextWord, 50 + Math.random() * 100);
        }
    }
    
    // Start animation when section is visible
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showNextWord();
                typewriterObserver.unobserve(entry.target);
            }
        });
    }, {threshold: 0.1});
    
    typewriterObserver.observe(document.querySelector('.third-section'));
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', animateWords);

// Sixth section interactions
document.addEventListener('DOMContentLoaded', function() {
    const sixthSection = document.getElementById('sixthSection');
    const centerText = document.getElementById('centerText');
    const fullscreenVideo = document.getElementById('fullscreenVideo');
    const video = fullscreenVideo.querySelector('video');

    // Intersection Observer for initial animation
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sixthSection.classList.add('animated');
                
                // Sequence animations
                setTimeout(() => {
                    sixthSection.classList.add('show-text');
                }, 1000);

                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sectionObserver.observe(sixthSection);

    // Click event for video
    centerText.addEventListener('click', function() {
        sixthSection.classList.add('video-active');
        video.play();
        
        // Reset when video ends
        video.addEventListener('ended', function() {
            sixthSection.classList.remove('video-active');
        }, { once: true });
    });

    // Close video when clicked
    fullscreenVideo.addEventListener('click', function(e) {
        if (e.target === fullscreenVideo) {
            sixthSection.classList.remove('video-active');
            video.pause();
            video.currentTime = 0;
        }
    });
});

// Mobile sticky cards fix
function handleMobileSticky() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.sticky-card').forEach(card => {
            card.style.position = 'relative';
        });
    } else {
        document.querySelectorAll('.sticky-card').forEach(card => {
            card.style.position = 'sticky';
        });
    }
}

window.addEventListener('resize', handleMobileSticky);
handleMobileSticky();

