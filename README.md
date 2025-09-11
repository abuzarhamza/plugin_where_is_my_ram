# 🐑 Where Did My RAM Go? - Chrome Extension v1.1.0

A fun and useful Chrome extension that tracks your open tabs and estimates their memory usage. Because every tab is like a little sheep eating your RAM!

## ✨ Features

- **Tab Counter**: Shows the total number of open tabs with a live badge
- **Real Memory Usage**: Uses Chrome's experimental `chrome.processes` API for actual RAM usage data
- **Memory Breakdown**: Lists tabs by memory usage (highest first)
- **Duplicate Tab Cleaner**: One-click removal of duplicate tabs
- **Fun Facts**: Rotating fun facts about RAM and tabs
- **Beautiful UI**: Modern, gradient design with smooth animations
- **Real-time Updates**: Automatically updates when tabs are opened/closed

## 📋 System Requirements

- **Chrome Version**: 88 or higher (minimum_chrome_version: "88")
- **Manifest Version**: 3 (Chrome Extensions Manifest V3)
- **Permissions**: tabs, processes, activeTab
- **Recommended**: Chrome Dev or Canary channel for full functionality

## 🧪 Testing

**Quick Test Guide**: See `TESTING_GUIDE.md` for detailed step-by-step testing instructions.

**Quick Start**:
1. Generate icons using `generate_icons.html`
2. Go to `chrome://extensions/`
3. Enable Developer mode
4. Click "Load unpacked" and select the `tabCounter` folder
5. Pin the extension and start testing!

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

**⚠️ Important Notes**: 
- **Minimum Chrome Version**: Chrome 88 or higher required
- **Real Memory Data**: The `chrome.processes` API is experimental and works best in Chrome Dev or Canary channel
- **Fallback Mode**: For stable Chrome, the extension will fall back to smart estimation

1. **Generate Icons**:
   - Open `generate_icons.html` in your browser
   - Click the download buttons to save all icon sizes
   - Save them in the `icons/` folder with these exact names:
     - `icon16.png`
     - `icon32.png`
     - `icon48.png`
     - `icon128.png`

2. **Load Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `tabCounter` folder
   - The extension should now appear in your extensions list!

3. **Pin Extension**:

   - Click the puzzle piece icon in Chrome toolbar
   - Find "Where Did My RAM Go? 🐑" and click the pin icon
   - The sheep icon will now appear in your toolbar

### Method 2: Package and Install

1. Follow the icon generation steps above
2. Zip the entire `tabCounter` folder
3. Rename the zip file to `tabCounter.crx` (optional)
4. Drag and drop the zip file onto `chrome://extensions/`

## 🎯 How to Use

1. **View Stats**: Click the sheep icon in your toolbar to see:
   - Total number of open tabs
   - Estimated total memory usage
   - Memory breakdown by tab

2. **Refresh Data**: Click the "🔄 Refresh" button to update statistics

3. **Clean Duplicates**: Click "🗑️ Close Duplicates" to remove tabs with the same URL

4. **Monitor Badge**: The extension badge shows your current tab count with color coding:
   - 🟢 Green: 1-20 tabs (healthy)
   - 🟠 Orange: 21-50 tabs (getting crowded)
   - 🔴 Red: 50+ tabs (sheep overload!)

## 🛠️ Technical Details

### Memory Usage Algorithm

The extension uses **real memory data** from Chrome's experimental `chrome.processes` API:

- **Real Memory Data**: Uses `chrome.processes.getProcessIdForTab()` and `chrome.processes.getProcessInfo()` to get actual private memory usage
- **Process Distribution**: When multiple tabs share a process, memory is distributed evenly among them
- **Fallback Estimation**: If the processes API is unavailable, falls back to smart estimation based on:
  - **Base Memory**: 50MB per tab
  - **Website Type**: Different sites get different memory allocations (YouTube: +150MB, Netflix: +200MB, etc.)
  - **Content Length**: Longer page titles = more memory
  - **Random Variation**: ±30MB to simulate real-world usage
- **Visual Indicators**: 💾 = Real memory data, 📊 = Estimated memory data

### Files Structure

```text
tabCounter/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Styling for popup
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── generate_icons.html   # Icon generator tool
└── README.md            # This file
```

### Permissions Used

- `tabs`: To count and manage tabs
- `processes`: To access real memory usage data via Chrome's experimental API
- `activeTab`: To get current tab information

## 🎨 Customization

### Changing the Theme

Edit `popup.css` to modify colors:

```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Stat card background */
background: rgba(255,255,255,0.95);
```

### Adding New Website Memory Estimates

Edit `popup.js` and `background.js` to add new sites:

```javascript
if (tab.url.includes('newsite.com')) memory += 120;
```

### Modifying Fun Facts

Edit the `funFacts` array in `popup.js`:

```javascript
const funFacts = [
    "💡 Your custom fun fact here!",
    // ... more facts
];
```

## 🐛 Troubleshooting

### Extension Not Loading

- **Chrome Version**: Ensure you're using Chrome 88 or higher
- **Icons**: Make sure all icon files are present in the `icons/` folder
- **Manifest**: Check that `manifest.json` is valid JSON
- **Errors**: Look for errors in `chrome://extensions/`
- **Developer Mode**: Ensure Developer mode is enabled

### Memory Data Issues

- **Real Data**: The extension uses Chrome's experimental `chrome.processes` API for actual memory usage
- **Fallback Mode**: If the processes API isn't available, it falls back to smart estimation
- **Process Sharing**: Multiple tabs may share the same process, so memory is distributed evenly
- **Visual Indicators**: Look for 💾 (real data) vs 📊 (estimated data) icons next to tab names

### Badge Not Updating

- Try refreshing the extension in `chrome://extensions/`
- Check the browser console for errors
- Make sure the background script is running

### Chrome Version Compatibility

- **Chrome 88+**: Full functionality with fallback estimation
- **Chrome Dev/Canary**: Full functionality with real memory data via `chrome.processes` API
- **Older Chrome**: Extension will not load (minimum version requirement)
- **Check Version**: Go to `chrome://version/` to see your Chrome version

## 📝 Version History

### v1.1.0 (Current)
- ✅ Real memory usage via Chrome processes API
- ✅ Smart fallback estimation system
- ✅ Visual indicators (💾 real data, 📊 estimated data)
- ✅ Chrome 88+ compatibility
- ✅ Professional manifest configuration
- ✅ Comprehensive testing guide

### v1.0.0 (Initial Release)
- ✅ Basic tab counting
- ✅ Memory estimation algorithm
- ✅ Duplicate tab cleaner
- ✅ Fun facts and animations
- ✅ Beautiful UI design

## 🚀 Future Enhancements

- [x] Real memory usage API integration (Chrome processes API)
- [ ] Tab grouping and organization
- [ ] Memory usage history and trends
- [ ] Custom memory estimates per site
- [ ] Export data functionality
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Tab hibernation suggestions
- [ ] Memory usage alerts and notifications
- [ ] Process isolation detection

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests!

## 🎬 Demo Video

After testing your extension, create a short YouTube video showing:
1. Installing the extension
2. Opening multiple tabs
3. Viewing the memory breakdown
4. Using the duplicate tab cleaner
5. The fun facts and animations

Share the link with your instructor!

---

**Made with 🐑 and lots of RAM!**

*Remember: Every tab is a sheep, and too many sheep can make your computer feel like a crowded pasture!*
