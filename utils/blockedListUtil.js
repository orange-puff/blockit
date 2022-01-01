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
    let cleanedUrl = tryCleanUrl(blockedListItem);
    if (cleanedUrl === null) {
        return;
    }

    browser.storage.local.get("blockedList")
        .then((result) => {
            let blockedListMeta = result;
            if (Object.entries(result).length === 0) {
                blockedListMeta = createBlockedList();
            }
            
            if (blockedListMeta.blockedList.value.indexOf(cleanedUrl) === -1) {
                blockedListMeta.blockedList.value.push(cleanedUrl);
                browser.storage.local.set(blockedListMeta);
            }
            console.log(blockedListMeta.blockedList.value);
        });
}