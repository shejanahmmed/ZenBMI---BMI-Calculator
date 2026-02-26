// Theme Management System
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from LocalStorage
const savedTheme = localStorage.getItem('zenbmi_theme') || 'dark';
if (savedTheme === 'light') {
    htmlElement.classList.remove('dark');
} else {
    htmlElement.classList.add('dark');
}

// Toggle function
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.toggle('dark');
        localStorage.setItem('zenbmi_theme', isDark ? 'dark' : 'light');
        applyForceColors(isDark);
    });
}

function applyForceColors(isDark) {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    
    if (isDark) {
        btn.style.backgroundColor = '#1e293b';
        btn.style.borderColor = '#334155';
        btn.style.color = '#cbd5e1';
    } else {
        btn.style.backgroundColor = '#f1f5f9';
        btn.style.borderColor = '#e2e8f0';
        btn.style.color = '#475569';
    }
}

// Magnetic Liquid Navigation Animation
document.addEventListener('DOMContentLoaded', () => {
    // Initial force apply
    applyForceColors(htmlElement.classList.contains('dark'));
    
    const nav = document.querySelector('nav');
    const indicator = document.getElementById('nav-indicator');
    const links = document.querySelectorAll('.nav-link');

    if (!nav || !indicator) return;

    function moveIndicator(el) {
        const rect = el.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - navRect.left}px`;
        indicator.style.opacity = '1';
    }

    function hideIndicator() {
        // Only hide if we aren't hovering over any link
        // But better to keep it on the "active" link
        const activeLink = document.querySelector('.nav-link.font-bold');
        if (activeLink) {
            moveIndicator(activeLink);
        } else {
            indicator.style.opacity = '0';
        }
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveIndicator(link));
    });

    nav.addEventListener('mouseleave', hideIndicator);

    // Initial position based on active page
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.font-bold');
        if (activeLink) moveIndicator(activeLink);
    }, 500);
});
