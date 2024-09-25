var path = require('path');
var fs = require('fs');
const { stringify } = require('querystring');

function insertText(text, findText, insertText) {
    let index = text.lastIndexOf(findText);
    if (index > -1) {
        let position = index + findText.length;
        let firstText = text.slice(0, position);
        let endText = text.slice(position, text.length);
        return firstText + insertText + endText;
    }
    return text;
}

function onBeforeBuildFinish(options, callback) {
    callback();
}
function onBuildFinish(options, callback) {

    var myJSON = JSON.stringify(options.settings);

    if (options.actualPlatform.indexOf("web") > -1) {
    }
    else {
        if (options.settings) {
            Editor.log("start write file setting")
            fs.writeFile(options.dest + '/remote/setting.json', myJSON, function (err, _data) {
                Editor.log("writeFile  err:" + err);
            }.bind(this));
        }
    }

    callback();
}
module.exports = {
    load() {
        Editor.log("start build")
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
        Editor.Builder.on('build-finished', onBuildFinish);
    },

    unload() {
        Editor.log("unload plugin")
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
        Editor.Builder.removeListener('build-finished', onBuildFinish);
    }
};