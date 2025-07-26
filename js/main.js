// Typing Animation
const phrases = [
    'Developer, Writer, Human',
    'Creating Digital Experiences',
    'Building Meaningful Software',
    'Exploring Technology & Design'
];
let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;

function updateProfilePhoto(isDark) {
    const profileImg = document.querySelector('.profile-photo img');
    const humanBadge = document.getElementById('humanBadge');
    if (profileImg) {
        // Fade out
        profileImg.style.opacity = '0';
        
        setTimeout(() => {
            // Change source
            const basePath = 'images/profile_';
            const suffix = isDark ? 'dark.webp' : 'light.webp';
            profileImg.src = basePath + suffix;
            
            // Fade back in
            profileImg.style.opacity = '1';
        }, 100);
    }
    
    console.log('Profile img element:', profileImg);
    if (profileImg) {
        const basePath = 'images/profile_';
        const suffix = isDark ? 'dark.webp' : 'light.webp';
        const newSrc = basePath + suffix;
        console.log('Switching to:', newSrc);
        profileImg.src = newSrc;
    }
    
    // Update human badge
    if (humanBadge) {
        const badgePath = isDark ? 
            'images/written_by_human/Written-By-a-Human-Not-By-AI-Badge-black.svg' :
            'images/written_by_human/Written-By-a-Human-Not-By-AI-Badge-white.svg';
        humanBadge.src = badgePath;
    }
}

function handleImageLoad() {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
            // Also remove shimmer from parent container
            const container = img.closest('.life-image, .profile-photo');
            if (container) container.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                const container = img.closest('.life-image, .profile-photo');
                if (container) container.classList.add('loaded');
            });
        }
    });
}

function updateFavicon(isDark) {
    const favicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (favicon) {
        const faviconPath = isDark ? 
            'images/favicons/favicon_dark_dots/dots_dark.svg' :
            'images/favicons/favicon_light_dots/dots_light.svg';
        favicon.href = faviconPath;
    }
}

// Simple fade-in animation
function fadeInSubtitle() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    // Set the text once and fade it in
    typingText.textContent = 'Developer, Writer, Human';
    typingText.style.opacity = '0';
    typingText.style.transition = 'opacity 1.5s ease';
    
    // Trigger fade-in after a brief delay
    setTimeout(() => {
        typingText.style.opacity = '1';
    }, 1000);
}

function typeText() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    const phrase = phrases[currentPhrase];
    
    if (isDeleting) {
        typingText.textContent = phrase.substring(0, currentChar - 1);
        currentChar--;
    } else {
        typingText.textContent = phrase.substring(0, currentChar + 1);
        currentChar++;
    }

    if (!isDeleting && currentChar === phrase.length) {
        setTimeout(() => isDeleting = true, 4000);
    } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
    }

    setTimeout(typeText, isDeleting ? 50 : 100);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Interactive Functions
function showDemo(project) {
    alert(`Opening ${project} demo - This would navigate to the actual project!`);
}

function showContactForm() {
    alert('Contact form would open here!');
}

function showResume() {
    alert('Resume would open here!');
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    handleImageLoad();

    // Initialize habit tracker if container exists
    const habitContainer = document.getElementById('habit-tracker-root');
    if (habitContainer) {
        new HabitTracker('habit-tracker-root');
    }

    // Set js-loaded class for animations
    document.body.classList.add('js-loaded');

    // Animation control - add this function to toggle animations
    window.toggleAnimations = function() {
        document.body.classList.toggle('no-animations');
        localStorage.setItem('animationsEnabled', 
            !document.body.classList.contains('no-animations'));
    };

    // Load animation preference - default to disabled
    const animationsDisabled = localStorage.getItem('animationsEnabled') !== 'true';
    if (animationsDisabled) {
        document.body.classList.add('no-animations');
    }

    // Setup intersection observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Uniform fade in for all elements
    const headerElements = document.querySelectorAll('.display, .subtitle, nav, .profile, footer');
    headerElements.forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });
    
    // Observe all fade elements
    const fadeElements = document.querySelectorAll('.fade-element');
    fadeElements.forEach((el, index) => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
        
        observer.observe(el);
    });
    
    // Make headers linkable - exclude page titles and display headers
    document.querySelectorAll('h2:not(.display), h3:not(.display), h4, h5, h6').forEach(header => {
        // Skip if it's inside a .header element
        if (header.closest('.header')) return;
        
        if (!header.id) {
            const id = header.textContent.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            header.id = id;
        }
        
        header.addEventListener('click', () => {
            window.location.hash = header.id;
            navigator.clipboard.writeText(window.location.href);
        });
    });

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Theme Toggle with Orbital Animation
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDark = savedTheme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark-mode'); // Changed from body to documentElement
        }
        updateProfilePhoto(isDark);
        updateFavicon(isDark); 

        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateProfilePhoto(isDark);
            updateFavicon(isDark);
        });
    }

    // Scroll Progress Bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Update last modified date (if element exists)
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = new Date().toLocaleDateString();
    }
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
});