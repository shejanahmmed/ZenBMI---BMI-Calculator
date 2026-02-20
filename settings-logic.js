// Tailwind Configuration (Same as others)
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#258cf4",
                "background-light": "#f5f7f8",
                "background-dark": "#101922",
                "card-dark": "#1a2632",
                "input-dark": "#23303e",
                "accent-green": "#00e676",
                "accent-yellow": "#ffea00",
                "accent-red": "#ff1744",
                "accent-orange": "#ff9100",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
        },
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const heightUnitInputs = document.getElementsByName('heightUnit');
    const weightUnitInputs = document.getElementsByName('weightUnit');
    const saveBtn = document.getElementById('save-settings');
    const saveStatus = document.getElementById('save-status');

    // Load current settings
    const settings = JSON.parse(localStorage.getItem('zenbmi_settings') || '{"height": "metric", "weight": "metric"}');
    
    heightUnitInputs.forEach(input => {
        if (input.value === settings.height) input.checked = true;
    });

    weightUnitInputs.forEach(input => {
        if (input.value === settings.weight) input.checked = true;
    });

    saveBtn.onclick = () => {
        const newSettings = {
            height: Array.from(heightUnitInputs).find(i => i.checked).value,
            weight: Array.from(weightUnitInputs).find(i => i.checked).value
        };

        localStorage.setItem('zenbmi_settings', JSON.stringify(newSettings));
        
        saveStatus.style.opacity = '1';
        setTimeout(() => {
            saveStatus.style.opacity = '0';
        }, 2000);
    };
});
