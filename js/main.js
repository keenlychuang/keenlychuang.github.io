// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Scroll Progress Bar
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});

// Typing Animation
const typingText = document.getElementById('typingText');
const phrases = [
    'Developer, Writer, Human',
    'Creating Digital Experiences',
    'Building Meaningful Software',
    'Exploring Technology & Design'
];
let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;

function typeText() {
    const phrase = phrases[currentPhrase];
    
    if (isDeleting) {
        typingText.textContent = phrase.substring(0, currentChar - 1);
        currentChar--;
    } else {
        typingText.textContent = phrase.substring(0, currentChar + 1);
        currentChar++;
    }

    if (!isDeleting && currentChar === phrase.length) {
        setTimeout(() => isDeleting = true, 2000);
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

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Start typing animation
    setTimeout(typeText, 2000);
    
    // Setup intersection observer
    const animatedElements = document.querySelectorAll('.project-card, .contact-item');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
        
        observer.observe(el);
    });
    
    // Update last modified date
    document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
});

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