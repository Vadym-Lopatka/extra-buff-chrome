chrome.commands.onCommand.addListener(function (cmd) {
    if (cmd == "Ctrl+C") {
        addToBuffer()
    } else if (cmd == "Ctrl+Shift+V") {
        showBuffer()
    } else if (cmd == "Ctrl+Shift+Q") {
        clearBuffer()
    }
});

function showBuffer() {
    chrome.storage.sync.get({list: []}, function (data) {
        console.log(data.list);
    });
}


function clearBuffer() {
    chrome.storage.sync.set({list: []}, function (data) {
        console.log("Clear extra-buff");
    });
}


/*ADD PART====================================================================*/
var funcToInject = function () {
    const selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

var jsCodeStr = ';(' + funcToInject + ')();';

function addToBuffer() {
    chrome.tabs.executeScript(
        {code: jsCodeStr, allFrames: true}, function (selectedTextPerFrame) {

            if (chrome.runtime.lastError) {
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            } else if (isSelectedTextValid(selectedTextPerFrame)) {
                addValueToBuff(selectedTextPerFrame[0])
            }
        }
    );

    function isSelectedTextValid(selectedTextPerFrame) {
        return (selectedTextPerFrame.length > 0) && (typeof (selectedTextPerFrame[0]) === 'string')
    }

    function addValueToBuff(theValue) {
        chrome.storage.sync.get({list: []}, function (data) {
            update(data.list, theValue);
        });
    }

    function update(array, newValue) {
        array.unshift(newValue);
        chrome.storage.sync.set({list: array}, function () {
            console.log("added to list with new values");
        });
    }
}
