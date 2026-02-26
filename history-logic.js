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

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');
    const emptyState = document.getElementById('empty-state');
    const clearAllBtn = document.getElementById('clear-all');
    
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editId = document.getElementById('edit-id');
    const editName = document.getElementById('edit-name');
    const editHeight = document.getElementById('edit-height');
    const editWeight = document.getElementById('edit-weight');
    const closeModal = document.getElementById('close-modal');

    function loadHistory() {
        const historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
        
        if (historyData.length === 0) {
            historyContainer.innerHTML = '';
            emptyState.classList.remove('hidden');
            clearAllBtn.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        clearAllBtn.classList.remove('hidden');
        
        historyContainer.innerHTML = '';

        historyData.reverse().forEach(entry => {
            const wrapper = document.createElement('div');
            wrapper.className = 'history-card-container w-full';
            
            wrapper.innerHTML = `
                <div class="history-card-inner w-full h-full">
                    <!-- FRONT: Data Snapshot -->
                    <div class="card-front glass-card bg-white/90 dark:bg-card-dark p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">${entry.date}</span>
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">${entry.name}</h3>
                            </div>
                            <div class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white" style="background-color: ${entry.color}">
                                ${entry.status}
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-2 mt-auto">
                            <div class="bg-slate-50 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-slate-100 dark:border-slate-800">
                                <span class="text-[9px] font-bold text-slate-400 uppercase">Height</span>
                                <span class="text-sm font-bold text-slate-900 dark:text-white">${entry.height}</span>
                            </div>
                            <div class="bg-slate-50 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-slate-100 dark:border-slate-800">
                                <span class="text-[9px] font-bold text-slate-400 uppercase">Weight</span>
                                <span class="text-sm font-bold text-slate-900 dark:text-white">${entry.weight}</span>
                            </div>
                            <div class="bg-primary/5 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-primary/20">
                                <span class="text-[9px] font-bold text-primary uppercase">BMI</span>
                                <span class="text-sm font-bold text-primary">${entry.bmi}</span>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-slate-300 dark:text-slate-600">
                            <span class="text-[9px] font-bold uppercase">Click to Manage</span>
                            <span class="material-symbols-outlined text-sm">cached</span>
                        </div>
                    </div>

                    <!-- BACK: Management Lab -->
                    <div class="card-back p-6 shadow-2xl border-2 border-primary/30 flex flex-col gap-3 rounded-3xl">
                        <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <span class="material-symbols-outlined">settings_suggest</span>
                        </div>
                        <h4 class="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs">Record Actions</h4>
                        
                        <button onclick="editRecord(${entry.id})" class="w-full h-11 bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white text-slate-600 dark:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-white/10">
                            <span class="material-symbols-outlined text-base">edit</span>
                            EDIT
                        </button>
                        <button onclick="deleteRecord(${entry.id})" class="w-full h-11 bg-slate-50 dark:bg-white/5 hover:bg-accent-red hover:text-white text-slate-500 dark:text-white/70 rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-white/10">
                            <span class="material-symbols-outlined text-base">delete</span>
                            DELETE
                        </button>
                    </div>
                </div>
            `;

            // Add 3D Tilt Logic
            let isFlipped = false;
            wrapper.addEventListener('click', (e) => {
                // Don't flip if buttons are clicked
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                
                isFlipped = !isFlipped;
                const inner = wrapper.querySelector('.history-card-inner');
                if (isFlipped) {
                    inner.style.transform = 'rotateY(180deg)';
                } else {
                    inner.style.transform = 'rotateY(0deg)';
                }
            });

            wrapper.addEventListener('mousemove', (e) => {
                if (isFlipped) return;
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                
                const inner = wrapper.querySelector('.history-card-inner');
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            wrapper.addEventListener('mouseleave', () => {
                if (isFlipped) return;
                const inner = wrapper.querySelector('.history-card-inner');
                inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });

            historyContainer.appendChild(wrapper);
        });
    }

    window.deleteRecord = (id) => {
        if (confirm('Permanently delete this record?')) {
            let historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
            historyData = historyData.filter(e => e.id !== id);
            localStorage.setItem('zenbmi_history', JSON.stringify(historyData));
            loadHistory();
        }
    };

    window.editRecord = (id) => {
        const historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
        const entry = historyData.find(e => e.id === id);
        if (entry) {
            editId.value = entry.id;
            editName.value = entry.name;
            editHeight.value = parseFloat(entry.height);
            editWeight.value = parseFloat(entry.weight);
            editModal.classList.remove('hidden');
        }
    };

    closeModal.onclick = () => editModal.classList.add('hidden');

    editForm.onsubmit = (e) => {
        e.preventDefault();
        const id = parseInt(editId.value);
        let historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
        const index = historyData.findIndex(e => e.id === id);
        
        if (index !== -1) {
            const settings = JSON.parse(localStorage.getItem('zenbmi_settings') || '{"height": "metric", "weight": "metric"}');
            const hVal = parseFloat(editHeight.value);
            const wVal = parseFloat(editWeight.value);
            
            let bmi = 0;
            if (settings.height === 'metric') {
                const h_m = hVal / 100;
                bmi = (wVal / (h_m * h_m)).toFixed(1);
            } else {
                bmi = (703 * (wVal / (hVal * hVal))).toFixed(1);
            }
            
            let status = 'Normal';
            let color = '#00e676';
            if (bmi < 18.5) { status = 'Underweight'; color = '#60a5fa'; }
            else if (bmi >= 25 && bmi < 30) { status = 'Overweight'; color = '#ff9100'; }
            else if (bmi >= 30) { status = 'Obese'; color = '#ff1744'; }

            const h_unit = settings.height === 'metric' ? 'cm' : 'in';
            const w_unit = settings.weight === 'metric' ? 'kg' : 'lbs';

            historyData[index] = {
                ...historyData[index],
                name: editName.value,
                height: `${hVal} ${h_unit}`,
                weight: `${wVal} ${w_unit}`,
                bmi: bmi,
                status: status,
                color: color
            };

            localStorage.setItem('zenbmi_history', JSON.stringify(historyData));
            editModal.classList.add('hidden');
            loadHistory();
        }
    };

    clearAllBtn.onclick = () => {
        if (confirm('Clear all BMI records? This cannot be undone.')) {
            localStorage.setItem('zenbmi_history', '[]');
            loadHistory();
        }
    };

    // PDF Download Logic
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent card flip if button is inside container
            const historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
            if (historyData.length === 0) {
                alert('No history records to download.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(22);
            doc.setTextColor(37, 140, 244);
            doc.text('ZenBMI - History Report', 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
            doc.text('Developed by Farjan Ahmmed', 14, 33);

            const tableColumn = ["Date", "Name", "Height", "Weight", "BMI", "Status"];
            const tableRows = [];

            historyData.reverse().forEach(entry => {
                tableRows.push([entry.date, entry.name, entry.height, entry.weight, entry.bmi, entry.status]);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                headStyles: { fillColor: [37, 140, 244] },
                styles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [245, 247, 248] }
            });

            doc.save(`ZenBMI_Report_${Date.now()}.pdf`);
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

    loadHistory();

    // Reveal page
    document.body.classList.add('loaded');
});
