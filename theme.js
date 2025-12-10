// DaisyUI theme management with localStorage
document.addEventListener('DOMContentLoaded', () => {
    const themeController = document.querySelector('.theme-controller');
    const body = document.body;
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    // Set checkbox state based on saved theme
    if (savedTheme === 'dark') {
        themeController.checked = true;
    }
    
    // Listen for theme toggle
    themeController.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
