// Enhanced popup script for tab counter extension with tab list and duplicate detection

document.addEventListener("DOMContentLoaded", function () {
	const tabCountEl = document.getElementById("tabCount");
	const lastWindowTimeEl = document.getElementById("lastWindowTime");
	const refreshBtn = document.getElementById("refreshBtn");
	const showTabsBtn = document.getElementById("showTabsBtn");
	const killDuplicatesBtn = document.getElementById("killDuplicatesBtn");
	const taskManagerBtn = document.getElementById("taskManagerBtn");
	const funFactEl = document.getElementById("funFact");
	const tabListSection = document.getElementById("tabListSection");
	const tabList = document.getElementById("tabList");
	const closeTabListBtn = document.getElementById("closeTabListBtn");

	// Update display
	function updateDisplay() {
		// Get tab info from background script
		chrome.runtime.sendMessage({ action: "getTabInfo" }, (response) => {
			if (response) {
				tabCountEl.textContent = response.tabCount || 0;

				// Format last window time
				if (response.lastWindowOpenTime) {
					const time = new Date(response.lastWindowOpenTime);
					const timeStr = time.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					});
					lastWindowTimeEl.textContent = timeStr;
				}
			}
		});

		// Set random fun fact
		setRandomFunFact();
	}

	// Set random fun fact
	function setRandomFunFact() {
		const funFacts = [
			"💡 Fun fact: Each tab is like a little sheep eating your RAM!",
			"🐑 Did you know? Chrome can use up to 1GB per tab!",
			"📊 Pro tip: Close unused tabs to save memory!",
			"⚡ Memory management is key to browser performance!",
			"🔍 Chrome Task Manager shows real memory usage!",
			"⏰ Stale tabs consume memory even when inactive!",
			"🗑️ Duplicate tabs are memory wasters!",
		];

		const randomFact =
			funFacts[Math.floor(Math.random() * funFacts.length)];
		funFactEl.textContent = randomFact;
	}

	// Show all tabs
	function showAllTabs() {
		chrome.runtime.sendMessage({ action: "getAllTabs" }, (response) => {
			if (response && response.tabs) {
				displayTabs(response.tabs);
				tabListSection.style.display = "block";
			}
		});
	}

	// Display tabs in the list
	function displayTabs(tabs) {
		tabList.innerHTML = "";

		// Sort tabs by staleness (most stale first)
		tabs.sort((a, b) => b.staleness - a.staleness);

		tabs.forEach((tab) => {
			const tabElement = createTabElement(tab);
			tabList.appendChild(tabElement);
		});
	}

	// Create individual tab element
	function createTabElement(tab) {
		const tabDiv = document.createElement("div");
		tabDiv.className = `tab-item ${tab.active ? "active" : ""}`;

		// Determine staleness class
		let stalenessClass = "fresh";
		if (tab.staleness > 300) stalenessClass = "stale"; // 5 minutes
		if (tab.staleness > 1800) stalenessClass = "very-stale"; // 30 minutes

		tabDiv.innerHTML = `
			<div class="tab-title" title="${tab.title}">${truncateText(tab.title, 40)}</div>
			<div class="tab-url" title="${tab.url}">${truncateText(tab.url, 50)}</div>
			<div class="tab-meta">
				<span class="tab-staleness ${stalenessClass}">${tab.stalenessFormatted}</span>
				<span class="tab-window">Window ${tab.windowId}</span>
			</div>
           <button class="close-tab-item-btn" data-tab-id="${tab.id}">✕</button>
		`;

		// Add click handler to focus the tab
		tabDiv.addEventListener("click", (event) => {
			if (!event.target.classList.contains("close-tab-item-btn")) {
				chrome.tabs.update(tab.id, { active: true });
				showNotification(`🔄 Switched to: ${tab.title}`);
			}
		});

		// Add click handler for the close button
		const closeButton = tabDiv.querySelector(".close-tab-item-btn");
		closeButton.addEventListener("click", (event) => {
			event.stopPropagation(); // Prevent the tabDiv click event from firing
			chrome.tabs.remove(tab.id, () => {
				showNotification(`🗑️ Closed tab: ${tab.title}`);
				// Refresh the tab list after closing a tab
				showAllTabs();
				updateDisplay();
			});
		});

		return tabDiv;
	}

	// Truncate text with ellipsis
	function truncateText(text, maxLength) {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	}

	// Kill duplicate tabs
	function killDuplicateTabs() {
		showNotification("🔍 Searching for duplicate tabs...");

		chrome.runtime.sendMessage(
			{ action: "closeDuplicateTabs" },
			(response) => {
				if (response && response.success) {
					if (response.closedCount > 0) {
						showNotification(
							`🗑️ Closed ${response.closedCount} duplicate tabs!`
						);
						// Refresh the display
						setTimeout(() => {
							updateDisplay();
							if (tabListSection.style.display !== "none") {
								showAllTabs();
							}
						}, 1000);
					} else {
						showNotification("✅ No duplicate tabs found!");
					}
				} else {
					showNotification("❌ Error closing duplicate tabs");
				}
			}
		);
	}

	// Show notification
	function showNotification(message) {
		// Create temporary notification element
		const notification = document.createElement("div");
		notification.className = "notification";
		notification.textContent = message;
		notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

		document.body.appendChild(notification);

		// Remove after 3 seconds
		setTimeout(() => {
			notification.remove();
		}, 3000);
	}

	// Event listeners
	refreshBtn.addEventListener("click", () => {
		updateDisplay();
		showNotification("🔄 Refreshed!");
	});

	showTabsBtn.addEventListener("click", () => {
		showAllTabs();
		showNotification("📋 Loading all tabs...");
	});

	killDuplicatesBtn.addEventListener("click", () => {
		killDuplicateTabs();
	});

	taskManagerBtn.addEventListener("click", () => {
		// Open help page with Task Manager instructions
		chrome.tabs.create({
			url: chrome.runtime.getURL("task-manager-help.html"),
		});
		showNotification("⚙️ Opening Task Manager help...");
	});

	closeTabListBtn.addEventListener("click", () => {
		tabListSection.style.display = "none";
	});

	// Initial load
	updateDisplay();

	// Update every 5 seconds
	setInterval(updateDisplay, 5000);
});
