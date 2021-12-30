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
browser.tabs.onActivated.addListener(function (activeInfo) {
    browser.storage.local.get("onOff")
        .then((result) => {
            if (Object.entries(result).length === 0 || !result.onOff.value) {
                return;
            }
            browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
                let tab = tabs[0];
                console.log(tab.url);
                browser.tabs.insertCSS({code: hidePage})
                .then(() => console.log('good'));
            }, console.error)
        });
});
