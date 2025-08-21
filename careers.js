const originalCanvas = document.getElementById('originalCanvas');
const glitchCanvas = document.getElementById('glitchCanvas');
const sourceImage = document.getElementById('sourceImage');

// Set canvas sizes to match container
function resizeCanvases() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    originalCanvas.width = width;
    originalCanvas.height = height;
    glitchCanvas.width = width;
    glitchCanvas.height = height;
}

// Initial resize
resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// Create contexts with willReadFrequently hint
const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
const glitchCtx = glitchCanvas.getContext('2d', { willReadFrequently: true });

// Process image when it loads
sourceImage.onload = function() {
    resizeCanvases();
    setTimeout(processImage, 100);
};

// If image is already loaded
if (sourceImage.complete && sourceImage.naturalWidth > 0) {
    resizeCanvases();
    setTimeout(processImage, 100);
}

function processImage() {
    if (originalCanvas.width === 0 || originalCanvas.height === 0) {
        console.warn('Canvas dimensions are 0, retrying...');
        resizeCanvases();
        setTimeout(processImage, 100);
        return;
    }
    
    // Draw original image
    originalCtx.imageSmoothingEnabled = false;
    originalCtx.drawImage(sourceImage, 0, 0, originalCanvas.width, originalCanvas.height);
    applyGrayscale(originalCtx, originalCanvas.width, originalCanvas.height);
    
    // Draw to glitch canvas
    glitchCtx.imageSmoothingEnabled = false;
    glitchCtx.drawImage(sourceImage, 0, 0, glitchCanvas.width, glitchCanvas.height);
    applyGrayscale(glitchCtx, glitchCanvas.width, glitchCanvas.height);
    applyGlitchEffect();
}

function applyGrayscale(ctx, width, height) {
    if (width <= 0 || height <= 0) {
        console.warn('Invalid canvas dimensions for grayscale');
        return;
    }
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyGlitchEffect() {
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = glitchCanvas.width;
    bufferCanvas.height = glitchCanvas.height;
    const bufferCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });
    bufferCtx.drawImage(glitchCanvas, 0, 0);
    
    // Get all image data at once for better performance
    const bufferImageData = bufferCtx.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
    const bufferPixels = bufferImageData.data;
    
    // Apply glitch passes
    glitchPass(bufferPixels, glitchCtx, 0.6, 8, bufferCanvas.width, bufferCanvas.height);
    glitchPass(bufferPixels, glitchCtx, 0.6, 8, bufferCanvas.width, bufferCanvas.height);
    glitchPass(bufferPixels, glitchCtx, 0.3, 4, bufferCanvas.width, bufferCanvas.height);
}

function glitchPass(sourcePixels, targetCtx, probability, maxDisplacement, width, height) {
    const imageData = targetCtx.getImageData(0, 0, width, height);
    const targetPixels = imageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() < probability) {
                const x1 = x + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * maxDisplacement);
                const y1 = y + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * maxDisplacement);
                
                // Mirror edges with damping
                const nx = Math.max(0, Math.min(width-1, x1 < 0 ? -x1 * 0.3 : x1));
                const ny = Math.max(0, Math.min(height-1, y1 < 0 ? -y1 * 0.3 : y1));
                
                // Calculate positions
                const srcOffset = (ny * width + nx) * 4;
                const targetOffset = (y * width + x) * 4;
                
                // Copy pixel data
                targetPixels[targetOffset] = sourcePixels[srcOffset];     // R
                targetPixels[targetOffset+1] = sourcePixels[srcOffset+1]; // G
                targetPixels[targetOffset+2] = sourcePixels[srcOffset+2]; // B
            }
        }
    }
    targetCtx.putImageData(imageData, 0, 0);
}

// Scroll animation
