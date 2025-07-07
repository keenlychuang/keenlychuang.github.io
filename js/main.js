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
    console.log('Profile img element:', profileImg);
    if (profileImg) {
        const basePath = 'images/profile_';
        const suffix = isDark ? 'dark.png' : 'light.png';
        const newSrc = basePath + suffix;
        console.log('Switching to:', newSrc);
        profileImg.src = newSrc;
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
    
    // Observe all fade elements
    const fadeElements = document.querySelectorAll('.fade-element');
    fadeElements.forEach((el, index) => {
        // Stagger delay for elements in the same container
        if (el.classList.contains('project-card')) {
            el.style.transitionDelay = `${index * 0.1}s`;
        }
        
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
        
        observer.observe(el);
    });
    
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Theme Toggle with Orbital Animation
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDark = savedTheme === 'dark';
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        updateProfilePhoto(isDark);

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateProfilePhoto(isDark);
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