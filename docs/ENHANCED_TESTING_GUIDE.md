# 🧪 Enhanced Testing Guide - Where Did My RAM Go? 🐑

## 🚀 **Quick Test (10 minutes)**

### **1. Install Extension**
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the `tabCounter` folder
6. ✅ Extension should appear with green checkmark

### **2. Test Basic Functionality**
1. **Click the extension icon** in toolbar
2. **Check tab count** - should show current number of open tabs
3. **Check last window time** - should show when you last opened a window
4. **Click "Refresh"** - should update the display
5. **Click "Show All Tabs"** - should display list of all tabs with staleness
6. **Click "Kill Duplicates"** - should find and close duplicate tabs
7. **Click "Task Manager"** - should open help page with instructions

### **3. Test Tab List Features**
1. **Open multiple tabs** (including some duplicates)
2. **Click "Show All Tabs"** button
3. **Verify tab list shows:**
   - Tab titles (truncated if too long)
   - Tab URLs (truncated if too long)
   - Staleness indicators (fresh/stale/very-stale)
   - Window numbers
   - Active tab highlighted
4. **Click on any tab** in the list - should switch to that tab
5. **Click "✕"** to close the tab list

### **4. Test Staleness Tracking**
1. **Open a new tab** - should show "0s ago" (fresh)
2. **Wait 1 minute** - should show "1m ago" (stale)
3. **Wait 5+ minutes** - should show "5m ago" (stale)
4. **Wait 30+ minutes** - should show "30m ago" (very-stale)
5. **Click on a stale tab** - staleness should reset to "0s ago"

### **5. Test Duplicate Detection**
1. **Open the same URL in multiple tabs**
2. **Click "Kill Duplicates"** button
3. **Should see notification** about how many duplicates were closed
4. **Verify only one tab remains** for each unique URL
5. **Test with different URLs** to ensure it works correctly

### **6. Test Badge Updates**
1. **Look at extension icon** - should show tab count as badge
2. **Open/close tabs** - badge should update automatically
3. **Badge color** should change:
   - 🟢 Green: 1-20 tabs
   - 🟠 Orange: 21-50 tabs  
   - 🔴 Red: 50+ tabs

## ✅ **Expected Results**

### **✅ Working Correctly:**
- Extension loads without errors
- Tab count displays correctly
- Last window time shows current time
- Tab list shows all tabs with correct information
- Staleness tracking works (updates every minute)
- Duplicate detection finds and closes duplicate tabs
- Badge updates automatically
- Task Manager help opens
- No console errors

### **❌ Common Issues:**
- **"Could not load background script"** - Check manifest.json syntax
- **Badge not updating** - Check background.js
- **Tab list not showing** - Check popup.js and background.js communication
- **Staleness not updating** - Check background.js interval timer
- **Duplicates not detected** - Check URL comparison logic
- **Extension not loading** - Check all file paths

## 🔧 **Troubleshooting**

### **If Extension Won't Load:**
1. Check `chrome://extensions/` for error messages
2. Verify all files exist: `manifest.json`, `popup.html`, `popup.css`, `popup.js`, `background.js`, `task-manager-help.html`
3. Check `icons/` folder has all required icon files
4. Reload the extension

### **If Tab List Not Working:**
1. Check browser console for errors
2. Verify `chrome.tabs.query` is working
3. Check if background script is running
4. Ensure `tabs` permission is granted

### **If Staleness Not Updating:**
1. Check if background script interval is running
2. Verify `chrome.tabs.onActivated` listener is working
3. Check browser console for errors
4. Wait at least 1 minute for staleness to update

### **If Duplicates Not Detected:**
1. Ensure you have tabs with identical URLs
2. Check if URLs are being compared correctly
3. Verify `chrome.tabs.remove` is working
4. Check browser console for errors

## 📱 **Test Scenarios**

### **Test 1: Fresh Install**
- Install extension
- Open popup
- Verify tab count = 1 (popup tab)
- Click "Show All Tabs" - should show 1 tab

### **Test 2: Multiple Tabs**
- Open 10+ tabs with different URLs
- Check badge updates
- Verify popup shows correct count
- Check tab list shows all tabs

### **Test 3: Duplicate Tabs**
- Open same URL in 3+ tabs
- Click "Kill Duplicates"
- Verify only 1 tab remains for that URL
- Check notification shows correct count

### **Test 4: Staleness Tracking**
- Open a tab and leave it inactive
- Wait 5+ minutes
- Check tab list - should show staleness
- Click on stale tab - staleness should reset

### **Test 5: Multiple Windows**
- Open multiple Chrome windows
- Check total tab count across all windows
- Verify tab list shows tabs from all windows
- Check last window time updates

### **Test 6: Extension Restart**
- Reload extension in `chrome://extensions/`
- Check if badge resets
- Verify popup still works
- Check if staleness tracking resumes

## 🎯 **Success Criteria**

### **✅ Extension Passes If:**
- Loads without errors
- Shows correct tab count
- Updates badge automatically
- Tab list displays all tabs correctly
- Staleness tracking works
- Duplicate detection works
- Task Manager help opens
- No console errors
- Works across multiple windows

### **❌ Extension Fails If:**
- Shows "Could not load background script"
- Badge doesn't update
- Tab list doesn't show
- Staleness doesn't track
- Duplicates aren't detected
- Console shows errors
- Tab count is wrong

## 🚀 **Ready for Chrome Web Store**

### **Before Submission:**
1. ✅ Test all functionality
2. ✅ Check for console errors
3. ✅ Verify badge updates
4. ✅ Test tab list features
5. ✅ Test staleness tracking
6. ✅ Test duplicate detection
7. ✅ Test Task Manager help
8. ✅ Test on different tab counts

### **Submission Package:**
- Use the generated zip file from `dist/` folder
- File: `tab-counter-extension-v1.4.1.zip`
- Size: ~0.02 MB
- Contains: All required files + icons + help page

## 🎉 **You're Ready!**

If all tests pass, your enhanced extension is ready for Chrome Web Store submission! The extension now provides:

- ✅ **Tab counting** with badge updates
- ✅ **Tab list** with staleness tracking
- ✅ **Duplicate detection** and removal
- ✅ **Task Manager** help access
- ✅ **No permission violations**
- ✅ **Working background script**
- ✅ **Enhanced user experience**

**Good luck with your submission! 🚀**
