# 🧪 Simple Testing Guide - Where Did My RAM Go? 🐑

## 🚀 **Quick Test (5 minutes)**

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
5. **Click "Chrome Task Manager"** - should open a help page with instructions

### **3. Test Badge**
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
- Refresh button updates display
- Chrome Task Manager opens
- Badge updates automatically
- No console errors

### **❌ Common Issues:**
- **"Could not load background script"** - Check manifest.json syntax
- **Badge not updating** - Check background.js
- **Task Manager help not opening** - Check popup.js and task-manager-help.html
- **Extension not loading** - Check all file paths

## 🔧 **Troubleshooting**

### **If Extension Won't Load:**
1. Check `chrome://extensions/` for error messages
2. Verify all files exist: `manifest.json`, `popup.html`, `popup.css`, `popup.js`, `background.js`
3. Check `icons/` folder has all required icon files
4. Reload the extension

### **If Badge Not Working:**
1. Check browser console for errors
2. Verify `background.js` is running
3. Check if `chrome.windows.getAll` is working

### **If Task Manager Help Not Opening:**
1. Check if `chrome.tabs.create` is working
2. Verify `task-manager-help.html` file exists
3. Check browser console for errors
4. Ensure `web_accessible_resources` is configured in manifest

## 📱 **Test on Different Scenarios**

### **Test 1: Fresh Install**
- Install extension
- Open popup
- Verify tab count = 1 (popup tab)

### **Test 2: Multiple Tabs**
- Open 10+ tabs
- Check badge updates
- Verify popup shows correct count

### **Test 3: Multiple Windows**
- Open multiple Chrome windows
- Check total tab count across all windows
- Verify last window time updates

### **Test 4: Extension Restart**
- Reload extension in `chrome://extensions/`
- Check if badge resets
- Verify popup still works

## 🎯 **Success Criteria**

### **✅ Extension Passes If:**
- Loads without errors
- Shows correct tab count
- Updates badge automatically
- Opens Task Manager help page
- No console errors
- Works across multiple windows

### **❌ Extension Fails If:**
- Shows "Could not load background script"
- Badge doesn't update
- Task Manager help doesn't open
- Console shows errors
- Tab count is wrong

## 🚀 **Ready for Chrome Web Store**

### **Before Submission:**
1. ✅ Test all functionality
2. ✅ Check for console errors
3. ✅ Verify badge updates
4. ✅ Test Task Manager help button
5. ✅ Test on different tab counts

### **Submission Package:**
- Use the generated zip file from `dist/` folder
- File: `tab-counter-extension-v1.4.1.zip`
- Size: ~0.02 MB
- Contains: All required files + icons

## 🎉 **You're Ready!**

If all tests pass, your extension is ready for Chrome Web Store submission! The simplified version should pass all Chrome Web Store requirements:

- ✅ No unused permissions
- ✅ Working background script
- ✅ Simple, focused functionality
- ✅ Proper manifest structure
- ✅ All required icons

**Good luck with your submission! 🚀**
