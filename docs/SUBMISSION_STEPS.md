# 🚀 Chrome Web Store Submission Steps

## 📍 Where to Enter Each Requirement

### **Step 1: Access Chrome Web Store Developer Dashboard**

1. **Go to:** https://chrome.google.com/webstore/devconsole/
2. **Sign in** with your Google account
3. **Click "Add new item"** or select your existing extension

### **Step 2: Upload Extension Package**

1. **In the "Upload" section:**
   - Click "Choose file"
   - Select: `dist/tab-counter-extension-v1.4.1.zip`
   - Wait for upload to complete

### **Step 3: Fill Store Listing Information**

#### **Basic Information Tab:**
- **Extension name:** `Where Did My RAM Go? 🐑`
- **Summary:** `Track your tabs and see how much RAM they're consuming. Because sheep (RAM) can really add up!`
- **Description:** Copy from `STORE_DESCRIPTION.md`
- **Category:** Select "Productivity"
- **Language:** English (United States)

#### **Screenshots Tab:**
- **Upload at least 1 screenshot** (up to 5)
- Use the descriptions from `CHROME_STORE_REQUIREMENTS.md`

### **Step 4: Privacy Practices Tab (CRITICAL)**

This is where you enter all the required justifications:

#### **4.1 Permission Justifications**

**For "activeTab" permission:**
```
The activeTab permission is required to interact with the currently active tab when the user clicks the extension icon. This allows the extension to display memory usage information for the current tab and show tab-specific details in the popup interface. The extension only accesses the active tab when the user explicitly opens the extension popup. No data is collected or transmitted from the active tab.
```

**For "tabs" permission:**
```
The tabs permission is required to provide the core functionality of the extension: count the total number of open tabs, retrieve basic tab information (title, URL, ID) for memory tracking, display a list of all open tabs with their memory usage, and enable the "Kill Tabs" feature to close selected tabs. The extension only reads tab metadata and does not access tab content. No browsing data is collected or transmitted.
```

**For "processes" permission:**
```
The processes permission is required to access real memory usage data from Chrome's process information. This enables the extension to retrieve actual RAM consumption data for each tab process and provide accurate memory measurements instead of estimates. This permission is only used to read memory statistics and does not access any personal data or browsing content. The extension falls back to estimation algorithms when this API is not available.
```

#### **4.2 Single Purpose Description**

**In the "Single Purpose" field:**
```
This extension has a single, focused purpose: to help users monitor and manage their browser's memory usage by tracking RAM consumption of open tabs. The extension provides real-time memory usage monitoring, visual breakdown of RAM consumption per tab, and tools to identify and close memory-hungry tabs. All features are directly related to this core purpose of memory monitoring and tab management.
```

#### **4.3 Remote Code Use**

**In the "Remote Code Use" field:**
```
This extension does not use any remote code execution. All functionality is implemented using standard Chrome Extension APIs and local JavaScript code bundled with the extension. No external scripts, remote code loading, or dynamic code execution from external sources is used. All code is static and included in the extension package.
```

#### **4.4 Data Usage Compliance**

**Check the certification box:**
```
☑️ I certify that my data usage complies with Chrome Web Store developer program policies
```

**In the data usage description:**
```
This extension complies with Chrome Web Store developer program policies: NO DATA COLLECTION (does not collect, store, or transmit any personal data), NO TRACKING (no user behavior tracking or analytics), NO EXTERNAL SERVERS (all processing happens locally), NO THIRD-PARTY SERVICES (no integration with external services), LOCAL PROCESSING ONLY (all memory calculations performed locally), NO PERSISTENT STORAGE (no data stored beyond current session).
```

### **Step 5: Account Tab**

#### **5.1 Contact Information**

**Contact email:** `[Your Email Address]`
**Support email:** `[Your Support Email]`
**Website:** `[Your GitHub Repository or Website]`

#### **5.2 Email Verification**

1. **Enter your contact email**
2. **Click "Send verification email"**
3. **Check your email inbox**
4. **Click the verification link**
5. **Return to the dashboard**

### **Step 6: Distribution Tab**

- **Pricing:** Free
- **Regions:** All regions
- **Visibility:** Public

### **Step 7: Review and Submit**

1. **Review all information**
2. **Click "Save draft"** after each section
3. **Click "Submit for review"** when everything is complete

## 🎯 Exact Locations in Dashboard

### **Privacy Practices Tab Fields:**

1. **Permission Justifications:**
   - Look for "Permission justifications" section
   - Enter justification for each permission (activeTab, tabs, processes)

2. **Single Purpose:**
   - Look for "Single purpose description" field
   - Enter the single purpose description

3. **Remote Code:**
   - Look for "Remote code use" field
   - Enter the remote code justification

4. **Data Usage:**
   - Look for "Data usage compliance" section
   - Check the certification box
   - Enter data usage description

### **Account Tab Fields:**

1. **Contact Email:**
   - Look for "Contact email" field
   - Enter your email address
   - Click "Send verification email"

2. **Email Verification:**
   - Check your email
   - Click verification link
   - Return to dashboard

## ✅ Step-by-Step Checklist

### **Before Starting:**
- [ ] Have your extension package ready (`dist/tab-counter-extension-v1.4.1.zip`)
- [ ] Have screenshots ready (at least 1)
- [ ] Have your contact email ready
- [ ] Have all justifications ready (from `QUICK_REFERENCE.md`)

### **During Submission:**
- [ ] Upload extension package
- [ ] Fill basic information (name, description, category)
- [ ] Upload at least 1 screenshot
- [ ] Go to Privacy Practices tab
- [ ] Enter all permission justifications
- [ ] Enter single purpose description
- [ ] Enter remote code use justification
- [ ] Check data usage compliance box
- [ ] Enter data usage description
- [ ] Go to Account tab
- [ ] Enter contact email
- [ ] Verify email address
- [ ] Set distribution settings
- [ ] Save draft
- [ ] Submit for review

### **After Submission:**
- [ ] Wait for review (1-3 days)
- [ ] Check email for updates
- [ ] Respond to any review feedback
- [ ] Extension will be published when approved

## 🚨 Common Issues and Solutions

### **Issue: "Permission justification required"**
**Solution:** Go to Privacy Practices tab → Permission justifications → Enter the justification for each permission

### **Issue: "Single purpose description required"**
**Solution:** Go to Privacy Practices tab → Single purpose description → Enter the description

### **Issue: "Remote code use justification required"**
**Solution:** Go to Privacy Practices tab → Remote code use → Enter the justification

### **Issue: "Contact email required"**
**Solution:** Go to Account tab → Contact email → Enter and verify your email

### **Issue: "Screenshot required"**
**Solution:** Go to Screenshots tab → Upload at least 1 screenshot

## 📞 Need Help?

If you're still having issues:
1. **Check the Chrome Web Store Help:** https://support.google.com/chrome_webstore
2. **Review the Developer Documentation:** https://developer.chrome.com/docs/webstore/
3. **Contact Chrome Web Store Support** through the dashboard

## 🎉 Success!

Once all requirements are met and you submit for review:
- You'll receive a confirmation email
- Review typically takes 1-3 days
- You'll be notified when your extension is published
- Your extension will be available in the Chrome Web Store!
