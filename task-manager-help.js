// Script for task manager help page
document.getElementById("closeTabButton").addEventListener("click", () => {
	chrome.tabs.getCurrent((tab) => {
		if (tab) {
			chrome.tabs.remove(tab.id);
		}
	});
});
