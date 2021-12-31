import { selectOnOffButton, updateOnOffButton } from "../utils/onOffUtil.js";

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {
        function setOnOff(tabs) {
            selectOnOffButton(e.target.textContent);
            updateOnOffButton(e.target.textContent);
        }

        function addBlockedListItem(tabs) {
            
        }

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not blockit; ${error}`);
        }

        /**
        * Get the active tab, then call method handler for whichever button they chose
        */
        if (e.target.classList.contains("onOff")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(setOnOff)
                .catch(reportError);
        }
        else if (e.target.classList.contains("blockedListInput")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(addBlockedListItem)
                .catch(reportError);
        }
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.log(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * Basic UI updating when they open the popup, like highlighting whether the plugin is off or on
 */
function onStartUp() {
    browser.storage.local.get("onOff")
        .then((result) => {
            updateOnOffButton(result.onOff.value ? "on" : "off");
        });
}

try {
    onStartUp();
    listenForClicks();
}
catch (err) {
    reportExecuteScriptError(err);
}