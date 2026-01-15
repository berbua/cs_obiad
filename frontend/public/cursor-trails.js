// Cursor Trail Effect - Web 1.0 Style
(function() {
  let trails = [];
  let isEnabled = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = Date.now();
  let isMovingFast = false;
  const MAX_TRAILS = 30; // Zwiększono z 15 do 30
  
  // Trail emoji/icons
  const trailIcons = ['⭐', '✨', '💫', '🌟', '⚡', '💥'];
  
  window.CursorTrails = {
    init: function() {
      // Create trail elements
      for (let i = 0; i < MAX_TRAILS; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.textContent = trailIcons[Math.floor(Math.random() * trailIcons.length)];
        trail.style.cssText = `
          position: fixed;
          pointer-events: none;
          font-size: 20px;
          opacity: 0;
          z-index: 9999;
          transition: opacity 0.3s;
        `;
        document.body.appendChild(trail);
        trails.push({
          element: trail,
          x: 0,
          y: 0,
          opacity: 0
        });
      }
      
      // Mouse move handler
      document.addEventListener('mousemove', this.handleMouseMove.bind(this));
      
      // Animation loop
      this.animate();
    },
    
    handleMouseMove: function(e) {
      if (!isEnabled) return;
      
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = distance / (deltaTime || 1);
      
      // Check if moving fast (speed > 2 pixels per ms)
      if (speed > 2 && !isMovingFast) {
        isMovingFast = true;
        // Notify Clippy about fast movement
        if (window.clippyFastMovement) {
          window.clippyFastMovement();
        }
        // Reset after 3 seconds
        setTimeout(() => { isMovingFast = false; }, 3000);
      }
      
      // Update trail positions
      for (let i = trails.length - 1; i > 0; i--) {
        trails[i].x = trails[i - 1].x;
        trails[i].y = trails[i - 1].y;
        trails[i].opacity = trails[i - 1].opacity * 0.9;
      }
      
      trails[0].x = e.clientX;
      trails[0].y = e.clientY;
      trails[0].opacity = 1;
      
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = currentTime;
    },
    
    animate: function() {
      trails.forEach((trail, index) => {
        trail.element.style.left = (trail.x - 10) + 'px';
        trail.element.style.top = (trail.y - 10) + 'px';
        trail.element.style.opacity = isEnabled ? trail.opacity : 0;
        
        // Slight random movement for more dynamic effect
        if (isEnabled && trail.opacity > 0.1) {
          const jitter = 2;
          trail.x += (Math.random() - 0.5) * jitter;
          trail.y += (Math.random() - 0.5) * jitter;
        }
        
        // Fade out
        trail.opacity *= 0.95;
      });
      
      requestAnimationFrame(this.animate.bind(this));
    },
    
    enable: function() {
      isEnabled = true;
      // Change random icons
      trails.forEach(trail => {
        trail.element.textContent = trailIcons[Math.floor(Math.random() * trailIcons.length)];
      });
    },
    
    disable: function() {
      isEnabled = false;
    },
    
    isEnabled: function() {
      return isEnabled;
    }
  };
  
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.CursorTrails.init();
    });
  } else {
    window.CursorTrails.init();
  }
})();
