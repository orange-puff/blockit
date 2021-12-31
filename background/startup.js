import { selectOnOffButton } from "../utils/onOffUtil.js";

// if there is no storage for onOff, set it
browser.storage.local.get("onOff")
    .then((result) => {
        if (Object.entries(result).length === 0) {
            selectOnOffButton("on");
        }
    });
