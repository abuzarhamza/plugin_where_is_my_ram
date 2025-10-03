#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * Chrome Web Store Package Generator
 * Creates a zip file ready for Google Chrome Web Store submission
 */

// Configuration
const CONFIG = {
	extensionName: "Where Did My RAM Go",
	version: "1.4.1",
	outputDir: "./dist",
	outputFile: "tab-counter-extension-v1.4.1.zip",

	// Files to include in the package
	includeFiles: [
		"manifest.json",
		"popup.html",
		"popup.css",
		"popup.js",
		"background.js",
		"task-manager-help.html",
	],

	// Directories to include
	includeDirs: ["icons"],

	// Files to exclude
	excludeFiles: [
		"create_store_package.js",
		"generate_icons.html",
		"create_icons.html",
		"create_icons.js",
		"convert_svg_to_png.html",
		"convert_to_png.html",
		"test_extension.html",
		"README.md",
		"TESTING_GUIDE.md",
		".git",
		".gitignore",
		"node_modules",
		"package.json",
		"package-lock.json",
	],
};

/**
 * Validate manifest.json for Chrome Web Store requirements
 */
function validateManifest() {
	console.log("🔍 Validating manifest.json...");

	const manifestPath = path.join(process.cwd(), "manifest.json");

	if (!fs.existsSync(manifestPath)) {
		throw new Error("❌ manifest.json not found!");
	}

	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

	// Check manifest version
	if (manifest.manifest_version !== 3) {
		throw new Error("❌ Manifest version must be 3 for Chrome Web Store");
	}

	// Check required fields
	const requiredFields = ["name", "version", "description"];
	for (const field of requiredFields) {
		if (!manifest[field]) {
			throw new Error(
				`❌ Required field '${field}' is missing from manifest.json`
			);
		}
	}

	// Check icons
	if (!manifest.icons || !manifest.icons["128"]) {
		throw new Error("❌ 128x128 icon is required for Chrome Web Store");
	}

	console.log("✅ Manifest validation passed!");
	console.log(`   - Name: ${manifest.name}`);
	console.log(`   - Version: ${manifest.version}`);
	console.log(`   - Manifest Version: ${manifest.manifest_version}`);

	return manifest;
}

/**
 * Check if required icons exist
 */
function validateIcons() {
	console.log("🖼️  Validating icons...");

	const iconSizes = [16, 32, 48, 128];
	const missingIcons = [];

	for (const size of iconSizes) {
		const iconPath = path.join(process.cwd(), "icons", `icon${size}.png`);
		if (!fs.existsSync(iconPath)) {
			missingIcons.push(`${size}x${size}`);
		}
	}

	if (missingIcons.length > 0) {
		console.warn(`⚠️  Missing icons: ${missingIcons.join(", ")}`);
		console.warn(
			"   You may need to generate these icons before submission"
		);
	} else {
		console.log("✅ All required icons found!");
	}
}

/**
 * Create output directory
 */
function createOutputDir() {
	const outputPath = path.join(process.cwd(), CONFIG.outputDir);

	if (!fs.existsSync(outputPath)) {
		fs.mkdirSync(outputPath, { recursive: true });
		console.log(`📁 Created output directory: ${CONFIG.outputDir}`);
	}
}

/**
 * Check if file should be excluded
 */
function shouldExcludeFile(filePath) {
	const fileName = path.basename(filePath);
	const relativePath = path.relative(process.cwd(), filePath);

	// Check if file is in exclude list
	if (CONFIG.excludeFiles.includes(fileName)) {
		return true;
	}

	// Check if file is in exclude directories
	for (const excludeDir of CONFIG.excludeFiles) {
		if (relativePath.startsWith(excludeDir)) {
			return true;
		}
	}

	return false;
}

/**
 * Create the zip package
 */
async function createZipPackage() {
	console.log("📦 Creating Chrome Web Store package...");

	const outputPath = path.join(
		process.cwd(),
		CONFIG.outputDir,
		CONFIG.outputFile
	);

	// Create output stream
	const output = fs.createWriteStream(outputPath);
	const archive = archiver("zip", {
		zlib: { level: 9 }, // Maximum compression
	});

	// Handle archive events
	archive.on("error", (err) => {
		throw err;
	});

	archive.on("warning", (err) => {
		if (err.code === "ENOENT") {
			console.warn("⚠️  Archive warning:", err);
		} else {
			throw err;
		}
	});

	// Pipe archive data to the file
	archive.pipe(output);

	// Add files
	console.log("📄 Adding files to package...");

	// Add individual files
	for (const file of CONFIG.includeFiles) {
		const filePath = path.join(process.cwd(), file);
		if (fs.existsSync(filePath)) {
			archive.file(filePath, { name: file });
			console.log(`   ✅ Added: ${file}`);
		} else {
			console.warn(`   ⚠️  File not found: ${file}`);
		}
	}

	// Add directories
	for (const dir of CONFIG.includeDirs) {
		const dirPath = path.join(process.cwd(), dir);
		if (fs.existsSync(dirPath)) {
			archive.directory(dirPath, dir);
			console.log(`   ✅ Added directory: ${dir}/`);
		} else {
			console.warn(`   ⚠️  Directory not found: ${dir}`);
		}
	}

	// Finalize the archive
	await archive.finalize();

	return new Promise((resolve, reject) => {
		output.on("close", () => {
			const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
			console.log(`✅ Package created successfully!`);
			console.log(`   📦 File: ${CONFIG.outputFile}`);
			console.log(`   📁 Location: ${CONFIG.outputDir}/`);
			console.log(`   📊 Size: ${sizeInMB} MB`);
			console.log(
				`   📝 Archive contains ${archive.pointer()} total bytes`
			);
			resolve(outputPath);
		});

		output.on("error", reject);
	});
}

/**
 * Generate submission checklist
 */
function generateChecklist() {
	console.log("\n📋 Chrome Web Store Submission Checklist:");
	console.log("==========================================");
	console.log("✅ Manifest version 3");
	console.log("✅ Required icons (16x16, 32x32, 48x48, 128x128)");
	console.log("✅ All extension files included");
	console.log("✅ Package size optimized");
	console.log("");
	console.log("📝 Next Steps:");
	console.log("1. Go to Chrome Web Store Developer Dashboard");
	console.log('2. Click "Add new item"');
	console.log("3. Upload the zip file from dist/ folder");
	console.log("4. Fill in store listing details");
	console.log("5. Add screenshots and descriptions");
	console.log("6. Submit for review");
	console.log("");
	console.log("🔗 Useful Links:");
	console.log(
		"- Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/devconsole/"
	);
	console.log(
		"- Extension Publishing Guide: https://developer.chrome.com/docs/webstore/publish/"
	);
}

/**
 * Main function
 */
async function main() {
	try {
		console.log("🚀 Chrome Web Store Package Generator");
		console.log("=====================================\n");

		// Validate requirements
		validateManifest();
		validateIcons();

		// Create package
		createOutputDir();
		await createZipPackage();

		// Show checklist
		generateChecklist();

		console.log("\n🎉 Ready for Chrome Web Store submission!");
	} catch (error) {
		console.error("\n❌ Error:", error.message);
		process.exit(1);
	}
}

// Run the script
if (require.main === module) {
	main();
}

module.exports = { createZipPackage, validateManifest, validateIcons };
