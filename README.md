# Church Prayer Report App

A beautiful and functional web application for church members to track their prayer sessions and fasting activities. Built with HTML, CSS, and JavaScript.

## Features

### For Church Members:
- **Prayer Session Logging**: Log your prayer sessions with start/end times
- **Prayer Type Selection**: Choose from different prayer types:
  - Tuesday Fasting (12am-3am Wed)
  - Friday Prayer (12am-3am Sat)
  - Friday Fasting (12am-3am Sat)
  - Saturday Prayer
  - Personal Prayer
- **Prayer Notes**: Add personal notes about what you prayed for
- **Monthly Statistics**: View your prayer hours vs expected hours
- **Progress Tracking**: See your completion percentage for the month
- **Export Data**: Download your prayer reports as CSV

### For Admin (Church Leader):
- **Dashboard Overview**: See total members, monthly reports, and total hours
- **Member Activity**: View all members and their prayer statistics
- **All Reports**: Browse all prayer reports from all members
- **Data Export**: Export all prayer data for analysis
- **Data Management**: Clear all data if needed

## How to Use

### Getting Started:
1. Open `index.html` in your web browser
2. Enter your name in the "Your Name" field
3. Start logging your prayer sessions!

### Logging a Prayer Session:
1. Go to the "Prayer Log" tab
2. Fill in your details:
   - **Your Name**: Your full name
   - **Prayer Date**: The date you prayed
   - **Prayer Type**: Select the appropriate prayer type
   - **Start Time**: When you started praying
   - **End Time**: When you finished praying
   - **Prayer Notes**: Optional notes about your prayer session
3. Click "Submit Prayer Report"
4. You'll see a confirmation with your session details

### Viewing Your Reports:
1. Go to the "My Reports" tab
2. See your monthly statistics:
   - Hours prayed this month
   - Expected hours based on your church schedule
   - Progress percentage
3. Filter by month using the dropdown
4. Export your data using the "Export My Data" button

### Admin Access:
1. Click the "Toggle Admin" button in the top-right corner
2. Access the "Admin Dashboard" tab
3. View overall church statistics and member activity
4. Export all data or clear data as needed

## Expected Prayer Hours Calculation

The app automatically calculates expected prayer hours based on your church schedule:

- **Tuesday Fasting**: 3 hours (12am-3am Wednesday)
- **Friday Prayer/Fasting**: 3 hours (12am-3am Saturday)
- **Saturday Prayer**: 1 hour (estimated)

The system counts these for each occurrence in the month and shows your progress.

## Data Storage

- All data is stored locally in your browser using localStorage
- Data persists between browser sessions
- No internet connection required
- Data is private to your device

## File Structure

```
prayerreport/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # This file
```

## Browser Compatibility

- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and desktop
- No external dependencies required

## Customization

### Prayer Schedule:
You can modify the expected hours calculation in `script.js` by editing the `calculateExpectedHours()` function.

### Styling:
The app uses a modern gradient design. You can customize colors and styling in `styles.css`.

### Prayer Types:
Add or modify prayer types in the HTML form and update the labels in the JavaScript file.

## Tips for Church Leaders

1. **Regular Check-ins**: Encourage members to log their sessions regularly
2. **Monthly Reviews**: Use the admin dashboard to review monthly participation
3. **Data Export**: Export data monthly for record-keeping
4. **Motivation**: Share progress statistics to encourage participation

## Security Notes

- This is a client-side application with no server
- Data is stored locally in each user's browser
- For more secure data storage, consider a server-based solution
- The admin toggle is for testing - remove it in production

## Future Enhancements

Potential features to add:
- User authentication system
- Server-side data storage
- Email notifications
- Prayer request sharing
- Group prayer statistics
- Mobile app version

## Support

For questions or issues, please contact your church administrator or the app developer.

---

**Built with ❤️ for church communities**
