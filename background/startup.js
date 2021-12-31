import { selectOnOffButton } from "../popup/onOff.js";

// if there is no storage for onOff, set it
browser.storage.local.get("onOff")
    .then((result) => {
        console.log(result);
        if (Object.entries(result).length === 0) {
            selectOnOffButton("on");
        }
    });
