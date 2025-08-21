 
        // Canvas setup
       const imageContainer = document.getElementById('imageContainer');
        
        // Set canvas sizes to match container
         
        


        
        // Scroll animation
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY || window.pageYOffset;
            const triggerPoint = 100;
            const maxScroll = 300;
            
            if (scrollPosition > triggerPoint) {
                const progress = Math.min((scrollPosition - triggerPoint) / (maxScroll - triggerPoint), 1);
                imageContainer.style.top = `${-30 + (30 * progress)}vh`;
                imageContainer.style.transform = `scale(${0.3 + (0.7 * progress)})`;
                imageContainer.style.borderRadius = `${20 - (20 * progress)}px`;
            } else if (scrollPosition <= triggerPoint) {
                imageContainer.style.top = '-30vh';
                imageContainer.style.transform = 'scale(0.3)';
                imageContainer.style.borderRadius = '20px';
            }
        });
    