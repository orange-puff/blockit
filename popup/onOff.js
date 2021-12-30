const onColor = "#63c056";
const offColor = "#E5F2F2";

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

export function updateOnOffButton(button) {
    let onButton = document.getElementById("on");
    let offButton = document.getElementById("off");

    switch (button.toLowerCase()) {
        case "on":
            onButton.style.background = onColor;
            offButton.style.background = offColor;
            break;
        case "off":
            onButton.style.background = offColor;
            offButton.style.background = onColor;
            break;
    }
}