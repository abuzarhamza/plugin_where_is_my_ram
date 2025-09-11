# 📦 Chrome Web Store Packaging Guide

This guide helps you create a zip package ready for Google Chrome Web Store submission.

## 🚀 Quick Start

### Option 1: Node.js Script (Recommended)
```bash
# Install dependencies
npm install

# Create the package
npm run build
```

### Option 2: Shell Script
```bash
# Make script executable (if not already)
chmod +x create_store_package.sh

# Run the script
./create_store_package.sh
```

## 📋 What the Scripts Do

### ✅ Validation Checks
- **Manifest Version**: Ensures manifest.json uses version 3
- **Required Fields**: Validates name, version, and description
- **Icons**: Checks for required icon sizes (16x16, 32x32, 48x48, 128x128)
- **File Structure**: Verifies all extension files exist

### 📦 Package Creation
- Creates a `dist/` directory
- Generates `tab-counter-extension-v1.4.1.zip`
- Includes only necessary files:
  - `manifest.json`
  - `popup.html`, `popup.css`, `popup.js`
  - `background.js`
  - `icons/` directory
- Excludes development files:
  - Scripts, documentation, test files
  - Git files, node_modules
  - Temporary files

## 📁 Output Structure

```
dist/
└── tab-counter-extension-v1.4.1.zip
    ├── manifest.json
    ├── popup.html
    ├── popup.css
    ├── popup.js
    ├── background.js
    └── icons/
        ├── icon16.png
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

## 🎯 Chrome Web Store Requirements

### ✅ Manifest Requirements
- [x] Manifest version 3
- [x] Name, version, description
- [x] Required permissions
- [x] Icons in multiple sizes

### ✅ File Requirements
- [x] All extension files included
- [x] No development files
- [x] Proper file structure
- [x] Optimized package size

## 📝 Submission Checklist

Before uploading to Chrome Web Store:

- [ ] **Package Created**: `dist/tab-counter-extension-v1.4.1.zip`
- [ ] **Manifest Validated**: Version 3, all required fields
- [ ] **Icons Present**: 16x16, 32x32, 48x48, 128x128 PNG files
- [ ] **Files Included**: All extension files, no dev files
- [ ] **Size Checked**: Package under 10MB (usually much smaller)

## 🔗 Next Steps

1. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole/
   - Sign in with your Google account

2. **Upload Extension**
   - Click "Add new item"
   - Upload `dist/tab-counter-extension-v1.4.1.zip`
   - Wait for upload to complete

3. **Fill Store Listing**
   - Extension name: "Where Did My RAM Go? 🐑"
   - Description: Detailed description of features
   - Category: Productivity
   - Screenshots: Add 1-5 screenshots
   - Promotional images (optional)

4. **Submit for Review**
   - Review all information
   - Submit for Chrome Web Store review
   - Wait for approval (usually 1-3 days)

## 🛠️ Troubleshooting

### Missing Icons
If you get warnings about missing icons:
```bash
# Use the icon generator
open convert_svg_to_png.html
# Generate and save all required PNG icons
```

### Package Too Large
If the package is too large:
- Check for unnecessary files
- Optimize images
- Remove development dependencies

### Manifest Errors
If manifest validation fails:
- Check JSON syntax
- Ensure all required fields are present
- Verify manifest version is 3

## 📊 Package Information

- **Extension Name**: Where Did My RAM Go? 🐑
- **Version**: 1.4.1
- **Manifest Version**: 3
- **Chrome Version**: 139.0.7258.155+
- **Estimated Size**: < 1MB
- **Permissions**: tabs, processes, activeTab

## 🎉 Success!

Once your package is created successfully, you'll see:
```
✅ Package created successfully!
📦 File: tab-counter-extension-v1.4.1.zip
📁 Location: dist/
📊 Size: X.XX MB
🎉 Ready for Chrome Web Store submission!
```

Your extension is now ready for the Chrome Web Store! 🚀
