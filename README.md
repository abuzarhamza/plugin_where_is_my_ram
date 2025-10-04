# Where Did My RAM Go? - Chrome Extension v1.1.0

A fun and useful Chrome extension that tracks your open tabs and close it. Help page to see ur task manager.

## Features

- **Tab Counter**: Shows the total number of open tabs with a live badge
- **Duplicate Tab Cleaner**: One-click removal of duplicate tabs
- **Beautiful UI**: Modern, gradient design with smooth animations
- **Real-time Updates**: Automatically updates when tabs are opened/closed

## System Requirements

- **Chrome Version**: 88 or higher (minimum_chrome_version: "88")
- **Manifest Version**: 3 (Chrome Extensions Manifest V3)
- **Permissions**: tabs, activeTab

## Testing

**Quick Test Guide**: See `TESTING_GUIDE.md` for detailed step-by-step testing instructions.

**Quick Start**:

1. Generate icons using `generate_icons.html`
2. Go to `chrome://extensions/`
3. Enable Developer mode
4. Click "Load unpacked" and select the latest version of distributiion from `dist` folder
5. Pin the extension and start testing!

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

**Important Notes**:

- **Minimum Chrome Version**: Chrome 88 or higher required

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
   - Find "Where Did My RAM Go?" and click the pin icon
   - The sheep icon will now appear in your toolbar

### Method 2: Package and Install

1. Follow the icon generation steps above
2. Zip the entire `plugin_where_is_my_ram` folder
3. Rename the zip file to `tabCounter.crx` (optional)
4. Drag and drop the zip file onto `chrome://extensions/`

## How to Use

1. **View Stats**: Click the sheep icon in your toolbar to see:
   - Total number of open tabs
   - Estimated total memory usage
   - Memory breakdown by tab

2. **Refresh Data**: Click the "Refresh" button to update statistics

3. **Clean Duplicates**: Click "Close Duplicates" to remove tabs with the same URL

4. **Monitor Badge**: The extension badge shows your current tab count with color coding:
   - Green: 1-20 tabs (healthy)
   - Orange: 21-50 tabs (getting crowded)
   - Red: 50+ tabs (sheep overload!)


### Files Structure

```text
plugin_where_is_my_ram/
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
- `activeTab`: To get current tab information

## Customization

### Changing the Theme

Edit `popup.css` to modify colors:

```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Stat card background */
background: rgba(255,255,255,0.95);
```

### Modifying Fun Facts

Edit the `funFacts` array in `popup.js`:

```javascript
const funFacts = [
    "Your custom fun fact here!",
    // ... more facts
];
```

## Troubleshooting

### Extension Not Loading

- **Chrome Version**: Ensure you're using Chrome 88 or higher
- **Icons**: Make sure all icon files are present in the `icons/` folder
- **Manifest**: Check that `manifest.json` is valid JSON
- **Errors**: Look for errors in `chrome://extensions/`
- **Developer Mode**: Ensure Developer mode is enabled

### Badge Not Updating

- Try refreshing the extension in `chrome://extensions/`
- Check the browser console for errors
- Make sure the background script is running

### Chrome Version Compatibility

- **Chrome 88+**: Full functionality with fallback estimation
- **Older Chrome**: Extension will not load (minimum version requirement)
- **Check Version**: Go to `chrome://version/` to see your Chrome version

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests!

## Demo Video

After testing your extension, create a short YouTube video showing:

1. Installing the extension
2. Opening multiple tabs
3. Viewing the memory breakdown
4. Using the duplicate tab cleaner
5. The fun facts and animations

Share the link with your instructor!

---

**Made with sheep and lots of RAM!**

*Remember: Every tab is a sheep, and too many sheep can make your computer feel like a crowded pasture!*
