const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
    
    // Class category switching
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
    
    // Class image slider
    const classSlides = document.querySelector('.class-slides');
    const classDots = document.querySelectorAll('.slide-dot');
    let currentClassSlide = 0;
    
    function showClassSlide(index) {
      classSlides.style.transform = `translateX(-${index * 100}%)`;
      classDots.forEach(dot => dot.classList.remove('active'));
      classDots[index].classList.add('active');
      currentClassSlide = index;
    }
    
    classDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showClassSlide(index));
    });
    
    // Auto slide change
    setInterval(() => {
      currentClassSlide = (currentClassSlide + 1) % classDots.length;
      showClassSlide(currentClassSlide);
    }, 5000);
    
    // Number counter animation
    
    
    // coaches 
        // Global variables
        let webglActive = false;
        let coachImageContainers = [];
        let coachImages = [];
        let autoRotateInterval;
        const rotateDelay = 5000; // 5 seconds
        let sliderImages = [];
        let scene, camera, mat, object;
let currentSlide = 0;
let totalSlides = 5; // Should match number of slides
let paginationBtns = document.querySelectorAll('.pagination-container button');
        // Initialize coach images
        function initCoachImages() {
    const slideData = document.querySelectorAll('[data-coach-image]');
    const coachContainer = document.querySelector('.slider-content');
    
    // Create container for WebGL coach image
    const coachWebGLContainer = document.createElement('div');
    coachWebGLContainer.className = 'coach-webgl-container';
    coachWebGLContainer.style.cssText = `
        position: absolute;
        top: -40px;
        right: 30px;
        width: 160px;
        height: 230px;
        overflow: hidden;
        border-radius: 15px;
        z-index: 10;
    `;
    coachContainer.insertBefore(coachWebGLContainer, coachContainer.firstChild);

    // Initialize WebGL for coach images
    initCoachWebGL(slideData, coachWebGLContainer);
}
 

        // Fallback slider functionality
        function fallbackSlider() {
            const fallbackImages = document.querySelectorAll('.fallback-images img');
            const buttons = document.querySelectorAll('.pagination-container button');
            
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    if (!webglActive) {
                        goToSlide(index);
                        resetAutoRotate();
                    }
                });
            });
        }

        // Navigation buttons
       function setupNavigation() {
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    
    prevBtn.addEventListener('click', () => {
        const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(newSlide);
    });

    nextBtn.addEventListener('click', () => {
        const newSlide = (currentSlide + 1) % totalSlides;
        goToSlide(newSlide);
    });

    // Pagination button event listeners
    paginationBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}
  

        // Auto-rotate functionality
        function startAutoRotate() {
            autoRotateInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % totalSlides);
            }, rotateDelay);
        }

        function resetAutoRotate() {
            clearInterval(autoRotateInterval);
            startAutoRotate();
        }

        // Go to specific slide
        // Update the updateSlideContent function with animations
function initCoachWebGL(images, parent) {
    if (!window.coachWebGL) {
        const renderWidth = 320; // Double resolution for crispness
        const renderHeight = 460;
        
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true // Enable antialiasing
        });
        renderer.setPixelRatio(window.devicePixelRatio * 1.5); // Boost resolution
        renderer.setSize(renderWidth, renderHeight);
        parent.appendChild(renderer.domElement);
        
        // CSS to maintain visual size while using higher resolution
        renderer.domElement.style.width = '160px';
        renderer.domElement.style.height = '230px';
        
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
            renderWidth / -2,
            renderWidth / 2,
            renderHeight / 2,
            renderHeight / -2,
            1,
            1000
        );
        camera.position.z = 1;
        
        // Enhanced shader with grayscale and high-quality filtering
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                dispFactor: { value: 0.0 },
                currentImage: { value: null },
                nextImage: { value: null }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D currentImage;
                uniform sampler2D nextImage;
                uniform float dispFactor;
                
                float grayscale(vec3 color) {
                    return dot(color, vec3(0.299, 0.587, 0.114));
                }
                
                void main() {
                    vec2 uv = vUv;
                    vec4 _currentImage;
                    vec4 _nextImage;
                    float intensity = 0.3;
                    
                    vec4 orig1 = texture2D(currentImage, uv);
                    vec4 orig2 = texture2D(nextImage, uv);
                    
                    _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
                    _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));
                    
                    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
                    
                    // Enhanced grayscale with contrast
                    float gray = grayscale(finalTexture.rgb);
                    vec3 contrasted = vec3(pow(gray, 1.2)); // Gamma correction
                    gl_FragColor = vec4(contrasted, finalTexture.a);
                }
            `,
            transparent: true
        });
        
        const geometry = new THREE.PlaneBufferGeometry(renderWidth, renderHeight, 1);
        const mesh = new THREE.Mesh(geometry, mat);
        scene.add(mesh);
        
        const loader = new THREE.TextureLoader();
        const textures = [];
        
        images.forEach((img, index) => {
            // Load high-res versions by removing size restrictions from URL
            const highResUrl = img.innerHTML.split('?')[0] + '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
            loader.load(highResUrl, (texture) => {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter; // Better quality
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                textures[index] = texture;
                if (index === 0) {
                    mat.uniforms.currentImage.value = texture;
                    mat.uniforms.currentImage.needsUpdate = true;
                }
            });
        });
        
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
        
        window.coachWebGL = { mat, textures, renderer };
    }
}

// 2. Update the goToSlide function for perfectly synchronized transitions
function goToSlide(slideId) {
    // Prevent animation if already animating or same slide
    if (isAnimating || currentSlide === slideId) return;
    
    isAnimating = true;
    currentSlide = slideId;

    // Update pagination immediately
    document.querySelector('.pagination-container .active').classList.remove("active");
    document.querySelector(`.pagination-container button[data-slide="${slideId}"]`).classList.add("active");

    if (webglActive) {
        // Create timeline for synchronized animations
        const timeline = gsap.timeline({
            onStart: () => {
                // Update content immediately (will be animated)
                updateSlideContent(slideId);
                
                // Set initial states for animation
                gsap.set([document.getElementById("slide-title"),
                         document.getElementById("slide-specialty"),
                         document.getElementById("slide-description"),
                         document.getElementById("experience"),
                         document.getElementById("equipment"),
                         document.getElementById("clients"),
                         document.getElementById("coach-classes")], {
                    opacity: 0,  
                    y: 20
                });
                
                // Prepare WebGL transitions
                if (sliderImages[slideId]) {
                    mat.uniforms.nextImage.value = sliderImages[slideId];
                    mat.uniforms.nextImage.needsUpdate = true;
                }
                
                if (window.coachWebGL && window.coachWebGL.textures[slideId]) {
                    const { mat: coachMat, textures } = window.coachWebGL;
                    coachMat.uniforms.nextImage.value = textures[slideId];
                    coachMat.uniforms.nextImage.needsUpdate = true;
                }
            },
            onComplete: () => {
                // Finalize WebGL transitions
                mat.uniforms.currentImage.value = sliderImages[slideId];
                mat.uniforms.currentImage.needsUpdate = true;
                mat.uniforms.dispFactor.value = 0.0;

                if (window.coachWebGL) {
                    const { mat: coachMat, textures } = window.coachWebGL;
                    coachMat.uniforms.currentImage.value = textures[slideId];
                    coachMat.uniforms.currentImage.needsUpdate = true;
                    coachMat.uniforms.dispFactor.value = 0.0;
                }

                isAnimating = false;
            }
        });

        // Add parallel animations:
        // WebGL transitions (1 second)
        timeline.to([mat.uniforms.dispFactor, window.coachWebGL?.mat.uniforms.dispFactor], {
            duration: 1,
            value: 1,
            ease: "expo.inOut"
        }, 0);
        
        // Content animations (staggered over 0.8s)
        timeline.to([document.getElementById("slide-title"),
                    document.getElementById("slide-specialty")], {
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, 0);
        
        timeline.to(document.getElementById("slide-description"), {
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, 0.1);
        
        timeline.to([document.getElementById("experience"),
                    document.getElementById("equipment"),
                    document.getElementById("clients"),
                    document.getElementById("coach-classes")], {
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.05
        }, 0.2);
    } else {
        // Fallback transition
        updateSlideContent(slideId);
        
        // Simple fade animation
        const content = document.querySelector('.slider-content');
        gsap.fromTo(content, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, onComplete: () => { isAnimating = false; } }
        );
    }
} 

        
       
// Update the goToSlide function for perfect synchronization
// Update the goToSlide function for seamless transitions


// Keep this simple update function
 function updateSlideContent(slideIndex) {
        document.getElementById("slide-title").textContent = document.querySelector(`[data-slide-title="${slideIndex}"]`).textContent;
        document.getElementById("slide-specialty").textContent = document.querySelector(`[data-slide-specialty="${slideIndex}"]`).textContent;
        document.getElementById("slide-description").textContent = document.querySelector(`[data-slide-description="${slideIndex}"]`).textContent;
        document.getElementById("experience").textContent = document.querySelector(`[data-experience="${slideIndex}"]`).textContent;
        document.getElementById("equipment").textContent = document.querySelector(`[data-equipment="${slideIndex}"]`).textContent;
        document.getElementById("clients").textContent = document.querySelector(`[data-clients="${slideIndex}"]`).textContent;
        document.getElementById("coach-classes").textContent = document.querySelector(`[data-classes="${slideIndex}"]`).textContent;
        
        // Update active state in pagination
        paginationBtns.forEach(btn => btn.classList.remove('active'));
        paginationBtns[slideIndex].classList.add('active');
    }
window.addEventListener('resize', () => {
    setTimeout(initStatValues, 100);
});

// Initial call when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initStatValues, 500); // Wait for everything to load
});
        // WebGL Displacement Slider
        const displacementSlider = function (opts) {
            let vertex = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `;

            let fragment = `
                varying vec2 vUv;
                uniform sampler2D currentImage;
                uniform sampler2D nextImage;
                uniform float dispFactor;

                void main() {
                    vec2 uv = vUv;
                    vec4 _currentImage;
                    vec4 _nextImage;
                    float intensity = 0.3;

                    vec4 orig1 = texture2D(currentImage, uv);
                    vec4 orig2 = texture2D(nextImage, uv);
                    
                    _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
                    _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

                    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
                    gl_FragColor = finalTexture;
                }
            `;

            let images = opts.images;
            sliderImages = [];
            let parent = opts.parent;
            
            let renderWidth = window.innerWidth;
            let renderHeight = window.innerHeight;

            let renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true
            });

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 1.0);
            renderer.setSize(renderWidth, renderHeight);
            
            // Force canvas styling
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.zIndex = '2';
            
            parent.appendChild(renderer.domElement);

            let loader = new THREE.TextureLoader();
            loader.crossOrigin = "anonymous";

            let loadedCount = 0;
            
            images.forEach((img, index) => {
                loader.load(
                    img.getAttribute("src"),
                    (texture) => {
                        texture.magFilter = texture.minFilter = THREE.LinearFilter;
                        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                        sliderImages[index] = texture;
                        loadedCount++;
                        
                        if (loadedCount === images.length) {
                            initWebGL();
                        }
                    },
                    undefined,
                    (error) => {
                        console.error(`Error loading texture ${index}:`, error);
                        loadedCount++;
                        if (loadedCount === images.length) {
                            console.log('Some textures failed to load, using fallback');
                        }
                    }
                );
            });

            function initWebGL() {
                if (sliderImages.length < 2) {
                    console.log('Not enough textures loaded for WebGL');
                    return;
                }

                webglActive = true;
                
                // Hide fallback images
                document.querySelector('.fallback-images').style.display = 'none';

                scene = new THREE.Scene();
                scene.background = new THREE.Color(0x000000);
                
                camera = new THREE.OrthographicCamera(
                    renderWidth / -2,
                    renderWidth / 2,
                    renderHeight / 2,
                    renderHeight / -2,
                    1,
                    1000
                );
                camera.position.z = 1;

                mat = new THREE.ShaderMaterial({
                    uniforms: {
                        dispFactor: { value: 0.0 },
                        currentImage: { value: sliderImages[0] },
                        nextImage: { value: sliderImages[1] || sliderImages[0] }
                    },
                    vertexShader: vertex,
                    fragmentShader: fragment,
                    transparent: true,
                    opacity: 1.0
                });

                let geometry = new THREE.PlaneBufferGeometry(renderWidth, renderHeight, 1);
                object = new THREE.Mesh(geometry, mat);
                object.position.set(0, 0, 0);
                scene.add(object);

                // Animation loop
                function animate() {
                    requestAnimationFrame(animate);
                    renderer.render(scene, camera);
                }
                animate();

                // Resize handler
                window.addEventListener("resize", function () {
                    const newWidth = window.innerWidth;
                    const newHeight = window.innerHeight;
                    renderer.setSize(newWidth, newHeight);
                    camera.left = newWidth / -2;
                    camera.right = newWidth / 2;
                    camera.top = newHeight / 2;
                    camera.bottom = newHeight / -2;
                    camera.updateProjectionMatrix();
                });
            }
        };

        // Initialize
        function init() {
            document.body.classList.remove("loading");
            
            // Initialize coach images
            initCoachImages();
            
            // Initialize fallback slider
            fallbackSlider();
            
            // Setup navigation buttons
            setupNavigation();
            
            // Start auto-rotate
            startAutoRotate();
            
            // Try to initialize WebGL
            if (typeof THREE !== 'undefined') {
                const el = document.getElementById("slider");
                const imgs = Array.from(document.querySelectorAll(".webgl-images img"));
                
                if (imgs.length > 0) {
                    new displacementSlider({
                        parent: el,
                        images: imgs
                    });
                }
            }
        }

        // Wait for images to load
        function waitForImages() {
            const images = document.querySelectorAll("img");
            let loadedCount = 0;
            const totalImages = images.length;

            if (totalImages === 0) {
                init();
                return;
            }

            function imageLoaded() {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setTimeout(init, 100); // Small delay to ensure everything is ready
                }
            }

            images.forEach(img => {
                if (img.complete) {
                    imageLoaded(); 
                } else {
                    img.addEventListener('load', imageLoaded);
                    img.addEventListener('error', imageLoaded);
                }
            });
        }

        // Start when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForImages);
        } else {
            waitForImages();
        }
   // Update the stat value initialization code (replace your existing implementation)
function initStatValues() {
    document.querySelectorAll('.stat-value-container').forEach(container => {
        const valueEl = container.querySelector('.stat-value');
        
        // Reset previous states and remove all event listeners
        container.classList.remove('scrollable');
        valueEl.classList.remove('scrollable');
        valueEl.style.cssText = ''; // Clear all inline styles
        
        // Remove existing event listeners by cloning the element
        const newValueEl = valueEl.cloneNode(true);
        valueEl.parentNode.replaceChild(newValueEl, valueEl);
        const cleanValueEl = container.querySelector('.stat-value');
        
        // Set base styles
        cleanValueEl.style.whiteSpace = 'nowrap';
        cleanValueEl.style.textAlign = 'center';
        cleanValueEl.style.transform = 'translateX(0)';
        cleanValueEl.style.cursor = 'default';
        
        // Create a more accurate measurement
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const computedStyle = window.getComputedStyle(cleanValueEl);
        
        // Set font for accurate measurement
        ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        
        // Measure text width
        const textWidth = ctx.measureText(cleanValueEl.textContent).width;
        const containerWidth = container.offsetWidth;
        
        // Add buffer for padding/margins (10px buffer)
        const availableWidth = containerWidth - 10;
        
        console.log(`Text: "${cleanValueEl.textContent}" | Text Width: ${textWidth}px | Container Width: ${containerWidth}px | Available: ${availableWidth}px`);
        
        // Determine if scrolling is needed
        const needsScroll = textWidth > availableWidth;
        
        if (needsScroll) {
            console.log('Making scrollable');
            container.classList.add('scrollable');
            cleanValueEl.classList.add('scrollable');
            cleanValueEl.style.textAlign = 'left';
            cleanValueEl.style.cursor = 'grab';
            
            // Scroll interaction setup
            let isDragging = false;
            let startX, startLeft;
            
            // Calculate scroll range with center gaps
            const centerOffset = containerWidth / 2;
            const maxScrollRight = centerOffset; // Allow text start to reach center
            const maxScrollLeft = -(textWidth - centerOffset); // Allow text end to reach center
            
            const setScrollPosition = (left) => {
                const newLeft = Math.min(maxScrollRight, Math.max(maxScrollLeft, left));
                cleanValueEl.style.transform = `translateX(${newLeft}px)`;
                return newLeft;
            };
            
            // Start with text beginning at center
            setScrollPosition(0);
            
            // Mouse events
            const handleMouseDown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startLeft = parseInt(cleanValueEl.style.transform?.replace(/[^\d.-]/g, '') || '0');
                cleanValueEl.style.cursor = 'grabbing';
                e.preventDefault();
            };
            
            const handleMouseMove = (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                setScrollPosition(startLeft + deltaX);
            };
            
            const handleMouseUp = () => {
                isDragging = false;
                cleanValueEl.style.cursor = 'grab';
            };
            
            // Add wheel scroll support for easier scrolling
            const handleWheel = (e) => {
                e.preventDefault();
                const currentLeft = parseInt(cleanValueEl.style.transform?.replace(/[^\d.-]/g, '') || '0');
                const scrollAmount = e.deltaY > 0 ? -30 : 30; // Scroll left/right
                setScrollPosition(currentLeft + scrollAmount);
            };
            
            cleanValueEl.addEventListener('mousedown', handleMouseDown);
            cleanValueEl.addEventListener('wheel', handleWheel);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mouseleave', handleMouseUp);
            
            // Touch events
            const handleTouchStart = (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                startLeft = parseInt(cleanValueEl.style.transform?.replace(/[^\d.-]/g, '') || '0');
                e.preventDefault();
            };
            
            const handleTouchMove = (e) => {
                if (!isDragging) return;
                const deltaX = e.touches[0].clientX - startX;
                setScrollPosition(startLeft + deltaX);
                e.preventDefault(); // Prevent page scroll
            };
            
            const handleTouchEnd = () => {
                isDragging = false;
                cleanValueEl.style.cursor = 'grab';
            };
            
            cleanValueEl.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        } else {
            console.log('Keeping centered - no scroll needed');
            // Short text - ensure it stays centered and non-scrollable
            cleanValueEl.style.textAlign = 'center';
            cleanValueEl.style.cursor = 'default';
            cleanValueEl.style.transform = 'translateX(0)';
        }
    });
} 