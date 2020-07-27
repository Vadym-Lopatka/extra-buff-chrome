const countMe = info => {
    const selectedText = info.selectionText;
    const totalWords = selectedText.trim().split(' ');

    // Chrome
    new Notification("hello", {
        icon: 'icon.png',
        body: `Total words ${totalWords.length}\nTotal Characters: ${selectedText.length}`
    });
}

// Chrome
chrome.contextMenus.create({
    "title": "Word Count",
    "id": "count-me",
    "onclick": countMe,
    "contexts": ["all"]
}, function () {
    // Do what all you need here when created
    console.log("Context Menu 2 Created");
});


/* The function that finds and returns the selected text */
var funcToInject = function () {
    var selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
var jsCodeStr = ';(' + funcToInject + ')();';

chrome.commands.onCommand.addListener(function (cmd) {
    /* Inject the code into all frames of the active tab */
    chrome.tabs.executeScript({
        code: jsCodeStr,
        allFrames: true   //  <-- inject into all frames, as the selection
                          //      might be in an iframe, not the main page
    }, function (selectedTextPerFrame) {
        if (chrome.runtime.lastError) {
            /* Report any error */
            alert('ERROR:\n' + chrome.runtime.lastError.message);
        } else if ((selectedTextPerFrame.length > 0)
            && (typeof (selectedTextPerFrame[0]) === 'string')) {
            /* The results are as expected */
            alert('Selected text: ' + selectedTextPerFrame[0]);
        }
    });
});

/*chrome.commands.onCommand.addListener(function(command) {

    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function (tabs) {
        const myTabUrl = tabs[0].url;
        console.log('Command:', command + ': ' + myTabUrl);
    });

    //
    //
    // var selectedText = "before";
    //
    // chrome.tabs.executeScript( {
    //     code: "window.getSelection().toString();"
    // }, function(selection) {
    //     selectedText = selection[0];
    // });
    //
    // console.log('Command:', command + ': ' + selectedText);

});*/

