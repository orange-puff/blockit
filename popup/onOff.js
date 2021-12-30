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

    const onColor = "#63c056";
    const offColor = "#E5F2F2";
    let onButton = document.getElementById("on");
    let offButton = document.getElementById("off");
    if (button.toLowerCase() === "on") {
        onButton.style.background = onColor;
        offButton.style.background = offColor;
    }
    else {
        onButton.style.background = offColor;
        offButton.style.background = onColor;
    }
}