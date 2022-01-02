import { selectOnOffButton, updateOnOffButton } from '../utils/onOffUtil.js';
import { tryCleanUrl, addBlockedListItem, deleteBlockedListItem } from '../utils/blockedListUtil.js';

const BLOCKED_LIST_ITEM_DELETE_BUTTON_ID = 'blockedListItemDeleteButton';
const BLOCKED_LIST_ITEM_ID = 'blockedListItemEntity';
const BLOCKED_LIST_ITEM_DELETE_BUTTON_ID_REGEX = /^blockedListItemDeleteButton\d+$/;

// we need to filter out the newly added / deleted url
function updateBlockedListUI(added, url) {
    browser.storage.local.get("blockedList")
        .then((result) => {
            let blockedList = []
            if (Object.entries(result).length !== 0) {
                blockedList = result.blockedList.value;
            }

            const idx = blockedList.indexOf(url);
            if (added) {
                if (idx === -1) {
                    blockedList.push(url);
                }
            }
            else {
                if (idx > -1) {
                    blockedList.splice(idx, 1);
                }
            }

            updateBlockedListUICore(blockedList);
        })
}

// this creates the ui elements that make up the blockedList
function updateBlockedListUICore(blockedList) {
    const blockedListItemContainer = document.getElementById("blockedListItemContainer");
    while (blockedListItemContainer.hasChildNodes()) {
        blockedListItemContainer.removeChild(blockedListItemContainer.lastChild);
    }
    blockedList.forEach((url, idx) => {
        const blockedListItemEl = document.createElement("div");
        blockedListItemEl.className = "blockedListItem";
        const blockedListItemEntityEl = document.createElement("div");
        blockedListItemEntityEl.className = "blockedListItemEntity";
        blockedListItemEntityEl.id = BLOCKED_LIST_ITEM_ID + idx.toString();
        blockedListItemEntityEl.textContent = url;
        const blockedListItemDeleteButtonEl = document.createElement("div");
        blockedListItemDeleteButtonEl.className = "button";
        blockedListItemDeleteButtonEl.id = BLOCKED_LIST_ITEM_DELETE_BUTTON_ID + idx.toString();
        blockedListItemDeleteButtonEl.textContent = 'X';
        blockedListItemEl.appendChild(blockedListItemEntityEl);
        blockedListItemEl.appendChild(blockedListItemDeleteButtonEl);
        blockedListItemContainer.appendChild(blockedListItemEl);
    });
}

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {
        function setOnOff(tabs) {
            selectOnOffButton(e.target.textContent);
            updateOnOffButton(e.target.textContent);
        }

        function setBlockedListItem(tabs) {
            const input = document.getElementById("blockedListInput");
            addBlockedListItem(input.value);
            updateBlockedListUI(true, input.value);
        }

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not blockit; ${error}`);
        }

        /**
        * Get the active tab, then call method handler for whichever button they chose
        */
        if (e.target.classList.contains("onOff")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(setOnOff)
                .catch(reportError);
        }
        else if (e.target.classList.contains("blockedListInput")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(setBlockedListItem)
                .catch(reportError);
        }
        else if (e.target.id.match(BLOCKED_LIST_ITEM_DELETE_BUTTON_ID_REGEX)) {
            const deleteButtonNum = e.target.id.substr(BLOCKED_LIST_ITEM_DELETE_BUTTON_ID.length);
            const blockedListItem = document.getElementById(BLOCKED_LIST_ITEM_ID + deleteButtonNum);
            const blockedListItemName = blockedListItem.textContent;
            deleteBlockedListItem(blockedListItemName);
            updateBlockedListUI(false, blockedListItemName);
        }
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.log(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * Basic UI updating when they open the popup, like highlighting whether the plugin is off or on
 */
function onStartUp() {
    // set on/off color
    browser.storage.local.get("onOff")
        .then((result) => {
            updateOnOffButton(result.onOff.value ? "on" : "off");
        });

    // set current tab url to the one in the input
    browser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => {
            const tabUrl = tabs[0].url;
            const cleanedUrl = tryCleanUrl(tabUrl);
            if (cleanedUrl !== null) {
                let input = document.getElementById("blockedListInput");
                input.value = cleanedUrl;
            }
        }, console.error)

    // set current blockedItemList
    browser.storage.local.get("blockedList")
        .then((result) => {
            if (Object.entries(result).length === 0 || result.blockedList.value.length === 0) {
                return;
            }

            updateBlockedListUICore(result.blockedList.value);
        })
}

try {
    onStartUp();
    listenForClicks();
}
catch (err) {
    reportExecuteScriptError(err);
}