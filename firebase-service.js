// Firebase service functions for Prayer Report App
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase-config.js';

// Collection name for prayer reports
const REPORTS_COLLECTION = 'prayerReports';

// Save a new prayer report to Firebase
export async function savePrayerReport(reportData) {
    try {
        const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
            ...reportData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('Prayer report saved with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Get prayer reports for a specific user
export async function getUserReports(memberName) {
    try {
        const q = query(
            collection(db, REPORTS_COLLECTION),
            where('memberName', '==', memberName),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
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
export async function getAllReports() {
    try {
        const q = query(
            collection(db, REPORTS_COLLECTION),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
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
export async function getReportsByMonth(year, month) {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const q = query(
            collection(db, REPORTS_COLLECTION),
            where('createdAt', '>=', startDate),
            where('createdAt', '<=', endDate),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
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
export async function deletePrayerReport(reportId) {
    try {
        await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
        console.log('Prayer report deleted:', reportId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Update a prayer report
export async function updatePrayerReport(reportId, updateData) {
    try {
        await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
            ...updateData,
            updatedAt: serverTimestamp()
        });
        console.log('Prayer report updated:', reportId);
        return { success: true };
    } catch (error) {
        console.error('Error updating prayer report:', error);
        return { success: false, error: error.message };
    }
}

// Get unique member names (admin function)
export async function getUniqueMembers() {
    try {
        const q = query(collection(db, REPORTS_COLLECTION));
        const querySnapshot = await getDocs(q);
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
