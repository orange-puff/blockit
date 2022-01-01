const URL_REGEX = /^((http|https):\/\/)?(([\w-]+\.)+\w+)+/;

function tryConvertUrl(rawUrl) {
    const match = rawUrl.match(URL_REGEX);
    if (match === null || match.length <= 3) {
        return null;
    }
    return match[3];
}

export function addBlockedListItem(blockedListItem) {
    let cleanedUrl = tryConvertUrl(blockedListItem);
    if (cleanUrl === null) {
        return;
    }
}