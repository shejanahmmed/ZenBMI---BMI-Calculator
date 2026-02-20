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

    function updateBMI() {
        const height = parseFloat(heightSlider.value) / 100;
        const weight = parseFloat(weightSlider.value);
        
        if (isNaN(height) || isNaN(weight) || height === 0) return;
        
        const bmi = (weight / (height * height)).toFixed(1);
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
            // Gauge logic: 0 to 18.5 maps to first ~18%
            pointerPos = (bmi / 18.5) * 18;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Underweight Range';
            tipText = 'Your BMI suggests you are underweight. Consult with a healthcare provider for a balanced nutrition plan.';
            icon = 'info';
        } else if (bmi < 25) {
            status = 'Normal';
            color = '#00e676'; // accent-green
            // 18.5 to 25 maps to 18% to 50%
            pointerPos = 18 + ((bmi - 18.5) / 6.5) * 32;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Healthy Weight';
            tipText = 'Great job! Your BMI suggests you\'re in a healthy weight range. Maintain a balanced diet and regular exercise.';
            icon = 'check_circle';
        } else if (bmi < 30) {
            status = 'Overweight';
            color = '#ff9100'; // accent-orange
            // 25 to 30 maps to 50% to 75%
            pointerPos = 50 + ((bmi - 25) / 5) * 25;
            dashOffset = 283 * (1 - (pointerPos / 100));
            tipHeader = 'Overweight Range';
            tipText = 'Your BMI is in the overweight range. Small changes in diet and activity can help improve your overall health.';
            icon = 'warning';
        } else {
            status = 'Obese';
            color = '#ff1744'; // accent-red
            // 30+ maps to 75% to 100%
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
        
        // Update tip icon color
        tipIcon.className = `material-symbols-outlined shrink-0 mt-0.5`;
        if (status === 'Normal') tipIcon.classList.add('text-accent-green');
        else if (status === 'Underweight') tipIcon.classList.add('text-blue-400');
        else if (status === 'Overweight') tipIcon.classList.add('text-accent-orange');
        else tipIcon.classList.add('text-accent-red');
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

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            heightSlider.value = 175;
            heightValInput.value = 175;
            weightSlider.value = 70;
            weightValInput.value = 70;
            updateBMI();
        };
    }

    // Initial calculation
    updateBMI();
});
