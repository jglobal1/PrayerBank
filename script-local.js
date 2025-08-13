// Prayer Report App - Local Version (No Firebase)
class PrayerReportApp {
    constructor() {
        this.prayerReports = JSON.parse(localStorage.getItem('prayerReports')) || [];
        this.currentUser = localStorage.getItem('currentUser') || '';
        this.isAdmin = false;
        this.adminPassword = 'church2024';
        this.isSubmitting = false;

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadUserReports();
        this.checkAdminAuth();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        console.log('Navigation listeners set up');

        // Form submission
        const prayerForm = document.getElementById('prayerForm');
        if (prayerForm) {
            prayerForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            console.log('Form listener set up');
        } else {
            console.error('Prayer form not found!');
        }

        // Modal
        const modal = document.getElementById('successModal');
        if (modal) {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
            window.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
            console.log('Modal listeners set up');
        } else {
            console.error('Success modal not found!');
        }

        // Export buttons
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportUserData());
        }
        
        const exportAllBtn = document.getElementById('exportAllBtn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllData());
        }
        
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }

        // Month filter
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            monthFilter.addEventListener('change', (e) => this.filterByMonth(e.target.value));
        }

        // Admin login
        this.setupAdminLogin();

        // Quick time buttons
        this.setupQuickTimeButtons();
        
        console.log('All event listeners set up');
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Remove active class from all buttons and content
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected button and content
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);

        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');

        // Load specific content
        if (tabName === 'my-reports') {
            this.loadUserReports();
        } else if (tabName === 'admin-dashboard') {
            this.loadAdminDashboard();
        }
    }

    setupAdminLogin() {
        const adminLoginBtn = document.createElement('button');
        adminLoginBtn.textContent = 'Admin Login';
        adminLoginBtn.className = 'admin-login-btn';
        
        adminLoginBtn.addEventListener('click', () => {
            if (this.isAdmin) {
                this.logoutAdmin();
            } else {
                this.showAdminLogin();
            }
        });
        
        document.body.appendChild(adminLoginBtn);
    }

    showAdminLogin() {
        const password = prompt('Enter Admin Password:');
        if (password === this.adminPassword) {
            this.isAdmin = true;
            localStorage.setItem('adminAuthenticated', 'true');
            this.showAdminFeatures();
            alert('Admin access granted!');
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    }

    logoutAdmin() {
        this.isAdmin = false;
        localStorage.removeItem('adminAuthenticated');
        this.hideAdminFeatures();
        alert('Logged out of admin mode.');
    }

    checkAdminAuth() {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
            this.isAdmin = true;
            this.showAdminFeatures();
        }
    }

    showAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('show'));
    }

    hideAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('show'));
    }

    setupQuickTimeButtons() {
        // Start time quick buttons
        document.querySelectorAll('.quick-time-btn[data-type="start"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeString = e.target.dataset.time;
                this.setTimeFromString('start', timeString);
                
                // Update active state
                document.querySelectorAll('.quick-time-btn[data-type="start"]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // End time quick buttons
        document.querySelectorAll('.quick-time-btn[data-type="end"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const timeString = e.target.dataset.time;
                this.setTimeFromString('end', timeString);
                
                // Update active state
                document.querySelectorAll('.quick-time-btn[data-type="end"]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    setTimeFromString(type, timeString) {
        const [time, period] = timeString.split(' ');
        const [hour, minute] = time.split(':');
        
        const hourSelect = document.getElementById(`${type}Hour`);
        const minuteSelect = document.getElementById(`${type}Minute`);
        const periodSelect = document.getElementById(`${type}Period`);
        
        if (hourSelect) hourSelect.value = hour;
        if (minuteSelect) minuteSelect.value = minute;
        if (periodSelect) periodSelect.value = period;
    }

    getTimeValue(type) {
        const hour = document.getElementById(`${type}Hour`).value;
        const minute = document.getElementById(`${type}Minute`).value;
        const period = document.getElementById(`${type}Period`).value;
        
        if (!hour || !minute || !period) return '';
        
        let hour24 = parseInt(hour);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        
        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    }

    resetTimePickers() {
        // Reset start time
        document.getElementById('startHour').value = '';
        document.getElementById('startMinute').value = '';
        document.getElementById('startPeriod').value = '';
        document.querySelectorAll('.quick-time-btn[data-type="start"]').forEach(btn => btn.classList.remove('active'));
        
        // Reset end time
        document.getElementById('endHour').value = '';
        document.getElementById('endMinute').value = '';
        document.getElementById('endPeriod').value = '';
        document.querySelectorAll('.quick-time-btn[data-type="end"]').forEach(btn => btn.classList.remove('active'));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        
        const submitBtn = document.querySelector('#prayerForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = new FormData(e.target);
            const memberName = formData.get('memberName').trim();
            const prayerDate = formData.get('prayerDate');
            const prayerType = formData.get('prayerType');
            const startTime = this.getTimeValue('start');
            const endTime = this.getTimeValue('end');
            const prayerNotes = formData.get('prayerNotes').trim();

            // Validation
            if (!memberName) {
                this.showErrorMessage('Please enter your name.');
                return;
            }
            if (!prayerDate) {
                this.showErrorMessage('Please select a prayer date.');
                return;
            }
            if (!prayerType) {
                this.showErrorMessage('Please select a prayer type.');
                return;
            }
            if (!startTime || !endTime) {
                this.showErrorMessage('Please enter both start and end times.');
                return;
            }

            // Calculate duration
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            const durationMs = end - start;
            
            if (durationMs <= 0) {
                this.showErrorMessage('End time must be after start time.');
                return;
            }

            const durationHours = durationMs / (1000 * 60 * 60);

            // Create report object
            const report = {
                id: Date.now().toString(),
                memberName,
                prayerDate,
                prayerType,
                startTime,
                endTime,
                durationHours,
                prayerNotes,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            this.prayerReports.push(report);
            localStorage.setItem('prayerReports', JSON.stringify(this.prayerReports));
            localStorage.setItem('currentUser', memberName);

            // Show success modal
            this.showSuccessModal(report);
            
            // Reset form
            e.target.reset();
            this.resetTimePickers();
            
            // Reload reports
            this.loadUserReports();

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage('An error occurred while submitting your report.');
        } finally {
            // Reset submission state
            this.isSubmitting = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showErrorMessage(message) {
        alert(message);
    }

    showSuccessModal(report) {
        const modal = document.getElementById('successModal');
        const durationSpan = document.getElementById('sessionDuration');
        const dateSpan = document.getElementById('sessionDate');
        
        durationSpan.textContent = `${report.durationHours.toFixed(2)} hours`;
        dateSpan.textContent = new Date(report.prayerDate).toLocaleDateString();
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    loadUserReports() {
        if (!this.currentUser) return;
        
        const userReports = this.prayerReports.filter(report => 
            report.memberName === this.currentUser
        );
        
        this.displayUserReports(userReports);
        this.updateUserStats(userReports);
    }

    displayUserReports(reports) {
        const reportsList = document.getElementById('myReportsList');
        if (!reportsList) return;
        
        if (reports.length === 0) {
            reportsList.innerHTML = '<p class="no-reports">No prayer reports found. Start by submitting your first prayer report!</p>';
            return;
        }
        
        reportsList.innerHTML = reports.map(report => `
            <div class="report-item">
                <div class="report-header">
                    <h4>${report.prayerType}</h4>
                    <span class="report-date">${new Date(report.prayerDate).toLocaleDateString()}</span>
                </div>
                <div class="report-details">
                    <p><strong>Time:</strong> ${report.startTime} - ${report.endTime}</p>
                    <p><strong>Duration:</strong> ${report.durationHours.toFixed(2)} hours</p>
                    ${report.prayerNotes ? `<p><strong>Notes:</strong> ${report.prayerNotes}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    updateUserStats(reports) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyReports = reports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
        });
        
        const totalHours = monthlyReports.reduce((sum, report) => sum + report.durationHours, 0);
        const expectedHours = this.calculateExpectedHours(currentYear, currentMonth + 1);
        const progressPercent = expectedHours > 0 ? Math.round((totalHours / expectedHours) * 100) : 0;
        
        document.getElementById('monthlyHours').textContent = totalHours.toFixed(1);
        document.getElementById('expectedHours').textContent = expectedHours.toFixed(1);
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;
    }

    calculateExpectedHours(year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        let expectedHours = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();
            
            // Tuesday (2) - 3 hours
            if (dayOfWeek === 2) expectedHours += 3;
            // Friday (5) - 3 hours
            if (dayOfWeek === 5) expectedHours += 3;
            // Saturday (6) - 1 hour
            if (dayOfWeek === 6) expectedHours += 1;
        }
        
        return expectedHours;
    }

    loadAdminDashboard() {
        if (!this.isAdmin) return;
        
        this.updateAdminStats();
        this.displayMembersList();
        this.displayAllReports();
    }

    updateAdminStats() {
        const uniqueMembers = [...new Set(this.prayerReports.map(report => report.memberName))];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyReports = this.prayerReports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
        });
        
        const totalHours = this.prayerReports.reduce((sum, report) => sum + report.durationHours, 0);
        
        document.getElementById('totalMembers').textContent = uniqueMembers.length;
        document.getElementById('monthlyReports').textContent = monthlyReports.length;
        document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    }

    displayMembersList() {
        const membersList = document.getElementById('membersList');
        if (!membersList) return;
        
        const memberStats = {};
        
        this.prayerReports.forEach(report => {
            if (!memberStats[report.memberName]) {
                memberStats[report.memberName] = {
                    totalReports: 0,
                    totalHours: 0,
                    lastReport: null
                };
            }
            
            memberStats[report.memberName].totalReports++;
            memberStats[report.memberName].totalHours += report.durationHours;
            
            const reportDate = new Date(report.prayerDate);
            if (!memberStats[report.memberName].lastReport || reportDate > memberStats[report.memberName].lastReport) {
                memberStats[report.memberName].lastReport = reportDate;
            }
        });
        
        membersList.innerHTML = Object.entries(memberStats).map(([name, stats]) => `
            <div class="member-card">
                <h4>${name}</h4>
                <p><strong>Reports:</strong> ${stats.totalReports}</p>
                <p><strong>Total Hours:</strong> ${stats.totalHours.toFixed(1)}</p>
                <p><strong>Last Report:</strong> ${stats.lastReport ? stats.lastReport.toLocaleDateString() : 'Never'}</p>
            </div>
        `).join('');
    }

    displayAllReports() {
        const allReportsList = document.getElementById('allReportsList');
        if (!allReportsList) return;
        
        if (this.prayerReports.length === 0) {
            allReportsList.innerHTML = '<p class="no-reports">No prayer reports found.</p>';
            return;
        }
        
        allReportsList.innerHTML = this.prayerReports.map(report => `
            <div class="report-item">
                <div class="report-header">
                    <h4>${report.memberName} - ${report.prayerType}</h4>
                    <span class="report-date">${new Date(report.prayerDate).toLocaleDateString()}</span>
                </div>
                <div class="report-details">
                    <p><strong>Time:</strong> ${report.startTime} - ${report.endTime}</p>
                    <p><strong>Duration:</strong> ${report.durationHours.toFixed(2)} hours</p>
                    ${report.prayerNotes ? `<p><strong>Notes:</strong> ${report.prayerNotes}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    filterByMonth(monthYear) {
        if (!monthYear) {
            this.loadUserReports();
            return;
        }
        
        const [year, month] = monthYear.split('-').map(Number);
        const filteredReports = this.prayerReports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return reportDate.getFullYear() === year && reportDate.getMonth() === month - 1;
        });
        
        this.displayUserReports(filteredReports);
    }

    exportUserData() {
        if (!this.currentUser) {
            alert('Please enter your name first.');
            return;
        }
        
        const userReports = this.prayerReports.filter(report => report.memberName === this.currentUser);
        this.exportToCSV(userReports, `${this.currentUser}_prayer_reports.csv`);
    }

    exportAllData() {
        if (!this.isAdmin) {
            alert('Admin access required.');
            return;
        }
        
        this.exportToCSV(this.prayerReports, 'all_prayer_reports.csv');
    }

    exportToCSV(data, filename) {
        if (data.length === 0) {
            alert('No data to export.');
            return;
        }
        
        const headers = ['Name', 'Date', 'Type', 'Start Time', 'End Time', 'Duration (hours)', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...data.map(report => [
                report.memberName,
                report.prayerDate,
                report.prayerType,
                report.startTime,
                report.endTime,
                report.durationHours.toFixed(2),
                `"${report.prayerNotes || ''}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    clearAllData() {
        if (!this.isAdmin) {
            alert('Admin access required.');
            return;
        }
        
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.prayerReports = [];
            localStorage.removeItem('prayerReports');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('adminAuthenticated');
            
            this.currentUser = '';
            this.isAdmin = false;
            
            this.loadUserReports();
            this.loadAdminDashboard();
            this.hideAdminFeatures();
            
            alert('All data has been cleared.');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Prayer Report App...');
    window.prayerApp = new PrayerReportApp();
});

// Global function for tab switching (for onclick handlers)
window.switchToTab = function(tabName) {
    if (window.prayerApp) {
        window.prayerApp.switchTab(tabName);
    }
};
