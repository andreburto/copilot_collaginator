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
    
    // Get or create a unique collage ID for this session
    let collageId = localStorage.getItem('collageId');
    if (!collageId) {
        // Generate a UUID-like ID
        collageId = 'collage-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('collageId', collageId);
        console.log(`New collage session created: ${collageId}`);
    } else {
        console.log(`Resuming collage session: ${collageId}`);
    }
    
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
            dataType: 'json',
            success: function(data) {
                const imageUrl = data.link;
                const thumbUrl = data.thumb;
                
                if (!thumbUrl) {
                    console.error('No thumbnail URL received from server');
                    return;
                }
                
                console.log(`Received image URL: ${imageUrl}`);
                console.log(`Thumbnail URL: ${thumbUrl}`);
                
                const img = new Image();
                
                img.onload = function() {
                    // Generate random position ensuring image fits on canvas
                    const maxX = canvas.width - img.width;
                    const maxY = canvas.height - img.height;
                    const x = Math.random() * Math.max(0, maxX);
                    const y = Math.random() * Math.max(0, maxY);
                    
                    // Generate random rotation between -15 and 15 degrees
                    const rotationRad = (Math.random() - 0.5) * 30 * (Math.PI / 180);
                    const rotationDeg = Math.round(rotationRad * 180 / Math.PI);
                    
                    // Save context state
                    ctx.save();
                    
                    // Move to position and rotate
                    ctx.translate(x + img.width / 2, y + img.height / 2);
                    ctx.rotate(rotationRad);
                    
                    // Draw image centered at rotation point
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    
                    // Restore context state
                    ctx.restore();
                    
                    const timestamp = new Date().toISOString();
                    console.log(`[${timestamp}] Image added to collage at position (${Math.round(x)}, ${Math.round(y)}) with rotation ${rotationDeg}°`);
                    
                    // Save to backend with the full image URL
                    saveToCollage(imageUrl, { x: Math.round(x), y: Math.round(y) }, rotationDeg);
                };
                
                img.onerror = function() {
                    console.error('Failed to load image from URL:', thumbUrl);
                };
                
                // Load the thumbnail image for drawing
                img.src = thumbUrl;
            },
            error: function(xhr, status, error) {
                console.error('Error fetching image:', error);
            }
        });
        
        // Update last fetch time
        lastFetchTime = Date.now();
        localStorage.setItem('lastFetchTime', lastFetchTime);
    };
    
    /**
     * Save image data to the backend
     */
    const saveToCollage = (imageUrl, position, rotation) => {
        $.ajax({
            url: '/api/collage',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                collage_id: collageId,
                image_url: imageUrl,
                position: position,
                rotation: rotation
            }),
            success: function(response) {
                console.log('Image saved to collage:', response.image_id);
            },
            error: function(xhr, status, error) {
                console.error('Error saving to collage:', error);
            }
        });
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
    
    /**
     * Create a new collage session (can be called from console)
     */
    window.newCollageSession = () => {
        collageId = 'collage-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('collageId', collageId);
        console.log(`New collage session created: ${collageId}`);
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('Canvas cleared');
    };
    
    // Fetch first image immediately
    fetchAndDrawImage();
    
    // Schedule subsequent fetches maintaining the interval
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
    console.log('To start a new collage session, use: newCollageSession() in the console');
});
