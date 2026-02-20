// Tailwind Configuration
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

// BMI Calculation Logic
document.addEventListener('DOMContentLoaded', () => {
    const heightSlider = document.getElementById('height-slider');
    const heightValInput = document.getElementById('height-val');
    const weightSlider = document.getElementById('weight-slider');
    const weightValInput = document.getElementById('weight-val');
    
    const bmiText = document.querySelector('.text-6xl');
    const statusText = document.querySelector('.uppercase.tracking-widest');
    const gaugeCircle = document.querySelector('.gauge-circle');
    const pointer = document.querySelector('.h-3.w-full .absolute');
    
    const tipTitle = document.getElementById('tip-title');
    const tipDescription = document.getElementById('tip-desc');
    const tipIcon = document.getElementById('tip-icon');
    const personNameInput = document.getElementById('person-name');

    // Load settings
    const settings = JSON.parse(localStorage.getItem('zenbmi_settings') || '{"height": "metric", "weight": "metric"}');
    
    // UI adjustment for Units
    if (settings.height === 'imperial') {
        document.getElementById('height-unit').innerText = 'in';
        heightSlider.max = 100; // Inches
        heightSlider.min = 40;
        heightSlider.value = 69;
        heightValInput.value = 69;
    }
    
    if (settings.weight === 'imperial') {
        document.getElementById('weight-unit').innerText = 'lbs';
        weightSlider.max = 450; // Pounds
        weightSlider.min = 60;
        weightSlider.value = 155;
        weightValInput.value = 155;
    }

    function updateBMI(save = false) {
        let heightValue = parseFloat(heightSlider.value);
        let weightValue = parseFloat(weightSlider.value);
        
        if (isNaN(heightValue) || isNaN(weightValue) || heightValue === 0) return;

        let bmi = 0;
        if (settings.height === 'metric' && settings.weight === 'metric') {
            const h = heightValue / 100;
            bmi = (weightValue / (h * h)).toFixed(1);
        } else if (settings.height === 'imperial' && settings.weight === 'imperial') {
            bmi = (703 * (weightValue / (heightValue * heightValue))).toFixed(1);
        } else {
            // Mixed units (handle just in case)
            let h_m = settings.height === 'imperial' ? heightValue * 0.0254 : heightValue / 100;
            let w_kg = settings.weight === 'imperial' ? weightValue * 0.453592 : weightValue;
            bmi = (w_kg / (h_m * h_m)).toFixed(1);
        }

        bmiText.innerText = bmi;

        let status = '';
        let color = '#258cf4';
        let dashOffset = 283;
        let pointerPos = 0;
        let tipHeader = '';
        let tipText = '';
        let icon = 'check_circle';

        if (bmi < 18.5) {
            status = 'Underweight';
            color = '#60a5fa'; // blue-400
            pointerPos = (bmi / 18.5) * 18;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Underweight Range';
            tipText = 'Your BMI suggests you are underweight. Consult with a healthcare provider for a balanced nutrition plan.';
            icon = 'info';
        } else if (bmi < 25) {
            status = 'Normal';
            color = '#00e676'; // accent-green
            pointerPos = 18 + ((bmi - 18.5) / 6.5) * 32;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Healthy Weight';
            tipText = 'Great job! Your BMI suggests you\'re in a healthy weight range. Maintain a balanced diet and regular exercise.';
            icon = 'check_circle';
        } else if (bmi < 30) {
            status = 'Overweight';
            color = '#ff9100'; // accent-orange
            pointerPos = 50 + ((bmi - 25) / 5) * 25;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Overweight Range';
            tipText = 'Your BMI is in the overweight range. Small changes in diet and activity can help improve your overall health.';
            icon = 'warning';
        } else {
            status = 'Obese';
            color = '#ff1744'; // accent-red
            pointerPos = 75 + Math.min((bmi - 30) / 10, 1) * 25;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Obese Range';
            tipText = 'Your BMI suggests obesity. Consider consulting with a doctor to discuss health risks and weight management strategies.';
            icon = 'error';
        }

        statusText.innerText = status;
        statusText.style.color = color;
        gaugeCircle.style.stroke = color;
        gaugeCircle.style.strokeDashoffset = dashOffset;
        pointer.style.left = `${pointerPos}%`;
        
        tipTitle.innerText = tipHeader;
        tipDescription.innerText = tipText;
        tipIcon.innerText = icon;
        
        tipIcon.className = `material-symbols-outlined shrink-0 mt-0.5`;
        if (status === 'Normal') tipIcon.classList.add('text-accent-green');
        else if (status === 'Underweight') tipIcon.classList.add('text-blue-400');
        else if (status === 'Overweight') tipIcon.classList.add('text-accent-orange');
        else tipIcon.classList.add('text-accent-red');

        if (save) {
            const h_unit = settings.height === 'metric' ? 'cm' : 'in';
            const w_unit = settings.weight === 'metric' ? 'kg' : 'lbs';
            const historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
            const entry = {
                id: Date.now(),
                name: personNameInput.value || 'Guest',
                date: new Date().toLocaleString(),
                height: `${heightSlider.value} ${h_unit}`,
                weight: `${weightSlider.value} ${w_unit}`,
                bmi: bmi,
                status: status,
                color: color
            };
            historyData.push(entry);
            localStorage.setItem('zenbmi_history', JSON.stringify(historyData));
            alert('BMI data saved to history!');
        }
    }

    // Input listeners
    const handleHeightInput = (e) => {
        heightSlider.value = e.target.value;
        heightValInput.value = e.target.value;
        updateBMI();
    };

    const handleWeightInput = (e) => {
        weightSlider.value = e.target.value;
        weightValInput.value = e.target.value;
        updateBMI();
    };

    heightSlider.addEventListener('input', handleHeightInput);
    heightValInput.addEventListener('input', handleHeightInput);
    weightSlider.addEventListener('input', handleWeightInput);
    weightValInput.addEventListener('input', handleWeightInput);

    // Form submission
    document.getElementById('bmi-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateBMI(true);
    });

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            personNameInput.value = '';
            if (settings.height === 'metric') {
                heightSlider.value = 175;
                heightValInput.value = 175;
            } else {
                heightSlider.value = 69;
                heightValInput.value = 69;
            }

            if (settings.weight === 'metric') {
                weightSlider.value = 70;
                weightValInput.value = 70;
            } else {
                weightSlider.value = 155;
                weightValInput.value = 155;
            }
            updateBMI();
        };
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    function toggleMenu(show) {
        if (show) {
            mobileMenu.classList.remove('translate-x-full');
            mobileBackdrop.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.onclick = () => toggleMenu(true);
    if (closeMobileMenu) closeMobileMenu.onclick = () => toggleMenu(false);
    if (mobileBackdrop) mobileBackdrop.onclick = () => toggleMenu(false);

    // Initial calculation
    updateBMI();
});
