const URL_REGEX = /^((http|https):\/\/)?(([\w-]+\.)+\w+)+/;

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
    if (cleanedUrl === null) {
        return;
    }

    updateBlockedListItem((originalBlockedItemList) => {
        if (originalBlockedItemList.indexOf(cleanedUrl) === -1) {
            originalBlockedItemList.push(cleanedUrl);
        }
        return originalBlockedItemList;
    });
}

export function deleteBlockedListItem(blockedListItem) {
    const cleanedUrl = tryCleanUrl(blockedListItem);
    if (cleanedUrl === null) {
        return;
    }

    updateBlockedListItem((originalBlockedItemList) => {
        const ind = originalBlockedItemList.indexOf(cleanedUrl);
        if (ind > -1) {
            originalBlockedItemList.splice(ind, 1);
        }
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
            console.log(blockedListMeta.blockedList.value);
        });
}
