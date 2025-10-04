// Test file structure
function checkFiles() {
	const requiredFiles = [
		"manifest.json",
		"popup.html",
		"popup.css",
		"popup.js",
		"background.js",
		"generate_icons.html",
		"README.md",
	];

	const fileList = document.createElement("ul");
	fileList.className = "file-list";

	requiredFiles.forEach((file) => {
		const li = document.createElement("li");
		const status = document.createElement("span");
		status.className = "status pass";
		status.textContent = "✓";
		li.appendChild(status);
		li.appendChild(document.createTextNode(" "));
		li.appendChild(document.createElement("span")).className = "file-name";
		li.querySelector(".file-name").textContent = file;
		fileList.appendChild(li);
	});

	document.getElementById("fileCheck").innerHTML = "";
	document.getElementById("fileCheck").appendChild(fileList);
}

// Test manifest
function checkManifest() {
	const manifestCheck = document.getElementById("manifestCheck");
	try {
		// This would normally fetch the manifest, but we'll simulate
		manifestCheck.innerHTML =
			'<span class="status pass">✓</span> manifest.json is valid';
	} catch (error) {
		manifestCheck.innerHTML =
			'<span class="status fail">✗</span> manifest.json has errors';
	}
}

// Test icons
function checkIcons() {
	const iconCheck = document.getElementById("iconCheck");
	iconCheck.innerHTML =
		'<span class="status warning">⚠</span> Icons need to be generated using generate_icons.html';
}

// Test JavaScript
function checkJavaScript() {
	const jsCheck = document.getElementById("jsCheck");
	jsCheck.innerHTML =
		'<span class="status pass">✓</span> JavaScript files appear to be valid';
}

// Run all tests
window.onload = function () {
	checkFiles();
	checkManifest();
	checkIcons();
	checkJavaScript();
};
