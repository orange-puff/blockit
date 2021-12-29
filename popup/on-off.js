function createOnOff(on) {
    return { onOff: { value: on } };
}

export function selectOnOffButton(button) {
    switch (button.toLowerCase()) {
        case "on":
            browser.storage.local.set(createOnOff(true));
            break;
        case "off":
            browser.storage.local.set(createOnOff(false));
            break;
    }
}

export function getOnOff(handleOnOff) {
    browser.storage.local.get("onOff", (result) => handleOnOff(result.onOff.value));
    //var on = (await Promise.resolve(browser.storage.local.get("onOff"))).onOff.value;
}