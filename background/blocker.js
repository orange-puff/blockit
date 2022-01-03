import { addBlockedListItem } from "../utils/blockedListUtil.js";

/**
 * CSS to hide everything on the page,
 */
const HIDE_PAGE = `body {
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
                browser.tabs.removeCSS({ code: HIDE_PAGE });
                return;
            }
            browser.tabs.query({ currentWindow: true, active: true })
                .then((tabs) => {
                    let tabUrl = tabs[0].url;
                    browser.storage.local.get("blockedList")
                        .then((blockedListMeta) => {
                            if (Object.entries(blockedListMeta).length === 0 ) {
                                return;
                            }
                            let shouldBlock = false;
                            blockedListMeta.blockedList.value.forEach(url => {
                                shouldBlock |= tabUrl.includes(url);
                            });
                            if (shouldBlock) {
                                browser.tabs.insertCSS({ code: HIDE_PAGE });
                            }
                        });

                }, console.error);
        });
});

function handleMessage(request, sender, sendResponse) {
    if (request.messageName === "onOff") {
        console.log('onOff!');
        console.log(request);
    }
    else if (request.messageName === "blockedList") {
        console.log('blockedList!');
        console.log(request);
    }
    else {
        console.log("Unknown message!");
    }
  }
  
  browser.runtime.onMessage.addListener(handleMessage);
