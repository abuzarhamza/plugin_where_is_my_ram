// Enhanced background script for tab counter extension with staleness tracking
// Tracks tab activity and provides detailed tab information

let lastWindowOpenTime = Date.now();
let tabCount = 0;
let tabActivityTimes = new Map(); // Track when each tab was last active
let tabStaleness = new Map(); // Track how long tabs have been stale

// Initialize when extension starts
chrome.runtime.onStartup.addListener(() => {
	lastWindowOpenTime = Date.now();
	updateBadge();
	initializeTabTracking();
});

// Update badge when extension is installed
chrome.runtime.onInstalled.addListener(() => {
	lastWindowOpenTime = Date.now();
	updateBadge();
	initializeTabTracking();
});

// Initialize tab tracking
function initializeTabTracking() {
	// Get all existing tabs and set their initial activity time
	chrome.tabs.query({}, (tabs) => {
		const now = Date.now();
		tabs.forEach((tab) => {
			tabActivityTimes.set(tab.id, now);
			tabStaleness.set(tab.id, 0);
		});
	});
}

// Simple badge update function
function updateBadge() {
	// Get tab count from all windows
	chrome.windows.getAll({ populate: true }, (windows) => {
		let totalTabs = 0;
		windows.forEach((window) => {
			if (window.tabs) {
				totalTabs += window.tabs.length;
			}
		});

		tabCount = totalTabs;

		// Update badge
		chrome.action.setBadgeText({
			text: totalTabs.toString(),
		});

		// Set badge color based on tab count
		let color = "#4CAF50"; // Green for low count
		if (totalTabs > 20) color = "#FF9800"; // Orange for medium
		if (totalTabs > 50) color = "#F44336"; // Red for high

		chrome.action.setBadgeBackgroundColor({ color: color });
	});
}

// Track tab activity
chrome.tabs.onActivated.addListener((activeInfo) => {
	const now = Date.now();
	tabActivityTimes.set(activeInfo.tabId, now);
	tabStaleness.set(activeInfo.tabId, 0);
});

// Track when tabs are updated (content loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete") {
		const now = Date.now();
		tabActivityTimes.set(tabId, now);
		tabStaleness.set(tabId, 0);
	}
});

// Track when new tabs are created
chrome.tabs.onCreated.addListener((tab) => {
	const now = Date.now();
	tabActivityTimes.set(tab.id, now);
	tabStaleness.set(tab.id, 0);
});

// Track when tabs are removed
chrome.tabs.onRemoved.addListener((tabId) => {
	tabActivityTimes.delete(tabId);
	tabStaleness.delete(tabId);
});

// Update staleness every minute
setInterval(() => {
	const now = Date.now();
	tabActivityTimes.forEach((lastActive, tabId) => {
		const staleness = Math.floor((now - lastActive) / 1000); // in seconds
		tabStaleness.set(tabId, staleness);
	});
}, 60000); // Update every minute

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getTabInfo") {
		sendResponse({
			tabCount: tabCount,
			lastWindowOpenTime: lastWindowOpenTime,
		});
	} else if (request.action === "getAllTabs") {
		// Get all tabs with their information
		chrome.tabs.query({}, (tabs) => {
			const tabsWithInfo = tabs.map((tab) => {
				const lastActive = tabActivityTimes.get(tab.id) || Date.now();
				const staleness = tabStaleness.get(tab.id) || 0;

				return {
					id: tab.id,
					title: tab.title,
					url: tab.url,
					active: tab.active,
					windowId: tab.windowId,
					lastActive: lastActive,
					staleness: staleness,
					stalenessFormatted: formatStaleness(staleness),
				};
			});

			sendResponse({ tabs: tabsWithInfo });
		});
		return true; // Keep message channel open for async response
	} else if (request.action === "closeDuplicateTabs") {
		// Find and close duplicate tabs
		chrome.tabs.query({}, (tabs) => {
			const urlMap = new Map();
			const duplicates = [];

			// Group tabs by URL
			tabs.forEach((tab) => {
				if (
					tab.url &&
					!tab.url.startsWith("chrome://") &&
					!tab.url.startsWith("chrome-extension://")
				) {
					if (!urlMap.has(tab.url)) {
						urlMap.set(tab.url, []);
					}
					urlMap.get(tab.url).push(tab);
				}
			});

			// Find duplicates (keep the most recently active one)
			urlMap.forEach((tabsWithSameUrl, url) => {
				if (tabsWithSameUrl.length > 1) {
					// Sort by last active time (most recent first)
					tabsWithSameUrl.sort((a, b) => {
						const aTime = tabActivityTimes.get(a.id) || 0;
						const bTime = tabActivityTimes.get(b.id) || 0;
						return bTime - aTime;
					});

					// Keep the first (most recent) tab, close the rest
					const tabsToClose = tabsWithSameUrl.slice(1);
					duplicates.push(...tabsToClose);
				}
			});

			// Close duplicate tabs
			if (duplicates.length > 0) {
				const tabIds = duplicates.map((tab) => tab.id);
				chrome.tabs.remove(tabIds, () => {
					sendResponse({
						success: true,
						closedCount: duplicates.length,
						closedTabs: duplicates.map((tab) => ({
							title: tab.title,
							url: tab.url,
						})),
					});
				});
			} else {
				sendResponse({
					success: true,
					closedCount: 0,
					message: "No duplicate tabs found",
				});
			}
		});
		return true; // Keep message channel open for async response
	}
});

// Format staleness into human readable format
function formatStaleness(seconds) {
	if (seconds < 60) {
		return `${seconds}s ago`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}m ago`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours}h ago`;
	} else {
		const days = Math.floor(seconds / 86400);
		return `${days}d ago`;
	}
}

// Update badge periodically
setInterval(updateBadge, 5000); // Update every 5 seconds

// Initial badge update
updateBadge();
