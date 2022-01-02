const URL_REGEX = /^((http|https):\/\/)?(([\w-]+\.)+\w+)+/;
export const BLOCKED_LIST_ITEM_DELETE_BUTTON_ID = 'blockedListItemDeleteButton';
export const BLOCKED_LIST_ITEM_ID = 'blockedListItemEntity';

function createBlockedList() {
    return { blockedList: { value: [] } };
}

export function tryCleanUrl(rawUrl) {
    const match = rawUrl.match(URL_REGEX);
    if (match === null || match.length <= 3) {
        return null;
    }
    return match[3];
}

export function addBlockedListItem(blockedListItem) {
    const cleanedUrl = tryCleanUrl(blockedListItem);
    if (cleanedUrl === null || cleanedUrl.length === 0) {
        return;
    }

    updateBlockedListItem((originalBlockedItemList) => {
        if (originalBlockedItemList.indexOf(cleanedUrl) === -1) {
            originalBlockedItemList.push(cleanedUrl);
        }
        
        // update the UI with this added blockedItem
        updateBlockedListUICore(originalBlockedItemList);

        return originalBlockedItemList;
    });

    browser.runtime.sendMessage({
        greeting: "Greeting from the content script"
      });
}

export function deleteBlockedListItem(blockedListItem) {
    const cleanedUrl = tryCleanUrl(blockedListItem);
    if (cleanedUrl === null || cleanedUrl.length === 0) {
        return;
    }

    updateBlockedListItem((originalBlockedItemList) => {
        const ind = originalBlockedItemList.indexOf(cleanedUrl);
        if (ind > -1) {
            originalBlockedItemList.splice(ind, 1);
        }

        // update the UI with this deleted blockedItem
        updateBlockedListUICore(originalBlockedItemList);

        return originalBlockedItemList;
    });
}

function updateBlockedListItem(blockedListItemFilter) {
    browser.storage.local.get("blockedList")
        .then((result) => {
            let blockedListMeta = result;
            if (Object.entries(result).length === 0) {
                blockedListMeta = createBlockedList();
            }

            blockedListMeta.blockedList.value = blockedListItemFilter(blockedListMeta.blockedList.value);
            browser.storage.local.set(blockedListMeta);
        });
}

export function updateBlockedListUI() {
    browser.storage.local.get("blockedList")
    .then(result => {
        if (Object.entries(result).length === 0 || result.blockedList.value.length === 0) {
            return;
        }
        updateBlockedListUICore(result.blockedList.value);
    });
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