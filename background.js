// Background script for "Where Did My RAM Go? 🐑" Chrome Extension

// Track tab statistics
let tabStats = {
	totalTabs: 0,
	totalMemory: 0,
	lastUpdate: Date.now(),
};

// Track tab access times
let tabAccessTimes = new Map();

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
	console.log("🐑 Where Did My RAM Go? extension installed!");
	updateTabStats();
});

// Listen for tab changes
chrome.tabs.onCreated.addListener((tab) => {
	console.log("New tab created:", tab.url);
	// Record initial access time for new tab
	tabAccessTimes.set(tab.id, Date.now());
	updateTabStats();
});

chrome.tabs.onRemoved.addListener((tabId) => {
	console.log("Tab removed:", tabId);
	// Clean up access time tracking
	tabAccessTimes.delete(tabId);
	updateTabStats();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete") {
		console.log("Tab updated:", tab.url);
		// Update access time when tab finishes loading
		tabAccessTimes.set(tabId, Date.now());
		updateTabStats();
	}
});

// Track tab activation (when user switches to a tab)
chrome.tabs.onActivated.addListener((activeInfo) => {
	// Record access time when tab becomes active
	tabAccessTimes.set(activeInfo.tabId, Date.now());
	// Update stats when user switches tabs
	setTimeout(updateTabStats, 1000);
});

// Update tab statistics
async function updateTabStats() {
	try {
		const tabs = await chrome.tabs.query({});
		tabStats.totalTabs = tabs.length;
		tabStats.lastUpdate = Date.now();

		// Calculate estimated memory usage
		tabStats.totalMemory = await calculateMemoryUsage(tabs);

		// Store stats for popup to access
		chrome.storage.local.set({ tabStats });

		// Update badge with tab count
		chrome.action.setBadgeText({
			text: tabStats.totalTabs.toString(),
		});

		// Set badge color based on tab count
		let badgeColor = "#4CAF50"; // Green for low tab count
		if (tabStats.totalTabs > 20) badgeColor = "#FF9800"; // Orange for medium
		if (tabStats.totalTabs > 50) badgeColor = "#F44336"; // Red for high

		chrome.action.setBadgeBackgroundColor({ color: badgeColor });
	} catch (error) {
		console.log(
			"Note: chrome.processes API not available in stable Chrome - using fallback estimation"
		);
		// Still update basic tab count even if memory calculation fails
		try {
			const tabs = await chrome.tabs.query({});
			tabStats.totalTabs = tabs.length;
			tabStats.lastUpdate = Date.now();

			// Update badge with tab count
			chrome.action.setBadgeText({
				text: tabStats.totalTabs.toString(),
			});

			// Set badge color based on tab count
			let badgeColor = "#4CAF50"; // Green for low tab count
			if (tabStats.totalTabs > 20) badgeColor = "#FF9800"; // Orange for medium
			if (tabStats.totalTabs > 50) badgeColor = "#F44336"; // Red for high

			chrome.action.setBadgeBackgroundColor({ color: badgeColor });
		} catch (fallbackError) {
			console.error("Error in fallback tab counting:", fallbackError);
		}
	}
}

// Calculate real memory usage using Chrome processes API
async function calculateMemoryUsage(tabs) {
	try {
		// Check if chrome.processes API is available
		if (!chrome.processes) {
			console.log(
				"chrome.processes API not available, falling back to estimation"
			);
			return calculateEstimatedMemoryUsage(tabs);
		}

		const tabProcessMap = {};
		let totalMemory = 0;

		// Map each tab to its process ID
		for (const tab of tabs) {
			try {
				const processId = await chrome.processes.getProcessIdForTab(
					tab.id
				);
				if (!tabProcessMap[processId]) {
					tabProcessMap[processId] = [];
				}
				tabProcessMap[processId].push(tab);
			} catch (error) {
				console.log(
					`Could not get process ID for tab ${tab.id}:`,
					error
				);
				// Fallback to estimation for this tab
				totalMemory += estimateTabMemory(tab);
			}
		}

		// Get process information for all unique process IDs
		const processIds = Object.keys(tabProcessMap).map(Number);
		if (processIds.length > 0) {
			try {
				const processes = await chrome.processes.getProcessInfo(
					processIds,
					true
				);

				// Aggregate memory usage per tab
				for (const processId in processes) {
					const process = processes[processId];
					const memoryUsage = process.privateMemory || 0; // in bytes
					const tabsInProcess = tabProcessMap[processId] || [];

					// Distribute memory usage among tabs sharing the same process
					const memoryPerTab = memoryUsage / tabsInProcess.length;
					for (const tab of tabsInProcess) {
						totalMemory += memoryPerTab;
					}
				}
			} catch (error) {
				console.log(
					"Error getting process info, falling back to estimation:",
					error
				);
				return calculateEstimatedMemoryUsage(tabs);
			}
		}

		return Math.round(totalMemory / (1024 * 1024)); // Convert bytes to MB
	} catch (error) {
		console.log(
			"Error in calculateMemoryUsage, falling back to estimation:",
			error
		);
		return calculateEstimatedMemoryUsage(tabs);
	}
}

// Fallback estimation function (original logic)
function calculateEstimatedMemoryUsage(tabs) {
	let totalMemory = 0;

	for (const tab of tabs) {
		totalMemory += estimateTabMemory(tab);
	}

	return Math.round(totalMemory / 1024); // Convert to MB
}

// Estimate memory for a single tab based on JS stack/heap patterns
function estimateTabMemory(tab) {
	// Base memory allocation (V8 engine overhead, DOM, basic JS runtime)
	let memory = 45; // Base V8 heap + DOM overhead

	// JavaScript heap estimation based on content complexity
	let jsHeapEstimate = 0;
	let domComplexity = 0;
	let mediaOverhead = 0;
	let networkOverhead = 0;

	// URL-based memory patterns (based on real-world JS heap usage)
	const url = tab.url.toLowerCase();
	const title = tab.title || "";

	// Video/Media sites (high JS heap usage due to video processing)
	if (url.includes("youtube.com")) {
		jsHeapEstimate = 180; // Video player, ads, comments JS
		domComplexity = 120; // Complex DOM with video elements
		mediaOverhead = 200; // Video buffers, codecs
		networkOverhead = 50; // Streaming data
	} else if (url.includes("netflix.com")) {
		jsHeapEstimate = 220; // Heavy video streaming JS
		domComplexity = 100; // Complex UI
		mediaOverhead = 300; // High-quality video buffers
		networkOverhead = 80; // Streaming protocols
	} else if (url.includes("twitch.tv")) {
		jsHeapEstimate = 160; // Live streaming JS
		domComplexity = 90; // Chat, overlays
		mediaOverhead = 180; // Live video processing
		networkOverhead = 60; // Real-time streaming
	}
	// Social media (moderate JS heap, high DOM complexity)
	else if (url.includes("facebook.com")) {
		jsHeapEstimate = 140; // React components, tracking
		domComplexity = 200; // Complex social feed DOM
		mediaOverhead = 80; // Images, videos
		networkOverhead = 40; // Social data fetching
	} else if (url.includes("twitter.com") || url.includes("x.com")) {
		jsHeapEstimate = 120; // Tweet rendering, infinite scroll
		domComplexity = 150; // Tweet timeline DOM
		mediaOverhead = 60; // Images, videos
		networkOverhead = 35; // Real-time updates
	} else if (url.includes("instagram.com")) {
		jsHeapEstimate = 130; // Image processing, stories
		domComplexity = 180; // Grid layouts, stories
		mediaOverhead = 120; // High-res images
		networkOverhead = 45; // Media loading
	}
	// Email/Productivity (moderate JS, moderate DOM)
	else if (url.includes("gmail.com")) {
		jsHeapEstimate = 110; // Email client JS
		domComplexity = 100; // Email list, compose
		mediaOverhead = 30; // Attachments
		networkOverhead = 25; // Email sync
	} else if (url.includes("outlook.com")) {
		jsHeapEstimate = 100; // Office 365 JS
		domComplexity = 90; // Office-style UI
		mediaOverhead = 25; // Attachments
		networkOverhead = 20; // Email sync
	}
	// E-commerce (moderate JS, high DOM for product catalogs)
	else if (url.includes("amazon.com")) {
		jsHeapEstimate = 90; // Product search, cart
		domComplexity = 140; // Product listings
		mediaOverhead = 80; // Product images
		networkOverhead = 30; // Product data
	} else if (url.includes("ebay.com")) {
		jsHeapEstimate = 85; // Auction JS
		domComplexity = 120; // Product grids
		mediaOverhead = 70; // Product images
		networkOverhead = 25; // Auction data
	}
	// News/Content (low-moderate JS, moderate DOM)
	else if (url.includes("reddit.com")) {
		jsHeapEstimate = 80; // Comment threads, voting
		domComplexity = 100; // Post layouts
		mediaOverhead = 50; // Images, videos
		networkOverhead = 20; // Content loading
	} else if (url.includes("cnn.com") || url.includes("bbc.com")) {
		jsHeapEstimate = 70; // News widgets
		domComplexity = 90; // Article layouts
		mediaOverhead = 60; // News images/videos
		networkOverhead = 15; // News feeds
	}
	// Development/Technical (moderate JS, moderate DOM)
	else if (url.includes("github.com")) {
		jsHeapEstimate = 95; // Code rendering, syntax highlighting
		domComplexity = 80; // Code blocks, file trees
		mediaOverhead = 20; // Repository images
		networkOverhead = 30; // Git data
	} else if (url.includes("stackoverflow.com")) {
		jsHeapEstimate = 75; // Code snippets, Q&A
		domComplexity = 70; // Question layouts
		mediaOverhead = 15; // Code images
		networkOverhead = 20; // Question data
	}
	// Search engines (low JS, low DOM)
	else if (url.includes("google.com")) {
		jsHeapEstimate = 50; // Search suggestions, minimal JS
		domComplexity = 40; // Simple search page
		mediaOverhead = 10; // Favicons, minimal media
		networkOverhead = 15; // Search results
	} else if (url.includes("bing.com")) {
		jsHeapEstimate = 45; // Similar to Google
		domComplexity = 35; // Simple layout
		mediaOverhead = 8; // Minimal media
		networkOverhead = 12; // Search results
	}
	// Default for unknown sites
	else {
		jsHeapEstimate = 60; // Average JS usage
		domComplexity = 50; // Average DOM complexity
		mediaOverhead = 20; // Average media
		networkOverhead = 15; // Average network
	}

	// Title-based complexity adjustment (more content = more JS objects)
	const titleComplexity = Math.min(title.length * 1.5, 80);
	jsHeapEstimate += titleComplexity;

	// URL complexity (longer URLs often mean more dynamic content)
	const urlComplexity = Math.min(tab.url.length * 0.3, 30);
	jsHeapEstimate += urlComplexity;

	// Time-based memory growth (tabs open longer use more memory)
	const lastAccessed = tabAccessTimes.get(tab.id) || Date.now();
	const timeOpen = Date.now() - lastAccessed;
	const timeFactor = Math.min(timeOpen / (1000 * 60 * 60), 2); // Max 2x after 1 hour
	jsHeapEstimate *= 1 + timeFactor * 0.3;

	// Memory fragmentation factor (realistic browser behavior)
	const fragmentationFactor = 1.1 + Math.random() * 0.3; // 1.1x to 1.4x

	// Calculate total memory
	const totalMemory = Math.round(
		(memory +
			jsHeapEstimate +
			domComplexity +
			mediaOverhead +
			networkOverhead) *
			fragmentationFactor
	);

	// Ensure reasonable bounds (realistic browser memory usage)
	return Math.max(30, Math.min(totalMemory, 800)); // 30MB to 800MB range
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getTabStats") {
		sendResponse(tabStats);
	} else if (request.action === "updateStats") {
		updateTabStats().then(() => {
			sendResponse(tabStats);
		});
		return true; // Keep message channel open for async response
	} else if (request.action === "getTabAccessTimes") {
		// Convert Map to Object for JSON serialization
		const accessTimesObj = {};
		tabAccessTimes.forEach((value, key) => {
			accessTimesObj[key] = value;
		});
		sendResponse(accessTimesObj);
	}
});

// Periodic update (every 30 seconds)
setInterval(updateTabStats, 30000);

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
	console.log("🐑 Extension started up!");
	updateTabStats();
});

// Handle tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
	// Update stats when user switches tabs
	setTimeout(updateTabStats, 1000);
});

// Handle window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
	if (windowId !== chrome.windows.WINDOW_ID_NONE) {
		// Update stats when window gains focus
		setTimeout(updateTabStats, 500);
	}
});

// Export for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
	module.exports = { updateTabStats, calculateMemoryUsage };
}
