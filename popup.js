// Fun facts about RAM and tabs
const funFacts = [
	"💡 Fun fact: Each tab is like a little sheep eating your RAM!",
	"🐑 Did you know? Chrome tabs can use 50-200MB of RAM each!",
	"💾 Pro tip: Close unused tabs to free up your sheep (RAM)!",
	"🔍 Memory leak? More like a sheep escape!",
	"⚡ Fast browsing = fewer hungry sheep in your RAM!",
	"🎯 One tab, two tab, red tab, blue tab... all eating RAM!",
	"🐏 RAM is like a pasture - too many sheep and it gets crowded!",
	"💻 Your computer's RAM is the ultimate sheep farm!",
	"📊 Real memory data from Chrome's processes API!",
	"💾 💾 = Real memory, 📊 = Estimated memory",
	"🔬 Using experimental Chrome processes API for accuracy!",
	"🐑 Real sheep (RAM) counting in action!",
	"🧠 Advanced JS heap & DOM complexity estimation!",
	"⚡ Memory estimates based on V8 engine patterns!",
	"🎯 Smart estimation: JS heap + DOM + media + network!",
	"🔍 Analyzing tab complexity for accurate memory usage!",
	"⏰ Tracking when tabs were last accessed!",
	"🕐 Memory usage increases over time (realistic behavior)!",
	"📊 Last accessed times help identify unused tabs!",
	"⏱️ Time-based memory growth simulation!",
	"💀 Kill Tabs: Close tabs and free up RAM instantly!",
	"⚡ Quick tab management for better performance!",
	"🔥 Close memory-hungry tabs with one click!",
	"💀 Tab killer: Free up RAM when you need it!",
];

// DOM elements
const tabCountEl = document.getElementById("tabCount");
const memoryUsageEl = document.getElementById("memoryUsage");
const memoryListEl = document.getElementById("memoryList");
const refreshBtn = document.getElementById("refreshBtn");
const closeTabsBtn = document.getElementById("closeTabsBtn");
const killTabsBtn = document.getElementById("killTabsBtn");
const funFactEl = document.getElementById("funFact");
const apiStatusEl = document.getElementById("apiStatus");

// Initialize the popup
document.addEventListener("DOMContentLoaded", async () => {
	await updateStats();
	setRandomFunFact();

	// Add event listeners
	refreshBtn.addEventListener("click", updateStats);
	closeTabsBtn.addEventListener("click", closeDuplicateTabs);
	killTabsBtn.addEventListener("click", openKillTabsManager);
});

// Get tab access times from background script
async function getTabAccessTimes() {
	try {
		const response = await chrome.runtime.sendMessage({
			action: "getTabAccessTimes",
		});
		// Convert Object back to Map
		const accessTimesMap = new Map();
		if (response) {
			Object.entries(response).forEach(([key, value]) => {
				accessTimesMap.set(parseInt(key), value);
			});
		}
		return accessTimesMap;
	} catch (error) {
		console.log("Could not get tab access times:", error);
		return new Map();
	}
}

// Update statistics
async function updateStats() {
	try {
		// Get all tabs
		const tabs = await chrome.tabs.query({});
		const tabCount = tabs.length;

		// Update tab count with animation
		animateNumber(tabCountEl, tabCount);

		// Get tab access times
		const tabAccessTimes = await getTabAccessTimes();

		// Get memory usage (Chrome doesn't provide direct memory API, so we'll simulate)
		const memoryData = await getMemoryUsage(tabs, tabAccessTimes);
		const totalMemory = memoryData.totalMemory;

		// Update memory usage
		animateNumber(memoryUsageEl, totalMemory, "MB");

		// Update memory breakdown
		updateMemoryBreakdown(memoryData.tabMemory);

		// Update API status
		updateApiStatus(memoryData.tabMemory);
	} catch (error) {
		console.log(
			"Note: chrome.processes API not available in stable Chrome - using fallback estimation"
		);
		// Fallback to basic tab counting
		try {
			const tabs = await chrome.tabs.query({});
			const tabCount = tabs.length;
			animateNumber(tabCountEl, tabCount);

			// Get tab access times
			const tabAccessTimes = await getTabAccessTimes();

			// Use estimation for memory
			const memoryData = await getEstimatedMemoryUsage(
				tabs,
				tabAccessTimes
			);
			const totalMemory = memoryData.totalMemory;
			animateNumber(memoryUsageEl, totalMemory, "MB");
			updateMemoryBreakdown(memoryData.tabMemory);
			updateApiStatus(memoryData.tabMemory);
		} catch (fallbackError) {
			console.error("Error in fallback:", fallbackError);
			showError("Failed to load data");
		}
	}
}

// Get real memory usage data using Chrome processes API
async function getMemoryUsage(tabs, tabAccessTimes = new Map()) {
	try {
		// Check if chrome.processes API is available
		if (!chrome.processes) {
			console.log(
				"chrome.processes API not available, falling back to estimation"
			);
			return getEstimatedMemoryUsage(tabs);
		}

		const tabMemory = [];
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
				const estimatedMemory = estimateTabMemory(tab);
				tabMemory.push({
					id: tab.id,
					title: tab.title || "Untitled Tab",
					url: tab.url,
					memory: estimatedMemory,
					active: tab.active,
					estimated: true,
				});
				totalMemory += estimatedMemory;
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
						const memoryInMB = Math.round(
							memoryPerTab / (1024 * 1024)
						); // Convert to MB
						tabMemory.push({
							id: tab.id,
							title: tab.title || "Untitled Tab",
							url: tab.url,
							memory: memoryInMB,
							active: tab.active,
							estimated: false,
						});
						totalMemory += memoryPerTab;
					}
				}
			} catch (error) {
				console.log(
					"Error getting process info, falling back to estimation:",
					error
				);
				return getEstimatedMemoryUsage(tabs);
			}
		}

		// Sort by memory usage (highest first)
		tabMemory.sort((a, b) => b.memory - a.memory);

		return {
			totalMemory: Math.round(totalMemory / (1024 * 1024)), // Convert to MB
			tabMemory: tabMemory,
		};
	} catch (error) {
		console.log(
			"Error in getMemoryUsage, falling back to estimation:",
			error
		);
		return getEstimatedMemoryUsage(tabs);
	}
}

// Fallback estimation function (original logic)
function getEstimatedMemoryUsage(tabs, tabAccessTimes = new Map()) {
	const tabMemory = [];
	let totalMemory = 0;

	for (const tab of tabs) {
		const memory = estimateTabMemory(tab, tabAccessTimes);
		totalMemory += memory;

		// Get last accessed time
		const lastAccessed = tabAccessTimes.get(tab.id) || Date.now();
		const timeSinceAccess = Date.now() - lastAccessed;

		tabMemory.push({
			id: tab.id,
			title: tab.title || "Untitled Tab",
			url: tab.url,
			memory: memory,
			active: tab.active,
			estimated: true,
			lastAccessed: lastAccessed,
			timeSinceAccess: timeSinceAccess,
		});
	}

	// Sort by memory usage (highest first)
	tabMemory.sort((a, b) => b.memory - a.memory);

	return {
		totalMemory: Math.round(totalMemory / 1024), // Convert to MB
		tabMemory: tabMemory,
	};
}

// Estimate memory for a single tab based on JS stack/heap patterns
function estimateTabMemory(tab, tabAccessTimes = new Map()) {
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

// Update memory breakdown list
function updateMemoryBreakdown(tabMemory) {
	if (tabMemory.length === 0) {
		memoryListEl.innerHTML = '<div class="loading">No tabs found</div>';
		return;
	}

	const html = tabMemory
		.slice(0, 10)
		.map(
			(tab) => `
        <div class="memory-item ${tab.active ? "active" : ""}">
            <div class="tab-title" title="${tab.title}">
                ${tab.active ? "🎯 " : ""}${truncateText(tab.title, 20)}
                ${tab.estimated ? "📊" : "💾"}
            </div>
            <div class="memory-amount">${tab.memory}MB</div>
            <div class="last-accessed">${formatTimeAgo(
				tab.timeSinceAccess
			)}</div>
        </div>
    `
		)
		.join("");

	memoryListEl.innerHTML = html;
}

// Animate number changes
function animateNumber(element, newValue, suffix = "") {
	const currentValue = parseInt(element.textContent) || 0;
	const increment = (newValue - currentValue) / 20;
	let current = currentValue;

	element.classList.add("updating");

	const timer = setInterval(() => {
		current += increment;
		if (
			(increment > 0 && current >= newValue) ||
			(increment < 0 && current <= newValue)
		) {
			current = newValue;
			clearInterval(timer);
			element.classList.remove("updating");
		}
		element.textContent = Math.round(current) + suffix;
	}, 50);
}

// Close duplicate tabs
async function closeDuplicateTabs() {
	try {
		const tabs = await chrome.tabs.query({});
		const urlMap = new Map();
		const tabsToClose = [];

		// Find duplicate URLs
		tabs.forEach((tab) => {
			if (urlMap.has(tab.url)) {
				tabsToClose.push(tab.id);
			} else {
				urlMap.set(tab.url, tab.id);
			}
		});

		if (tabsToClose.length === 0) {
			showNotification("No duplicate tabs found! 🎉");
			return;
		}

		// Close duplicate tabs
		await chrome.tabs.remove(tabsToClose);
		showNotification(`Closed ${tabsToClose.length} duplicate tab(s)! 🗑️`);

		// Update stats
		setTimeout(updateStats, 500);
	} catch (error) {
		console.error("Error closing duplicate tabs:", error);
		showNotification("Failed to close duplicate tabs");
	}
}

// Show notification
function showNotification(message) {
	// Create a temporary notification element
	const notification = document.createElement("div");
	notification.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
	notification.textContent = message;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
}

// Show error message
function showError(message) {
	memoryListEl.innerHTML = `<div class="loading" style="color: #e53e3e;">${message}</div>`;
}

// Set random fun fact
function setRandomFunFact() {
	const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
	funFactEl.textContent = randomFact;
}

// Truncate text
function truncateText(text, maxLength) {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + "...";
}

// Format time ago
function formatTimeAgo(milliseconds) {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60) return "now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
}

// Update API status based on data type
function updateApiStatus(tabMemory) {
	if (!apiStatusEl) return;

	// Check if any tab has real data (not estimated)
	const hasRealData = tabMemory.some((tab) => !tab.estimated);

	if (hasRealData) {
		apiStatusEl.textContent =
			"💾 Using real memory data (Chrome processes API)";
		apiStatusEl.style.color = "rgba(76, 175, 80, 0.8)"; // Green
	} else {
		apiStatusEl.textContent =
			"📊 Using estimated memory data (Chrome Dev/Canary for real data)";
		apiStatusEl.style.color = "rgba(255, 255, 255, 0.6)"; // White
	}
}

// Kill Tabs functionality
async function openKillTabsManager() {
	try {
		const tabs = await chrome.tabs.query({});

		// Create modal for Kill Tabs manager
		createKillTabsModal(tabs);
	} catch (error) {
		console.error("Error opening Kill Tabs manager:", error);
		showNotification("Failed to open Kill Tabs manager");
	}
}

// Create Kill Tabs modal
function createKillTabsModal(tabs) {
	// Create modal overlay
	const modal = document.createElement("div");
	modal.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.8);
		z-index: 10000;
		display: flex;
		justify-content: center;
		align-items: center;
	`;

	// Create modal content
	const modalContent = document.createElement("div");
	modalContent.style.cssText = `
		background: white;
		border-radius: 12px;
		padding: 20px;
		max-width: 500px;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 10px 30px rgba(0,0,0,0.3);
	`;

	modalContent.innerHTML = `
		<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
			<h2 style="margin: 0; color: #e53e3e;">💀 Kill Tabs Manager</h2>
			<button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
		</div>
		
		<div style="margin-bottom: 20px;">
			<p style="color: #666; margin: 0;">Select tabs to close permanently. This will free up RAM immediately.</p>
		</div>
		
		<div style="margin-bottom: 15px; display: flex; gap: 10px;">
			<button id="killSelected" style="flex: 1; padding: 12px; background: #e53e3e; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">💀 Kill Selected Tabs</button>
			<button id="cancelModal" style="flex: 1; padding: 12px; background: #718096; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
		</div>
		
		<div style="margin-bottom: 15px; display: flex; gap: 10px;">
			<button id="selectAll" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Select All</button>
			<button id="selectNone" style="flex: 1; padding: 10px; background: #718096; color: white; border: none; border-radius: 6px; cursor: pointer;">Select None</button>
		</div>
		
		<div id="tabsList" style="max-height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
			${tabs
				.map(
					(tab) => `
				<div style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0;">
					<input type="checkbox" id="tab-${tab.id}" value="${
						tab.id
					}" style="margin-right: 10px;">
					<div style="flex: 1;">
						<div style="font-weight: bold; color: #333; margin-bottom: 2px;">${truncateText(
							tab.title,
							40
						)}</div>
						<div style="font-size: 12px; color: #666;">${truncateText(tab.url, 50)}</div>
					</div>
				</div>
			`
				)
				.join("")}
		</div>
	`;

	modal.appendChild(modalContent);
	document.body.appendChild(modal);

	// Add event listeners
	document
		.getElementById("closeModal")
		.addEventListener("click", () => modal.remove());
	document
		.getElementById("cancelModal")
		.addEventListener("click", () => modal.remove());

	document.getElementById("selectAll").addEventListener("click", () => {
		document
			.querySelectorAll('#tabsList input[type="checkbox"]')
			.forEach((cb) => (cb.checked = true));
	});

	document.getElementById("selectNone").addEventListener("click", () => {
		document
			.querySelectorAll('#tabsList input[type="checkbox"]')
			.forEach((cb) => (cb.checked = false));
	});

	document
		.getElementById("killSelected")
		.addEventListener("click", async () => {
			const selectedTabs = Array.from(
				document.querySelectorAll(
					'#tabsList input[type="checkbox"]:checked'
				)
			).map((cb) => parseInt(cb.value));

			if (selectedTabs.length === 0) {
				showNotification("Please select at least one tab to kill");
				return;
			}

			await killSelectedTabs(selectedTabs);
			modal.remove();
		});

	// Close modal when clicking outside
	modal.addEventListener("click", (e) => {
		if (e.target === modal) modal.remove();
	});
}

// Kill selected tabs
async function killSelectedTabs(tabIds) {
	try {
		// Close the selected tabs
		await chrome.tabs.remove(tabIds);

		showNotification(`💀 Killed ${tabIds.length} tab(s) and freed up RAM!`);

		// Update stats after closing tabs
		setTimeout(updateStats, 500);
	} catch (error) {
		console.error("Error killing tabs:", error);
		showNotification("Failed to kill selected tabs");
	}
}

// Update fun fact periodically
setInterval(setRandomFunFact, 10000); // Change every 10 seconds
