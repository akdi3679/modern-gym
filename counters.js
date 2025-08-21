function animateCounters() {
      const counters = document.querySelectorAll('.counter-number');
      const speed = 1000; // Lower is faster
      
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(animateCounters, 1);
        } else {
          counter.innerText = target;
        }
      });
    }

    // Text animation - split into words
    function splitTextIntoWords() {
      const textElements = document.querySelectorAll('.counter-title, .counter-subtitle, .counter-description');
      
      textElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = text.split(' ').map(word => 
          `<span style="transition-delay: ${Math.random() * 0.5}s">${word}&nbsp;</span>`
        ).join('');
      });
    }

    // Intersection Observer
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('counter-visible');
          
          // Start counter animation after all squares are visible (1.5s delay to match last square's animation)
          setTimeout(animateCounters, 1500);
          
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      const counterSection = document.querySelector('.counter-section');
      splitTextIntoWords();
      counterObserver.observe(counterSection);
    });
    