$(document).ready(function() {
    const canvas = $('#collageCanvas')[0];
    const ctx = canvas.getContext('2d');
    
    // Initialize canvas size to window size (it never changes after this)
    const initCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas initialized: ${canvas.width}x${canvas.height}`);
    };
    
    initCanvas();
    
    // Get or initialize the fetch interval from localStorage (default: 30000ms = 30 seconds)
    const DEFAULT_FETCH_INTERVAL = 30000;
    let fetchInterval = parseInt(localStorage.getItem('fetchInterval')) || DEFAULT_FETCH_INTERVAL;
    localStorage.setItem('fetchInterval', fetchInterval);
    
    let lastFetchTime = parseInt(localStorage.getItem('lastFetchTime')) || Date.now();
    localStorage.setItem('lastFetchTime', lastFetchTime);
    
    console.log(`Fetch interval: ${fetchInterval}ms (${fetchInterval / 1000} seconds)`);
    
    /**
     * Fetch and draw a new image on the canvas
     */
    const fetchAndDrawImage = () => {
        console.log('Fetching new image...');
        
        $.ajax({
            url: '/api/image',
            method: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function(blob) {
                const img = new Image();
                const url = URL.createObjectURL(blob);
                
                img.onload = function() {
                    // Generate random position ensuring image fits on canvas
                    const maxX = canvas.width - img.width;
                    const maxY = canvas.height - img.height;
                    const x = Math.random() * Math.max(0, maxX);
                    const y = Math.random() * Math.max(0, maxY);
                    
                    // Generate random rotation between -15 and 15 degrees
                    const rotation = (Math.random() - 0.5) * 30 * (Math.PI / 180);
                    
                    // Save context state
                    ctx.save();
                    
                    // Move to position and rotate
                    ctx.translate(x + img.width / 2, y + img.height / 2);
                    ctx.rotate(rotation);
                    
                    // Draw image centered at rotation point
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    
                    // Restore context state
                    ctx.restore();
                    
                    console.log(`Image drawn at (${Math.round(x)}, ${Math.round(y)}) with rotation ${Math.round(rotation * 180 / Math.PI)}°`);
                    
                    // Clean up blob URL
                    URL.revokeObjectURL(url);
                };
                
                img.onerror = function() {
                    console.error('Failed to load image');
                    URL.revokeObjectURL(url);
                };
                
                img.src = url;
            },
            error: function(xhr, status, error) {
                console.error('Error fetching image:', error);
            }
        });
        
        // Update last fetch time
        lastFetchTime = Date.now();
        localStorage.setItem('lastFetchTime', lastFetchTime);
    };
    
    // Calculate time until next fetch based on stored interval
    const calculateNextFetchDelay = () => {
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime;
        const timeUntilNext = Math.max(0, fetchInterval - timeSinceLastFetch);
        return timeUntilNext;
    };
    
    /**
     * Update the fetch interval (can be called from console)
     * Example: updateFetchInterval(60000) for 60 seconds
     */
    window.updateFetchInterval = (newInterval) => {
        if (typeof newInterval !== 'number' || newInterval < 1000) {
            console.error('Invalid interval. Must be a number >= 1000ms');
            return;
        }
        fetchInterval = newInterval;
        localStorage.setItem('fetchInterval', fetchInterval);
        console.log(`Fetch interval updated to ${fetchInterval}ms (${fetchInterval / 1000} seconds)`);
    };
    
    // Fetch first image immediately
    fetchAndDrawImage();
    
    // Schedule subsequent fetches maintaining the 30-second interval
    const scheduleNextFetch = () => {
        const delay = calculateNextFetchDelay();
        console.log(`Next image will be fetched in ${Math.round(delay / 1000)} seconds`);
        
        setTimeout(() => {
            fetchAndDrawImage();
            scheduleNextFetch();
        }, delay);
    };
    
    // Start the fetch cycle
    scheduleNextFetch();
    
    console.log(`Collage initialized. Images will be fetched every ${fetchInterval / 1000} seconds.`);
    console.log('To change the interval, use: updateFetchInterval(milliseconds) in the console');
});
