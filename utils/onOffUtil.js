const onColor = "#63c056";
const offColor = "#E5F2F2";

function createOnOff(on) {
    return { onOff: { value: on } };
}

// change onOff button state
export function selectOnOffButton(button) {
    let newVal = false;
    switch (button.toLowerCase()) {
        case "on":
            newVal = true;
            break;
        case "off":
            break;
    }
    // send a message to the `blocker` background script that the on/off button has just been pressed
    browser.runtime.sendMessage({
        messageName: "onOff",
        on: newVal
      });

    // set state
    browser.storage.local.set(createOnOff(newVal));
}

// change onOff button color
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