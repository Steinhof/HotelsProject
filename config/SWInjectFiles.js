var fs = require('fs');
var glob = require('glob');
var SWInjectFiles = /** @class */ (function () {
    function SWInjectFiles(swFile, options) {
        this.SEARCH_BEACON_VERSION = /.BEACON-VERSION./gi;
        this.SEARCH_BEACON_STATIC = /.BEACON-STATIC./gi;
        this.SEARCH_BEACON_MUTABLE = /.BEACON-MUTABLE./gi;
        this.swFile = swFile; // Initialize Service worker file
        this.options = options;
        this.readSWFile();
    }
    SWInjectFiles.prototype.readSWFile = function () {
        var readFile = fs.readFileSync(this.swFile);
        this.rawSWFile = readFile.toString();
    };
    SWInjectFiles.prototype.getDirFiles = function (dir) {
        var _this = this;
        var globsArr = Array.isArray(dir) ? dir : [dir];
        var fileNames = ['/'];
        globsArr.forEach(function (item) {
            fileNames.push.apply(fileNames, glob.sync(item, {
                nodir: true
            }));
        });
        if (this.options.ignorePath) {
            fileNames = fileNames
                .map(function (item) {
                return item.replace(new RegExp(_this.options.ignorePath, 'gi'), '');
            })
                .filter(function (el) { return el !== null; });
        }
        else if (this.options.publicPath) {
            fileNames = fileNames
                .map(function (item) { return item.match(/[\w\d-_.]+\.\w+$/gi); })
                .reduce(function (acc, val) { return acc.concat(val); }, [])
                .filter(function (el) { return el !== null; });
        }
        this.dirFiles = fileNames.map(function (item) { return "'" + (_this.options.publicPath || '') + item + "'"; });
    };
    SWInjectFiles.prototype.writeStaticFiles = function (filesDir) {
        this.getDirFiles(filesDir);
        var files = this.dirFiles;
        var replaceBeacon = this.rawSWFile.replace(this.SEARCH_BEACON_STATIC, files);
        var newFileVersion = replaceBeacon.replace(this.SEARCH_BEACON_VERSION, "'" + Math.random() + "'");
        fs.writeFileSync(this.swFile, newFileVersion);
        console.log('Injection of static files complete');
    };
    SWInjectFiles.prototype.writeMutableFiles = function (filesDir) {
        this.getDirFiles(filesDir);
        var files = this.dirFiles;
        var replaceBeacon = this.rawSWFile.replace(this.SEARCH_BEACON_MUTABLE, files);
        var newFileVersion = replaceBeacon.replace(this.SEARCH_BEACON_VERSION, "'" + Math.random() + "'");
        fs.writeFileSync(this.swFile, newFileVersion);
        console.log('Injection of mutable files complete');
    };
    return SWInjectFiles;
}());
module.exports = SWInjectFiles;
