// Firebase service functions for Prayer Report App
// Using Firebase compat version (already loaded via CDN)
const db = window.db;

// Collection name for prayer reports
const REPORTS_COLLECTION = 'prayerReports';

// Save a new prayer report to Firebase
async function savePrayerReport(reportData) {
    try {
        const docRef = await db.collection(REPORTS_COLLECTION).add({
            ...reportData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Prayer report saved with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Get prayer reports for a specific user
async function getUserReports(memberName) {
    try {
        const querySnapshot = await db.collection(REPORTS_COLLECTION)
            .where('memberName', '==', memberName)
            .orderBy('createdAt', 'desc')
            .get();
        
        const reports = [];
        
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            });
        });
        
        return { success: true, reports };
    } catch (error) {
        console.error('Error getting user reports:', error);
        return { success: false, error: error.message, reports: [] };
    }
}

// Get all prayer reports (admin function)
async function getAllReports() {
    try {
        const querySnapshot = await db.collection(REPORTS_COLLECTION)
            .orderBy('createdAt', 'desc')
            .get();
        
        const reports = [];
        
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            });
        });
        
        return { success: true, reports };
    } catch (error) {
        console.error('Error getting all reports:', error);
        return { success: false, error: error.message, reports: [] };
    }
}

// Get reports for a specific month (admin function)
async function getReportsByMonth(year, month) {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const querySnapshot = await db.collection(REPORTS_COLLECTION)
            .where('createdAt', '>=', startDate)
            .where('createdAt', '<=', endDate)
            .orderBy('createdAt', 'desc')
            .get();
        
        const reports = [];
        
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            });
        });
        
        return { success: true, reports };
    } catch (error) {
        console.error('Error getting reports by month:', error);
        return { success: false, error: error.message, reports: [] };
    }
}

// Delete a prayer report
async function deletePrayerReport(reportId) {
    try {
        await db.collection(REPORTS_COLLECTION).doc(reportId).delete();
        console.log('Prayer report deleted:', reportId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Update a prayer report
async function updatePrayerReport(reportId, updateData) {
    try {
        await db.collection(REPORTS_COLLECTION).doc(reportId).update({
            ...updateData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Prayer report updated:', reportId);
        return { success: true };
    } catch (error) {
        console.error('Error updating prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Get unique member names (admin function)
async function getUniqueMembers() {
    try {
        const querySnapshot = await db.collection(REPORTS_COLLECTION).get();
        const members = new Set();
        
        querySnapshot.forEach((doc) => {
            const memberName = doc.data().memberName;
            if (memberName) {
                members.add(memberName);
            }
        });
        
        return { success: true, members: Array.from(members) };
    } catch (error) {
        console.error('Error getting unique members:', error);
        return { success: false, error: error.message, members: [] };
    }
}

// Make functions available globally
window.savePrayerReport = savePrayerReport;
window.getUserReports = getUserReports;
window.getAllReports = getAllReports;
window.getReportsByMonth = getReportsByMonth;
window.deletePrayerReport = deletePrayerReport;
window.updatePrayerReport = updatePrayerReport;
window.getUniqueMembers = getUniqueMembers;
