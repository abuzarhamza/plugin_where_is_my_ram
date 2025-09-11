# 🧪 Testing Guide - Where Did My RAM Go? 🐑 v1.1.0

## 📋 Pre-Testing Checklist

### 1. Generate Icons First
Before testing, you MUST generate the required icons:

1. **Open Icon Generator**:
   - Open `generate_icons.html` in your Chrome browser
   - You should see 4 icon previews (16x16, 32x32, 48x48, 128x128)

2. **Download All Icons**:
   - Click "Download 16x16" button
   - Click "Download 32x32" button  
   - Click "Download 48x48" button
   - Click "Download 128x128" button

3. **Save Icons**:
   - Save all downloaded files in the `icons/` folder
   - Rename them to: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

## 🚀 Step-by-Step Testing Instructions

### Step 1: Load Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Type `chrome://extensions/` in your address bar
   - Press Enter

2. **Enable Developer Mode**:
   - Look for "Developer mode" toggle in the top-right corner
   - Click to enable it (should turn blue/on)

3. **Load Unpacked Extension**:
   - Click "Load unpacked" button
   - Navigate to your `tabCounter` folder
   - Select the folder and click "Select Folder"

4. **Verify Installation**:
   - You should see "Where Did My RAM Go? 🐑" in your extensions list
   - The extension should show as "Enabled"
   - Version should display as "1.1.0"

### Step 2: Pin Extension to Toolbar

1. **Pin the Extension**:
   - Click the puzzle piece icon (🧩) in Chrome toolbar
   - Find "Where Did My RAM Go? 🐑" in the list
   - Click the pin icon (📌) next to it
   - The sheep icon (🐑) should now appear in your toolbar

### Step 3: Basic Functionality Test

1. **Open Multiple Tabs**:
   - Open 5-10 different websites (YouTube, Google, Facebook, etc.)
   - Notice the badge number on the sheep icon should update

2. **Click the Extension**:
   - Click the sheep icon in your toolbar
   - The popup should open showing:
     - Total tab count
     - Total memory usage
     - Memory breakdown list
     - Fun fact at the bottom

3. **Check Badge Colors**:
   - **Green**: 1-20 tabs (healthy)
   - **Orange**: 21-50 tabs (getting crowded)
   - **Red**: 50+ tabs (sheep overload!)

### Step 4: Memory Data Testing

1. **Check Memory Indicators**:
   - Look for 💾 (real memory data) or 📊 (estimated data) next to tab names
   - Real data requires Chrome Dev/Canary channel
   - Estimated data works in stable Chrome

2. **Test Memory Calculation**:
   - Open a YouTube video tab
   - Open a simple Google search tab
   - YouTube should show higher memory usage

### Step 5: Feature Testing

1. **Refresh Button**:
   - Click the "🔄 Refresh" button
   - Numbers should animate and update

2. **Duplicate Tab Cleaner**:
   - Open the same website in multiple tabs
   - Click "🗑️ Close Duplicates" button
   - Duplicate tabs should be closed
   - You should see a notification

3. **Fun Facts**:
   - Wait 10 seconds
   - The fun fact at the bottom should change automatically

### Step 6: Real-time Updates Test

1. **Open New Tab**:
   - Press Ctrl+T (or Cmd+T on Mac)
   - Badge number should increase immediately

2. **Close Tab**:
   - Close any tab
   - Badge number should decrease immediately

3. **Switch Tabs**:
   - Switch between different tabs
   - The active tab should show 🎯 in the memory breakdown

## 🔍 Advanced Testing

### Test 1: High Tab Count
- Open 50+ tabs
- Check if badge turns red
- Verify popup still works smoothly

### Test 2: Memory-Intensive Sites
- Open YouTube with a video playing
- Open Netflix
- Open multiple Gmail tabs
- Check memory usage differences

### Test 3: Extension Reload
- Go to `chrome://extensions/`
- Click the refresh icon on your extension
- Test that everything still works

### Test 4: Chrome Restart
- Close Chrome completely
- Reopen Chrome
- Check that extension is still loaded and working

## 🐛 Troubleshooting Common Issues

### Issue: Extension Won't Load
**Solution**:
- Check that all 4 icon files exist in `icons/` folder
- Verify `manifest.json` is valid JSON
- Ensure Chrome version is 88 or higher

### Issue: No Icons Showing
**Solution**:
- Regenerate icons using `generate_icons.html`
- Make sure files are named exactly: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

### Issue: Badge Not Updating
**Solution**:
- Check browser console for errors (F12 → Console)
- Try refreshing the extension in `chrome://extensions/`

### Issue: Memory Shows as Estimated (📊)
**Solution**:
- This is normal in stable Chrome
- For real memory data (💾), use Chrome Dev or Canary channel

## 📊 Expected Results

### Successful Test Results:
- ✅ Extension loads without errors
- ✅ Sheep icon appears in toolbar with correct badge
- ✅ Popup opens and shows tab count and memory usage
- ✅ Badge updates when tabs are opened/closed
- ✅ Memory breakdown shows tabs with highest usage first
- ✅ Duplicate tab cleaner works
- ✅ Fun facts rotate every 10 seconds
- ✅ Refresh button updates data

### Performance Expectations:
- Popup should open within 1 second
- Badge should update within 2 seconds of tab changes
- Memory calculations should complete within 3 seconds
- No console errors during normal operation

## 🎬 Demo Video Checklist

When creating your demo video, make sure to show:

1. **Installation Process** (30 seconds)
   - Loading unpacked extension
   - Pinning to toolbar

2. **Basic Functionality** (1 minute)
   - Opening multiple tabs
   - Clicking extension popup
   - Showing tab count and memory usage

3. **Advanced Features** (1 minute)
   - Duplicate tab cleaner
   - Memory breakdown
   - Fun facts rotation

4. **Real-time Updates** (30 seconds)
   - Opening/closing tabs
   - Badge updates

**Total Video Length**: 3-4 minutes maximum

## 🚀 Ready for Production?

Your extension is ready when:
- ✅ All tests pass
- ✅ No console errors
- ✅ Icons display correctly
- ✅ All features work as expected
- ✅ Performance is smooth

**Version 1.1.0 Features**:
- Real memory usage via Chrome processes API
- Smart fallback estimation
- Visual indicators for data type
- Chrome 88+ compatibility
- Professional manifest configuration

Happy testing! 🐑💾
