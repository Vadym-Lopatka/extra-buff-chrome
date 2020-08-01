const bufferName = 'my-buff'
chrome.commands.onCommand.addListener(function (cmd) {
    if (cmd == "Ctrl+C") {
        addToBuffer()
    } else if (cmd == "Ctrl+Shift+V") {
        getBuffer(function (value) {
            console.log("Buffer: " + value['my-buff'])
        })
    }
});

/*GET PART====================================================================*/
function getBuffer(callback) {
    chrome.storage.sync.get('my-buff', callback);
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
        chrome.storage.sync.set({'my-buff': theValue}, function () {
                console.log('Value is set to: ' + theValue);
            }
        );
    }
}
