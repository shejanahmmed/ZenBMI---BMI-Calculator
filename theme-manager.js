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
    });
}
