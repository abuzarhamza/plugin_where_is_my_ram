// Simple Node.js script to create basic PNG icons
// Run with: node create_icons.js

const fs = require("fs");
const path = require("path");

// Create a simple PNG header and data for each size
function createSimplePNG(size) {
	// This is a very basic PNG structure - in practice you'd use a proper PNG library
	// For now, let's create a simple colored square

	const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${
		size / 2 - 2
	}" fill="#667eea" stroke="#764ba2" stroke-width="2"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${
		size / 2 - 8
	}" fill="white" opacity="0.9"/>
        <circle cx="${size / 2 - 4}" cy="${size / 2 - 4}" r="2" fill="black"/>
        <circle cx="${size / 2 + 4}" cy="${size / 2 - 4}" r="2" fill="black"/>
        <ellipse cx="${size / 2}" cy="${size / 2}" rx="2" ry="1" fill="black"/>
    </svg>`;

	return canvas;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) {
	fs.mkdirSync(iconsDir);
}

// Create SVG files for each size (Chrome can use SVG icons)
const sizes = [16, 32, 48, 128];

sizes.forEach((size) => {
	const svgContent = createSimplePNG(size);
	const filename = `icon${size}.svg`;
	const filepath = path.join(iconsDir, filename);

	fs.writeFileSync(filepath, svgContent);
	console.log(`Created ${filename}`);
});

console.log("All SVG icons created!");
console.log("Note: You can use these SVG files, but PNG files are preferred.");
console.log(
	"To convert to PNG, use the create_icons.html file in your browser."
);
