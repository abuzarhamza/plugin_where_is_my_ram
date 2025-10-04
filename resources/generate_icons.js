// SVG content
const svgContent = `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <!-- Background circle -->
        <circle cx="64" cy="64" r="60" fill="#667eea" stroke="#764ba2" stroke-width="4"/>
        
        <!-- Sheep body -->
        <ellipse cx="64" cy="70" rx="25" ry="20" fill="white" opacity="0.9"/>
        
        <!-- Sheep head -->
        <circle cx="64" cy="50" r="15" fill="white" opacity="0.9"/>
        
        <!-- Sheep ears -->
        <ellipse cx="55" cy="42" rx="4" ry="8" fill="white" opacity="0.9"/>
        <ellipse cx="73" cy="42" rx="4" ry="8" fill="white" opacity="0.9"/>
        
        <!-- Sheep eyes -->
        <circle cx="60" cy="48" r="2" fill="black"/>
        <circle cx="68" cy="48" r="2" fill="black"/>
        
        <!-- Sheep nose -->
        <ellipse cx="64" cy="52" rx="2" ry="1.5" fill="black"/>
        
        <!-- RAM/Memory bars -->
        <rect x="20" y="20" width="8" height="20" fill="#4CAF50" opacity="0.8"/>
        <rect x="32" y="15" width="8" height="25" fill="#FF9800" opacity="0.8"/>
        <rect x="44" y="10" width="8" height="30" fill="#F44336" opacity="0.8"/>
        
        <rect x="76" y="20" width="8" height="20" fill="#4CAF50" opacity="0.8"/>
        <rect x="88" y="15" width="8" height="25" fill="#FF9800" opacity="0.8"/>
        <rect x="100" y="10" width="8" height="30" fill="#F44336" opacity="0.8"/>
        
        <!-- Tab icon -->
        <rect x="45" y="85" width="38" height="25" rx="3" fill="white" opacity="0.9" stroke="#667eea" stroke-width="2"/>
        <rect x="47" y="87" width="34" height="3" fill="#667eea"/>
        <text x="64" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#667eea">TAB</text>
    </svg>
`;

// Generate icons on page load
window.onload = function () {
	generateIcons();
	setupDownloadButtons();
};

function generateIcons() {
	const sizes = [16, 32, 48, 128];

	sizes.forEach((size) => {
		const canvas = document.getElementById(`icon${size}`);
		const ctx = canvas.getContext("2d");

		// Create image from SVG
		const img = new Image();
		const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
		const url = URL.createObjectURL(svgBlob);

		img.onload = function () {
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	});
}

function downloadIcon(size) {
	const canvas = document.getElementById(`icon${size}`);
	const link = document.createElement("a");
	link.download = `icon${size}.png`;
	link.href = canvas.toDataURL();
	link.click();
}

function setupDownloadButtons() {
	const sizes = [16, 32, 48, 128];
	sizes.forEach((size) => {
		const btn = document.getElementById(`download-btn-${size}`);
		if (btn) {
			btn.addEventListener("click", () => downloadIcon(size));
		}
	});
}
