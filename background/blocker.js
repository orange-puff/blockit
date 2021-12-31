/**
 * CSS to hide everything on the page,
 */
 const hidePage = `body {
    display: none;
  }`;

/**
 * When a tab is loaded, check if the plugin is on. If the plugin is on, check if the url matches the page.
 * If it does, block it
 */
browser.tabs.onUpdated.addListener(function (activeInfo) {
    browser.storage.local.get("onOff")
        .then((result) => {
            if (Object.entries(result).length === 0 || !result.onOff.value) {
                return;
            }
            browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
                let tab = JSON.stringify(tabs[0]);
                let blockedSite = false;
                ["linkedin", "twitter", "youtube"].forEach(site => {
                    blockedSite |= tab.includes(site);
                })
                if (blockedSite) {
                    browser.tabs.insertCSS({code: hidePage});
                }
            }, console.error)
        });
});
