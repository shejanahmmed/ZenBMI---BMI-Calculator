// Tailwind Configuration (Same as index)
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
    
    // Edit Modal Elements
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
            const card = document.createElement('div');
            card.className = 'glass-card bg-white/90 dark:bg-card-dark p-6 rounded-2xl flex flex-col gap-4 shadow-xl border border-slate-200 dark:border-slate-800 relative group transition-all hover:scale-[1.02]';
            
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs font-semibold uppercase tracking-widest text-slate-500">${entry.date}</span>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">${entry.name}</h3>
                    </div>
                    <div class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style="background-color: ${entry.color}">
                        ${entry.status}
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 mt-2">
                    <div class="bg-slate-100/50 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-slate-100 dark:border-transparent">
                        <span class="text-[10px] font-semibold text-slate-500 uppercase">Height</span>
                        <span class="text-lg font-bold text-slate-900 dark:text-white">${entry.height}</span>
                    </div>
                    <div class="bg-slate-100/50 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-slate-100 dark:border-transparent">
                        <span class="text-[10px] font-semibold text-slate-500 uppercase">Weight</span>
                        <span class="text-lg font-bold text-slate-900 dark:text-white">${entry.weight}</span>
                    </div>
                    <div class="bg-primary/5 dark:bg-input-dark p-3 rounded-xl flex flex-col items-center border border-primary/20">
                        <span class="text-[10px] font-semibold text-primary uppercase">BMI</span>
                        <span class="text-lg font-bold text-primary">${entry.bmi}</span>
                    </div>
                </div>

                <div class="flex gap-3 mt-4">
                    <button onclick="editRecord(${entry.id})" class="flex-1 h-10 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-lg">edit</span>
                        Edit
                    </button>
                    <button onclick="deleteRecord(${entry.id})" class="flex-1 h-10 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-accent-red/5 hover:text-accent-red hover:border-accent-red/20 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-lg">delete</span>
                        Delete
                    </button>
                </div>
            `;
            historyContainer.appendChild(card);
        });
    }

    window.deleteRecord = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
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
            editHeight.value = entry.height;
            editWeight.value = entry.weight;
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
            const h = parseFloat(editHeight.value) / 100;
            const w = parseFloat(editWeight.value);
            const bmi = (w / (h * h)).toFixed(1);
            
            let status = 'Normal';
            let color = '#00e676';
            if (bmi < 18.5) { status = 'Underweight'; color = '#60a5fa'; }
            else if (bmi < 30) { status = 'Overweight'; color = '#ff9100'; }
            else if (bmi >= 30) { status = 'Obese'; color = '#ff1744'; }

            historyData[index] = {
                ...historyData[index],
                name: editName.value,
                height: editHeight.value,
                weight: editWeight.value,
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
        downloadBtn.onclick = () => {
            const historyData = JSON.parse(localStorage.getItem('zenbmi_history') || '[]');
            if (historyData.length === 0) {
                alert('No history records to download.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add Header
            doc.setFontSize(22);
            doc.setTextColor(37, 140, 244); // Primary color
            doc.text('ZenBMI - History Report', 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
            doc.text('Developed by Farjan Ahmmed', 14, 33);

            // Prepare Table Data
            const tableColumn = ["Date", "Name", "Height", "Weight", "BMI", "Status"];
            const tableRows = [];

            historyData.reverse().forEach(entry => {
                const rowData = [
                    entry.date,
                    entry.name,
                    entry.height,
                    entry.weight,
                    entry.bmi,
                    entry.status
                ];
                tableRows.push(rowData);
            });

            // Generate Table
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                headStyles: { fillColor: [37, 140, 244] },
                styles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [245, 247, 248] }
            });

            // Save PDF
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
