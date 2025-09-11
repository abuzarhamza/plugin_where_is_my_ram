# 🏪 Chrome Web Store Submission Requirements

## 📋 Required Justifications

### **1. Permission Justifications**

#### **activeTab Permission**
```
Justification: The activeTab permission is required to interact with the currently active tab when the user clicks the extension icon. This allows the extension to:

• Display memory usage information for the current tab
• Show tab-specific details in the popup interface
• Provide context-aware functionality when the user opens the extension

The extension only accesses the active tab when the user explicitly opens the extension popup. No data is collected or transmitted from the active tab.
```

#### **tabs Permission**
```
Justification: The tabs permission is required to provide the core functionality of the extension:

• Count the total number of open tabs across all windows
• Retrieve basic tab information (title, URL, ID) for memory tracking
• Display a list of all open tabs with their memory usage
• Enable the "Kill Tabs" feature to close selected tabs
• Track when tabs were last accessed for memory estimation

The extension only reads tab metadata (title, URL, ID) and does not access tab content. No browsing data is collected or transmitted.
```

#### **processes Permission**
```
Justification: The processes permission is required to access real memory usage data from Chrome's process information:

• Retrieve actual RAM consumption data for each tab process
• Provide accurate memory measurements instead of estimates
• Enable precise memory tracking for better user experience
• Support the core functionality of showing "where RAM goes"

This permission is only used to read memory statistics and does not access any personal data or browsing content. The extension falls back to estimation algorithms when this API is not available.
```

### **2. Single Purpose Description**
```
Single Purpose: This extension has a single, focused purpose: to help users monitor and manage their browser's memory usage by tracking RAM consumption of open tabs.

The extension provides:
• Real-time memory usage monitoring for all open tabs
• Visual breakdown of RAM consumption per tab
• Tools to identify and close memory-hungry tabs
• Performance optimization through tab management

All features are directly related to this core purpose of memory monitoring and tab management. The extension does not perform any unrelated functions or collect data for purposes other than memory tracking.
```

### **3. Remote Code Use Justification**
```
Remote Code Use: This extension does not use any remote code execution. All functionality is implemented using:

• Standard Chrome Extension APIs (chrome.tabs, chrome.processes, chrome.action)
• Local JavaScript code bundled with the extension
• No external scripts or remote code loading
• No dynamic code execution from external sources
• No eval() or similar dynamic code execution

All code is static and included in the extension package. No remote resources are loaded or executed.
```

### **4. Data Usage Compliance**
```
Data Usage Compliance: This extension complies with Chrome Web Store developer program policies:

• NO DATA COLLECTION: The extension does not collect, store, or transmit any personal data
• NO TRACKING: No user behavior tracking or analytics
• NO EXTERNAL SERVERS: All processing happens locally in the browser
• NO THIRD-PARTY SERVICES: No integration with external services
• LOCAL PROCESSING ONLY: All memory calculations are performed locally
• NO PERSISTENT STORAGE: No data is stored beyond the current browser session

The extension only uses the requested permissions to provide its core functionality of memory monitoring and tab management.
```

## 📸 Screenshot Requirements

### **Screenshot 1: Main Interface**
**Description:** "Extension popup showing tab count, total memory usage, and memory breakdown for individual tabs"

**What to show:**
- Extension popup with sheep icon
- Tab count display
- Total memory usage
- List of tabs with memory amounts
- Fun fact at the bottom

### **Screenshot 2: Memory Breakdown**
**Description:** "Detailed memory breakdown showing individual tabs with their RAM consumption and last accessed times"

**What to show:**
- Expanded memory breakdown
- Multiple tabs with different memory usage levels
- Last accessed timestamps
- Memory icons (💾 for real data, 📊 for estimated)

### **Screenshot 3: Kill Tabs Feature**
**Description:** "Kill Tabs modal allowing users to select and close multiple tabs to free up RAM"

**What to show:**
- Kill Tabs modal interface
- Tab selection checkboxes
- "Kill Selected Tabs" button prominently displayed
- Select All/None buttons

### **Screenshot 4: Before/After Performance**
**Description:** "Browser performance comparison showing memory usage before and after using the extension"

**What to show:**
- Chrome Task Manager showing high memory usage
- Extension showing memory breakdown
- After closing tabs, reduced memory usage
- Performance improvement indicators

### **Screenshot 5: Settings & Features**
**Description:** "Extension features including refresh button, close duplicates, and API status indicator"

**What to show:**
- All action buttons (Refresh, Close Duplicates, Kill Tabs)
- API status indicator
- Fun facts rotation
- Clean, professional interface

## 📧 Contact Information

### **Contact Email**
```
[Your Email Address]
```

### **Support Email**
```
[Your Support Email]
```

### **Website/Homepage**
```
[Your GitHub Repository or Website]
```

## 🔒 Privacy Practices

### **Data Collection**
```
This extension does not collect, store, or transmit any personal data or browsing information.
```

### **Data Usage**
```
All memory calculations and tab monitoring happen locally in your browser. No data is sent to external servers.
```

### **Permissions Usage**
```
• tabs: To count and monitor open tabs
• processes: To access real memory usage data (Chrome Dev/Canary only)
• activeTab: To interact with the current tab when extension is opened
```

### **No Tracking**
```
• No analytics or tracking scripts
• No user behavior monitoring
• No data sharing with third parties
• No external API calls
```

## 📝 Additional Information

### **Developer Information**
```
Developer: [Your Name or Organization]
Email: [Your Email]
Website: [Your Website/GitHub]
```

### **Extension Details**
```
Name: Where Did My RAM Go? 🐑
Version: 1.4.1
Category: Productivity
Language: English
Pricing: Free
```

### **Technical Specifications**
```
• Manifest Version: 3
• Minimum Chrome Version: 139.0.7258.155
• Size: < 1MB
• Permissions: tabs, processes, activeTab
• No remote code execution
• Local processing only
```

## ✅ Submission Checklist

### **Before Submitting:**
- [ ] All permission justifications completed
- [ ] Single purpose description written
- [ ] Remote code use justification provided
- [ ] Data usage compliance certified
- [ ] At least 1 screenshot uploaded
- [ ] Contact email provided and verified
- [ ] Privacy practices completed
- [ ] Extension package uploaded
- [ ] Store listing information filled out
- [ ] Category selected (Productivity)
- [ ] Language set (English)

### **Required Files:**
- [ ] Extension package (tab-counter-extension-v1.4.1.zip)
- [ ] Screenshots (1-5 images)
- [ ] Promotional images (optional but recommended)
- [ ] Privacy policy (if applicable)

### **Store Listing:**
- [ ] Extension name
- [ ] Short description (132 characters max)
- [ ] Detailed description
- [ ] Category selection
- [ ] Language selection
- [ ] Pricing information
- [ ] Distribution settings

## 🚀 Submission Process

1. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole/
   - Sign in with your Google account

2. **Add New Item**
   - Click "Add new item"
   - Upload your extension package

3. **Fill Required Information**
   - Complete all required fields
   - Add permission justifications
   - Upload screenshots
   - Set contact information

4. **Privacy Practices**
   - Complete privacy practices tab
   - Add all required justifications
   - Certify data usage compliance

5. **Review and Submit**
   - Review all information
   - Submit for Chrome Web Store review
   - Wait for approval (1-3 days)

## 📞 Support

If you need help with any of these requirements:
- Chrome Web Store Help: https://support.google.com/chrome_webstore
- Developer Documentation: https://developer.chrome.com/docs/webstore/
- Community Forum: https://groups.google.com/forum/#!forum/chromium-extensions
