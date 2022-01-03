/**
 * CSS to hide everything on the page,
 */
const HIDE_PAGE = `body {
    display: none;
  }`;

function block(on, blockedList) {
    if (!on || blockedList.length === 0) {
        browser.tabs.removeCSS({ code: HIDE_PAGE });
        return;
    }

    browser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => {
            let tabUrl = tabs[0].url;
            let shouldBlock = false;
            blockedList.forEach(url => {
                shouldBlock |= tabUrl.includes(url);
            });

            if (shouldBlock) {
                browser.tabs.insertCSS({ code: HIDE_PAGE });
            }
            else {
                browser.tabs.removeCSS({ code: HIDE_PAGE });
            }
        }, console.error);
}

function getBlockedList(on) {
    browser.storage.local.get("blockedList")
        .then(blockedListMeta => {
            block(on, blockedListMeta.blockedList.value);
        });
}

function getOnOff(blockedList) {
    browser.storage.local.get("onOff")
        .then(onOffMeta => {
            block(onOffMeta.onOff.value, blockedList);
        });
}

function handleMessage(request, sender, sendResponse) {
    if (request.messageName === "onOff") {
        getBlockedList(request.on);
    }
    else if (request.messageName === "blockedList") {
        getOnOff(request.blockedList);
    }
    else {
        console.log("Unknown message!");
    }
}

/**
 * When a tab is updated, check if the plugin is on. If the plugin is on, check if the url matches the page.
 * If it does, block it
 */
 browser.tabs.onUpdated.addListener(function (activeInfo) {
    browser.storage.local.get("onOff")
        .then((onOffMeta) => {
            if (Object.entries(onOffMeta).length === 0) {
                return;
            }

            browser.storage.local.get("blockedList")
                .then((blockedListMeta) => {
                    if (Object.entries(blockedListMeta).length === 0) {
                        return;
                    }
                    block(onOffMeta.onOff.value, blockedListMeta.blockedList.value);
                });
        });
});

browser.runtime.onMessage.addListener(handleMessage);
