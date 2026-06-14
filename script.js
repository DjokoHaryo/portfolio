document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMobileNav();
  initStickerDragging();
  initPageTransitions();
});

/* ==========================================
   Custom Cursor
   ========================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverElements = document.querySelectorAll('a, button, .neo-btn, .sticker, input, textarea, select, .project-filter-btn');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    elem.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });
}

/* ==========================================
   Mobile Nav Menu
   ========================================== */
function initMobileNav() {
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      menuBtn.textContent = isActive ? '✖' : '☰';
    });
  }
}

/* ==========================================
   Drag & Drop Stickers
   ========================================== */
function initStickerDragging() {
  const stickers = document.querySelectorAll('.sticker');
  
  stickers.forEach(sticker => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    // Helper to get coordinates
    const getCoordinates = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const dragStart = (e) => {
      // Don't drag if clicking buttons inside (if any)
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      
      isDragging = true;
      sticker.style.transition = 'none'; // disable transition while dragging
      
      const coords = getCoordinates(e);
      startX = coords.x;
      startY = coords.y;
      
      // Get the current position
      const rect = sticker.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      // Set fixed positioning while dragging to follow cursor
      sticker.style.position = 'fixed';
      sticker.style.left = `${initialX}px`;
      sticker.style.top = `${initialY}px`;
      sticker.style.margin = '0';
      
      document.addEventListener('mousemove', dragMove, { passive: false });
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      
      // Prevent scrolling on mobile while dragging
      if (e.cancelable) e.preventDefault();
      
      const coords = getCoordinates(e);
      const dx = coords.x - startX;
      const dy = coords.y - startY;
      
      let newX = initialX + dx;
      let newY = initialY + dy;
      
      // Keep inside window bounds
      const stickerWidth = sticker.offsetWidth;
      const stickerHeight = sticker.offsetHeight;
      
      if (newX < 0) newX = 0;
      if (newX > window.innerWidth - stickerWidth) newX = window.innerWidth - stickerWidth;
      if (newY < 0) newY = 0;
      if (newY > window.innerHeight - stickerHeight) newY = window.innerHeight - stickerHeight;
      
      sticker.style.left = `${newX}px`;
      sticker.style.top = `${newY}px`;
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      sticker.style.transition = 'transform 0.1s ease';
      
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchend', dragEnd);
    };

    sticker.addEventListener('mousedown', dragStart);
    sticker.addEventListener('touchstart', dragStart, { passive: true });
  });
}

/* ==========================================
   Page Transitions
   ========================================== */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  // Slide out overlay on page load to reveal content
  window.addEventListener('load', () => {
    overlay.classList.add('slide-in');
    setTimeout(() => {
      overlay.classList.remove('active', 'slide-in');
      overlay.style.transform = 'translateY(100%)'; // Reset positioning for next transition
    }, 600);
  });

  // Intercept local links to slide overlay in before navigating
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check if the link is a local HTML page and not a hash/anchor
    const isLocal = href.endsWith('.html') || href.startsWith('/') || (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#'));
    const isTargetBlank = link.getAttribute('target') === '_blank';

    if (isLocal && !isTargetBlank) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Position overlay at bottom
        overlay.style.transform = 'translateY(100%)';
        overlay.classList.add('active');
        
        // Force reflow
        overlay.offsetHeight;
        
        // Slide up
        overlay.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });
}

/* ==========================================
   Typing Effect (for Hero Section)
   ========================================== */
window.initTypingEffect = function(elementSelector, words, speed = 100, delay = 2000) {
  const el = document.querySelector(elementSelector);
  if (!el) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = speed;

    if (isDeleting) {
      typeSpeed /= 2; // erase faster
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = delay; // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
};
