(function () {
    const onColor = "#63c056";
    const offColor = "#E5F2F2";
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Given a URL to a beast image, remove all existing beasts, then
     * create and style an IMG node pointing to
     * that image, then insert the node into the document.
     */
    function insertBeast(beastURL) {
        removeExistingBeasts();
        let beastImage = document.createElement("img");
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }

    /**
     * Remove every beast from the page.
     */
    function removeExistingBeasts() {
        let existingBeasts = document.querySelectorAll(".beastify-image");
        for (let beast of existingBeasts) {
            beast.remove();
        }
    }

    function updateOnOff() {
        let buttons = document.querySelectorAll(".onOff");
        for (let button of buttons) {
            button.style.background = onColor;
        }
        let onButton = document.getElementById("on");
        let offButton = document.getElementById("off");
        if (true) {
            onButton.style.background = onColor;
            offButton.style.background = offColor;
        }
        else {
            onButton.style.background = offColor;
            offButton.style.background = onColor;
        }
    }

    /**
     * Listen for messages from the background script.
     * Call "insertBeast()" or "removeExistingBeasts()".
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "beastify") {
            insertBeast(message.beastURL);
        } else if (message.command === "reset") {
            removeExistingBeasts();
        } else if (message.command === "onOff") {
            updateOnOff();
        }
    });



})();
