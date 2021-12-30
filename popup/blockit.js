import { selectOnOffButton, updateOnOffButton } from "./onOff.js";


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

        /**
        * Remove the page-hiding CSS from the active tab,
        * send a "reset" message to the content script in the active tab.
        
        function reset(tabs) {
            browser.tabs.removeCSS({ code: hidePage }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset",
                });
            });
        }*/

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not blockit; ${error}`);
        }

        /**
        * Get the active tab,
        * then call "beastify()" or "reset()" as appropriate.
        */
        if (e.target.classList.contains("onOff")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(setOnOff)
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

function onStartUp() {
    browser.storage.local.get("onOff")
        .then((result) => {
            updateOnOffButton(result.onOff.value ? "on" : "off");
        });
}

onStartUp();
listenForClicks();