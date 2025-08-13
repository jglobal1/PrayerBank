# 🔐 Admin Security Guide - Church Prayer Report

## **Admin Access & Security**

### **🔑 Default Admin Password:**
- **Password:** ``
- **Location:** Top-right corner "Admin Login" button

### **🛡️ Security Features:**

1. **Password Protection**
   - Only you can access admin features with the correct password
   - Members cannot see each other's reports
   - Members can only see their own data

2. **Session Management**
   - Admin session lasts 24 hours
   - Automatically logs out after 24 hours for security
   - Manual logout available

3. **Access Control**
   - Admin dashboard is completely hidden from regular users
   - All admin functions require authentication
   - Export and data management restricted to admin only

### **🔧 How to Change Admin Password:**

1. Open `script.js` in a text editor
2. Find line: `this.adminPassword = 'church2024';`
3. Change `'church2024'` to your new password
4. Save the file

**Example:**
```javascript
this.adminPassword = 'your-new-secure-password';
```

### **📋 Admin Functions:**

✅ **View All Members** - See everyone who has submitted reports  
✅ **View All Reports** - Access complete prayer data from all members  
✅ **Export All Data** - Download complete church prayer statistics  
✅ **Clear All Data** - Reset the entire system if needed  
✅ **Monitor Progress** - Track individual and overall church prayer activity  

### **👥 User Privacy:**

- **Members can only see:**
  - Their own prayer reports
  - Their own statistics
  - Their own progress

- **Members cannot see:**
  - Other people's reports
  - Other people's names
  - Admin dashboard
  - Overall church statistics

### **🔒 Security Best Practices:**

1. **Change Default Password** - Immediately change from `church2024`
2. **Keep Password Private** - Don't share with church members
3. **Regular Logout** - Logout when not using admin features
4. **Secure Device** - Only access admin from your personal device
5. **Backup Data** - Regularly export data for safekeeping

### **🚨 Emergency Procedures:**

**If someone gains unauthorized access:**
1. Change the admin password immediately
2. Clear all data if necessary
3. Restart the system

**If you forget your password:**
1. Open `script.js`
2. Reset the password line
3. Save and refresh the app

### **📱 Admin Login Process:**

1. Click "Admin Login" (top-right corner)
2. Enter your admin password
3. Click "Admin Dashboard" to access admin features
4. Use "Admin Logout" when finished

### **💡 Tips for Church Leaders:**

- **Regular Monitoring** - Check reports weekly/monthly
- **Encourage Participation** - Share progress with members
- **Data Backup** - Export data monthly for records
- **Privacy Respect** - Never share individual member data
- **Motivation** - Use statistics to encourage prayer participation

---

**🔐 Remember: You are the only one who can see everyone's data. Keep your password secure!**
