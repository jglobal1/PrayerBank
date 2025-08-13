// Prayer Report App - Main JavaScript File

class PrayerReportApp {
    constructor() {
        this.prayerReports = JSON.parse(localStorage.getItem('prayerReports')) || [];
        this.currentUser = localStorage.getItem('currentUser') || '';
        this.isAdmin = false; // Start as non-admin
        this.adminPassword = 'church2024'; // You can change this password
        this.isSubmitting = false; // Prevent duplicate submissions
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadData();
    }

    initializeApp() {
        // Set current date as default
        document.getElementById('prayerDate').value = new Date().toISOString().split('T')[0];
        
        // Hide admin features by default
        this.hideAdminFeatures();
        
        // Populate month filter
        this.populateMonthFilter();
        
        // Check if admin is already authenticated
        this.checkAdminAuth();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submission
        document.getElementById('prayerForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Modal
        const modal = document.getElementById('successModal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Export buttons
        document.getElementById('exportBtn').addEventListener('click', () => this.exportUserData());
        document.getElementById('exportAllBtn').addEventListener('click', () => this.exportAllData());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());

        // Month filter
        document.getElementById('monthFilter').addEventListener('change', (e) => this.filterByMonth(e.target.value));

        // Admin login
        this.setupAdminLogin();

        // Quick time buttons
        this.setupQuickTimeButtons();
    }

    setupAdminLogin() {
        // Create admin login button
        const adminLoginBtn = document.createElement('button');
        adminLoginBtn.textContent = 'Admin Login';
        adminLoginBtn.className = 'admin-login-btn';
        adminLoginBtn.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            z-index: 1000; 
            padding: 10px 20px; 
            background: #6b46c1;
            color: white; 
            border: none; 
            border-radius: 25px; 
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(107, 70, 193, 0.3);
            transition: all 0.3s ease;
        `;
        
        adminLoginBtn.addEventListener('click', () => {
            if (this.isAdmin) {
                this.logoutAdmin();
            } else {
                this.showAdminLogin();
            }
        });
        
        adminLoginBtn.addEventListener('mouseenter', () => {
            adminLoginBtn.style.transform = 'translateY(-2px)';
            adminLoginBtn.style.boxShadow = '0 4px 20px rgba(107, 70, 193, 0.4)';
        });
        adminLoginBtn.addEventListener('mouseleave', () => {
            adminLoginBtn.style.transform = 'translateY(0)';
            adminLoginBtn.style.boxShadow = '0 2px 10px rgba(107, 70, 193, 0.3)';
        });
        
        document.body.appendChild(adminLoginBtn);
    }

    showAdminLogin() {
        const password = prompt('Enter Admin Password:');
        if (password === this.adminPassword) {
            this.isAdmin = true;
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminAuthTime', Date.now().toString());
            this.showAdminFeatures();
            this.showSuccessMessage('Admin access granted!');
        } else if (password !== null) {
            alert('Incorrect password. Access denied.');
        }
    }

    logoutAdmin() {
        if (confirm('Are you sure you want to logout from admin?')) {
            this.isAdmin = false;
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminAuthTime');
            this.hideAdminFeatures();
            this.showSuccessMessage('Admin logged out successfully');
            
            // Switch to prayer form tab if currently on admin dashboard
            if (document.querySelector('[data-tab="admin-dashboard"]').classList.contains('active')) {
                this.switchTab('prayer-form');
            }
        }
    }

    checkAdminAuth() {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
        const authTime = parseInt(localStorage.getItem('adminAuthTime') || '0');
        const currentTime = Date.now();
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

        if (isAuthenticated && (currentTime - authTime) < sessionTimeout) {
            this.isAdmin = true;
            this.showAdminFeatures();
        } else {
            // Clear expired session
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminAuthTime');
            this.isAdmin = false;
            this.hideAdminFeatures();
        }
    }

    showAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
        
        // Update admin login button
        const adminBtn = document.querySelector('.admin-login-btn');
        if (adminBtn) {
            adminBtn.textContent = 'Admin Logout';
            adminBtn.style.background = '#553c9a';
        }
    }

    hideAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Update admin login button
        const adminBtn = document.querySelector('.admin-login-btn');
        if (adminBtn) {
            adminBtn.textContent = 'Admin Login';
            adminBtn.style.background = '#6b46c1';
        }
    }

    showSuccessMessage(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #6b46c1;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }

    switchTab(tabName) {
        // Check admin access for admin dashboard
        if (tabName === 'admin-dashboard' && !this.isAdmin) {
            alert('Admin access required. Please login as admin.');
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Load data for the tab
        if (tabName === 'my-reports') {
            this.loadUserReports();
        } else if (tabName === 'admin-dashboard' && this.isAdmin) {
            this.loadAdminDashboard();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        // Prevent duplicate submissions
        if (this.isSubmitting) {
            return;
        }
        this.isSubmitting = true;

        // Show loading state on button
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        // Validate all required fields first
        const memberName = document.getElementById('memberName').value.trim();
        const prayerDate = document.getElementById('prayerDate').value;
        const prayerType = document.getElementById('prayerType').value;

        if (!memberName) {
            alert('Please enter your name');
            this.resetSubmissionState();
            return;
        }

        if (!prayerDate) {
            alert('Please select a prayer date');
            this.resetSubmissionState();
            return;
        }

        if (!prayerType) {
            alert('Please select a prayer type');
            this.resetSubmissionState();
            return;
        }

        // Validate time input
        const startTime = this.getTimeValue('start');
        const endTime = this.getTimeValue('end');

        if (!startTime || !endTime) {
            alert('Please select both start and end times');
            this.resetSubmissionState();
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be after start time');
            this.resetSubmissionState();
            return;
        }

        const formData = {
            id: Date.now(),
            memberName: memberName,
            prayerDate: prayerDate,
            prayerType: prayerType,
            startTime: startTime,
            endTime: endTime,
            prayerNotes: document.getElementById('prayerNotes').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Calculate duration
        const duration = this.calculateDuration(startTime, endTime);
        formData.duration = duration;

        // Save to localStorage
        this.prayerReports.push(formData);
        localStorage.setItem('prayerReports', JSON.stringify(this.prayerReports));

        // Save current user name for future reference
        this.currentUser = formData.memberName;
        localStorage.setItem('currentUser', this.currentUser);

        // Show success modal
        this.showSuccessModal(formData);

        // Show success message on welcome page
        this.showWelcomeSuccessMessage();

        // Reset form but keep the name
        e.target.reset();
        document.getElementById('memberName').value = memberName;
        document.getElementById('prayerDate').value = new Date().toISOString().split('T')[0];
        
        // Reset time pickers (this now includes clearing active states)
        this.resetTimePickers();
        
        // Reload user reports to show the new entry
        this.loadUserReports();

        // Reset submission flag and button state
        setTimeout(() => {
            this.isSubmitting = false;
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Submit Prayer Report';
            }
        }, 1000);
    }

    resetTimePickers() {
        ['start', 'end'].forEach(type => {
            document.getElementById(`${type}Hour`).value = '';
            document.getElementById(`${type}Minute`).value = '';
            document.getElementById(`${type}Period`).value = '';
        });
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        // Handle overnight sessions
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }
        
        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
    }

    showSuccessModal(report) {
        const modal = document.getElementById('successModal');
        document.getElementById('sessionDuration').textContent = `${report.duration} hours`;
        document.getElementById('sessionDate').textContent = new Date(report.prayerDate).toLocaleDateString();
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    loadData() {
        this.loadUserReports();
        if (this.isAdmin) {
            this.loadAdminDashboard();
        }
    }

    loadUserReports() {
        const currentUser = document.getElementById('memberName').value.trim() || this.currentUser;
        if (!currentUser) {
            // If no current user, show message to enter name
            const container = document.getElementById('myReportsList');
            container.innerHTML = '<p class="text-center">Please enter your name in the Prayer Log form to view your reports.</p>';
            return;
        }

        const userReports = this.prayerReports.filter(report => 
            report.memberName.toLowerCase() === currentUser.toLowerCase()
        );

        this.displayUserReports(userReports);
        this.updateUserStats(userReports);
    }

    displayUserReports(reports) {
        const container = document.getElementById('myReportsList');
        container.innerHTML = '';

        if (reports.length === 0) {
            container.innerHTML = '<p class="text-center">No prayer reports found. Start by logging your first prayer session!</p>';
            return;
        }

        reports.sort((a, b) => new Date(b.prayerDate) - new Date(a.prayerDate));

        reports.forEach(report => {
            const reportElement = this.createReportElement(report);
            container.appendChild(reportElement);
        });
    }

    createReportElement(report) {
        const div = document.createElement('div');
        div.className = 'report-item';
        
        const prayerTypeLabels = {
            'tuesday-fasting': 'Tuesday Fasting',
            'friday-prayer': 'Friday Prayer',
            'friday-fasting': 'Friday Fasting',
            'saturday-prayer': 'Saturday Prayer',
            'personal': 'Personal Prayer'
        };

        div.innerHTML = `
            <div class="report-header">
                <div class="report-name">${report.memberName}</div>
                <div class="report-date">${new Date(report.prayerDate).toLocaleDateString()}</div>
            </div>
            <div class="report-details">
                <div class="report-detail">
                    <div class="detail-label">Prayer Type</div>
                    <div class="detail-value">${prayerTypeLabels[report.prayerType] || report.prayerType}</div>
                </div>
                <div class="report-detail">
                    <div class="detail-label">Start Time</div>
                    <div class="detail-value">${report.startTime}</div>
                </div>
                <div class="report-detail">
                    <div class="detail-label">End Time</div>
                    <div class="detail-value">${report.endTime}</div>
                </div>
                <div class="report-detail">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${report.duration} hours</div>
                </div>
            </div>
            ${report.prayerNotes ? `<div class="report-notes">${report.prayerNotes}</div>` : ''}
        `;

        return div;
    }

    updateUserStats(reports) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyReports = reports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
        });

        const monthlyHours = monthlyReports.reduce((total, report) => total + report.duration, 0);
        const expectedHours = this.calculateExpectedHours(currentMonth, currentYear);
        const progressPercent = expectedHours > 0 ? Math.round((monthlyHours / expectedHours) * 100) : 0;

        document.getElementById('monthlyHours').textContent = monthlyHours.toFixed(1);
        document.getElementById('expectedHours').textContent = expectedHours.toFixed(1);
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;
    }

    calculateExpectedHours(month, year) {
        // Calculate expected hours based on prayer schedule
        // Tuesday fasting: 3 hours (12am-3am Wed)
        // Friday prayer/fasting: 3 hours (12am-3am Sat)
        // Saturday prayer: 1 hour (estimated)
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let expectedHours = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();

            // Tuesday (2) - fasting
            if (dayOfWeek === 2) expectedHours += 3;
            
            // Friday (5) - prayer/fasting
            if (dayOfWeek === 5) expectedHours += 3;
            
            // Saturday (6) - prayer
            if (dayOfWeek === 6) expectedHours += 1;
        }

        return expectedHours;
    }

    populateMonthFilter() {
        const select = document.getElementById('monthFilter');
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const currentYear = new Date().getFullYear();
        
        // Add last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentYear, new Date().getMonth() - i, 1);
            const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const option = document.createElement('option');
            option.value = value;
            option.textContent = monthYear;
            select.appendChild(option);
        }
    }

    filterByMonth(monthYear) {
        if (!monthYear) {
            this.loadUserReports();
            return;
        }

        const [year, month] = monthYear.split('-');
        const currentUser = document.getElementById('memberName').value.trim() || this.currentUser;
        
        const filteredReports = this.prayerReports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return report.memberName.toLowerCase() === currentUser.toLowerCase() &&
                   reportDate.getFullYear() === parseInt(year) &&
                   reportDate.getMonth() === parseInt(month) - 1;
        });

        this.displayUserReports(filteredReports);
        this.updateUserStats(filteredReports);
    }

    loadAdminDashboard() {
        if (!this.isAdmin) {
            alert('Admin access required');
            return;
        }
        
        this.updateAdminStats();
        this.displayMembersList();
        this.displayAllReports();
    }

    updateAdminStats() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyReports = this.prayerReports.filter(report => {
            const reportDate = new Date(report.prayerDate);
            return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
        });

        const uniqueMembers = [...new Set(this.prayerReports.map(report => report.memberName))];
        const totalHours = this.prayerReports.reduce((total, report) => total + report.duration, 0);

        document.getElementById('totalMembers').textContent = uniqueMembers.length;
        document.getElementById('monthlyReports').textContent = monthlyReports.length;
        document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    }

    displayMembersList() {
        const container = document.getElementById('membersList');
        container.innerHTML = '';

        const memberStats = {};
        
        this.prayerReports.forEach(report => {
            if (!memberStats[report.memberName]) {
                memberStats[report.memberName] = {
                    totalHours: 0,
                    totalSessions: 0
                };
            }
            memberStats[report.memberName].totalHours += report.duration;
            memberStats[report.memberName].totalSessions += 1;
        });

        Object.entries(memberStats).forEach(([name, stats]) => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <div class="member-name">${name}</div>
                <div class="member-stats">
                    <div class="member-stat">
                        <div class="member-stat-value">${stats.totalHours.toFixed(1)}</div>
                        <div class="member-stat-label">Total Hours</div>
                    </div>
                    <div class="member-stat">
                        <div class="member-stat-value">${stats.totalSessions}</div>
                        <div class="member-stat-label">Sessions</div>
                    </div>
                </div>
            `;
            container.appendChild(memberCard);
        });
    }

    displayAllReports() {
        const container = document.getElementById('allReportsList');
        container.innerHTML = '';

        if (this.prayerReports.length === 0) {
            container.innerHTML = '<p class="text-center">No prayer reports found.</p>';
            return;
        }

        const sortedReports = [...this.prayerReports].sort((a, b) => 
            new Date(b.prayerDate) - new Date(a.prayerDate)
        );

        sortedReports.forEach(report => {
            const reportElement = this.createReportElement(report);
            container.appendChild(reportElement);
        });
    }

    exportUserData() {
        const currentUser = document.getElementById('memberName').value.trim() || this.currentUser;
        if (!currentUser) {
            alert('Please enter your name first');
            return;
        }

        const userReports = this.prayerReports.filter(report => 
            report.memberName.toLowerCase() === currentUser.toLowerCase()
        );

        this.exportToCSV(userReports, `prayer-reports-${currentUser}-${new Date().toISOString().split('T')[0]}`);
    }

    exportAllData() {
        if (!this.isAdmin) {
            alert('Admin access required');
            return;
        }
        
        this.exportToCSV(this.prayerReports, `all-prayer-reports-${new Date().toISOString().split('T')[0]}`);
    }

    exportToCSV(data, filename) {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Name', 'Date', 'Prayer Type', 'Start Time', 'End Time', 'Duration (hours)', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...data.map(report => [
                `"${report.memberName}"`,
                report.prayerDate,
                report.prayerType,
                report.startTime,
                report.endTime,
                report.duration,
                `"${report.prayerNotes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    clearAllData() {
        if (!this.isAdmin) {
            alert('Admin access required');
            return;
        }
        
        if (confirm('Are you sure you want to clear all prayer report data? This action cannot be undone.')) {
            localStorage.removeItem('prayerReports');
            this.prayerReports = [];
            this.loadData();
            alert('All data has been cleared');
        }
    }

    setupQuickTimeButtons() {
        // Start time quick buttons - only affect start time
        const startTimePicker = document.querySelector('.time-group .form-group:first-child .quick-time-buttons');
        if (startTimePicker) {
            startTimePicker.querySelectorAll('.quick-time-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const time = btn.dataset.time;
                    this.setTimeFromString('start', time);
                    
                    // Update active state only for start time buttons
                    startTimePicker.querySelectorAll('.quick-time-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }

        // End time quick buttons - only affect end time
        const endTimePicker = document.querySelector('.time-group .form-group:last-child .quick-time-buttons');
        if (endTimePicker) {
            endTimePicker.querySelectorAll('.quick-time-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const time = btn.dataset.time;
                    this.setTimeFromString('end', time);
                    
                    // Update active state only for end time buttons
                    endTimePicker.querySelectorAll('.quick-time-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
    }

    setTimeFromString(type, timeString) {
        // Parse time string like "12:00 AM" or "1:00 AM"
        const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
            let hour = parseInt(match[1]);
            const minute = match[2];
            const period = match[3].toUpperCase();

            // Convert 12-hour to 24-hour for internal storage
            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }

            // Set the dropdown values
            document.getElementById(`${type}Hour`).value = hour.toString().padStart(2, '0');
            document.getElementById(`${type}Minute`).value = minute;
            document.getElementById(`${type}Period`).value = period;
        }
    }

    getTimeValue(type) {
        const hour = document.getElementById(`${type}Hour`).value;
        const minute = document.getElementById(`${type}Minute`).value;
        const period = document.getElementById(`${type}Period`).value;

        if (!hour || !minute || !period) {
            return null;
        }

        // Convert to 24-hour format for calculations
        let hour24 = parseInt(hour);
        if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
        }

        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    }



    resetTimePickers() {
        ['start', 'end'].forEach(type => {
            document.getElementById(`${type}Hour`).value = '';
            document.getElementById(`${type}Minute`).value = '';
            document.getElementById(`${type}Period`).value = '';
        });
        
        // Clear active states for both start and end time buttons
        const startTimePicker = document.querySelector('.time-group .form-group:first-child .quick-time-buttons');
        const endTimePicker = document.querySelector('.time-group .form-group:last-child .quick-time-buttons');
        
        if (startTimePicker) {
            startTimePicker.querySelectorAll('.quick-time-btn').forEach(btn => btn.classList.remove('active'));
        }
        if (endTimePicker) {
            endTimePicker.querySelectorAll('.quick-time-btn').forEach(btn => btn.classList.remove('active'));
        }
    }

    resetSubmissionState() {
        this.isSubmitting = false;
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Submit Prayer Report';
        }
    }

    showWelcomeSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Global function to switch tabs (for welcome page buttons)
function switchToTab(tabName) {
    const app = window.prayerApp;
    if (app) {
        app.switchTab(tabName);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrayerReportApp();
});

// Auto-save current user name
document.getElementById('memberName').addEventListener('input', (e) => {
    localStorage.setItem('currentUser', e.target.value.trim());
});

// Auto-load user reports when name changes
document.getElementById('memberName').addEventListener('change', () => {
    const app = window.prayerApp || new PrayerReportApp();
    app.loadUserReports();
});

// Store app instance globally for access
window.prayerApp = new PrayerReportApp();

// Add CSS animations for success messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
