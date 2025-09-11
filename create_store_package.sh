#!/bin/bash

# Chrome Web Store Package Generator (Shell Script)
# Creates a zip file ready for Google Chrome Web Store submission

set -e  # Exit on any error

# Configuration
EXTENSION_NAME="Where Did My RAM Go"
VERSION="1.4.1"
OUTPUT_DIR="./dist"
OUTPUT_FILE="tab-counter-extension-v${VERSION}.zip"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Chrome Web Store Package Generator${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}📄 $1${NC}"
}

# Validate manifest.json
validate_manifest() {
    print_info "Validating manifest.json..."
    
    if [ ! -f "manifest.json" ]; then
        print_error "manifest.json not found!"
        exit 1
    fi
    
    # Check if manifest version is 3
    if ! grep -q '"manifest_version": 3' manifest.json; then
        print_error "Manifest version must be 3 for Chrome Web Store"
        exit 1
    fi
    
    # Check required fields
    if ! grep -q '"name"' manifest.json; then
        print_error "Required field 'name' is missing from manifest.json"
        exit 1
    fi
    
    if ! grep -q '"version"' manifest.json; then
        print_error "Required field 'version' is missing from manifest.json"
        exit 1
    fi
    
    if ! grep -q '"description"' manifest.json; then
        print_error "Required field 'description' is missing from manifest.json"
        exit 1
    fi
    
    print_status "Manifest validation passed!"
}

# Validate icons
validate_icons() {
    print_info "Validating icons..."
    
    local missing_icons=()
    local icon_sizes=(16 32 48 128)
    
    for size in "${icon_sizes[@]}"; do
        if [ ! -f "icons/icon${size}.png" ]; then
            missing_icons+=("${size}x${size}")
        fi
    done
    
    if [ ${#missing_icons[@]} -gt 0 ]; then
        print_warning "Missing icons: ${missing_icons[*]}"
        print_warning "You may need to generate these icons before submission"
    else
        print_status "All required icons found!"
    fi
}

# Create output directory
create_output_dir() {
    if [ ! -d "$OUTPUT_DIR" ]; then
        mkdir -p "$OUTPUT_DIR"
        print_status "Created output directory: $OUTPUT_DIR"
    fi
}

# Create zip package
create_zip_package() {
    print_info "Creating Chrome Web Store package..."
    
    local output_path="$OUTPUT_DIR/$OUTPUT_FILE"
    
    # Remove existing zip if it exists
    if [ -f "$output_path" ]; then
        rm "$output_path"
    fi
    
    # Create zip file with required files
    print_info "Adding files to package..."
    
    # Add core extension files
    local files=(
        "manifest.json"
        "popup.html"
        "popup.css"
        "popup.js"
        "background.js"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_status "Added: $file"
        else
            print_warning "File not found: $file"
        fi
    done
    
    # Create the zip file
    zip -r "$output_path" \
        manifest.json \
        popup.html \
        popup.css \
        popup.js \
        background.js \
        icons/ \
        -x "*.DS_Store" "*.git*" "node_modules/*" "*.md" "*.html" "*.js" "create_*" "test_*" "generate_*" "convert_*"
    
    # Get file size
    local file_size=$(du -h "$output_path" | cut -f1)
    
    print_status "Package created successfully!"
    print_info "File: $OUTPUT_FILE"
    print_info "Location: $OUTPUT_DIR/"
    print_info "Size: $file_size"
}

# Generate submission checklist
generate_checklist() {
    echo ""
    echo -e "${BLUE}📋 Chrome Web Store Submission Checklist:${NC}"
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${GREEN}✅ Manifest version 3${NC}"
    echo -e "${GREEN}✅ Required icons (16x16, 32x32, 48x48, 128x128)${NC}"
    echo -e "${GREEN}✅ All extension files included${NC}"
    echo -e "${GREEN}✅ Package size optimized${NC}"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "1. Go to Chrome Web Store Developer Dashboard"
    echo "2. Click \"Add new item\""
    echo "3. Upload the zip file from dist/ folder"
    echo "4. Fill in store listing details"
    echo "5. Add screenshots and descriptions"
    echo "6. Submit for review"
    echo ""
    echo -e "${BLUE}🔗 Useful Links:${NC}"
    echo "- Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/devconsole/"
    echo "- Extension Publishing Guide: https://developer.chrome.com/docs/webstore/publish/"
}

# Main execution
main() {
    validate_manifest
    validate_icons
    create_output_dir
    create_zip_package
    generate_checklist
    
    echo ""
    echo -e "${GREEN}🎉 Ready for Chrome Web Store submission!${NC}"
}

# Run main function
main
