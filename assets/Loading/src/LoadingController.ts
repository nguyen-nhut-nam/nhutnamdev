import AlertDialog from "../../scripts/common/AlertDialog";
import Configs from "../../scripts/common/Configs";
import VersionConfig from "../../scripts/common/VersionConfig";
import SubpackageDownloader from "../../scripts/common/SubpackageDownloader";
import BundleControl from "../../scripts/common/BundleControl";
import Utils from "../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingController extends cc.Component {

    @property(cc.Label)
    lblStatus: cc.Label = null;
    @property(cc.Label)
    lblRange: cc.Label = null;
    @property(AlertDialog)
    alertDialog: AlertDialog = null;
    @property(cc.ProgressBar)
    progressBar = null;

    _storagePath: string = "";
    _am: any;
    _updating: boolean = false;
    _failCount = 0;
    private sprProgressBar: cc.Sprite = null;

    getCusomManifestStr() {
        let t = Date.now();
        return JSON.stringify({
            "packageUrl": Configs.App.HOT_UPDATE_URL,
            "remoteManifestUrl": Configs.App.HOT_UPDATE_URL + "project.manifest?t=" + t,
            "remoteVersionUrl": Configs.App.HOT_UPDATE_URL + "version.manifest?t=" + t,
            "version": "1.0.0"
        });
    }

    start() {

        //console.log("this is my test");
        //return;
        this.progressBar.progress = 0;
        this.lblStatus.string = "";
        this.lblRange.string="0%";
        //this.alreadyUpToDate();

        if (CC_JSB && !CC_DEBUG) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote_assets';
            if (jsb.fileUtils.isFileExist(this._storagePath + "/project.manifest")) {
                // console.log("project.manifest existed");
                cc.loader.load(this._storagePath + "/project.manifest", (err, json) => {
                    json = JSON.parse(json);
                    // console.log("json old: " + JSON.stringify(json, null, "\t"));
                    var t = Date.now();
                    if (json.hasOwnProperty("remoteVersionUrl")) {
                        var rvu = json['remoteVersionUrl'].split("?t=");
                        json['remoteVersionUrl'] = rvu[0] + "?t=" + t;
                    }
                    if (json.hasOwnProperty("remoteManifestUrl")) {
                        var rmu = json['remoteManifestUrl'].split("?t=");
                        json['remoteManifestUrl'] = rmu[0] + "?t=" + t;
                    }
                    let saved = jsb.fileUtils.writeStringToFile(JSON.stringify(json, null, "\t"), this._storagePath + "/project.manifest");
                    // console.log("json new saved: " + saved);
                    // console.log("json new: " + JSON.stringify(json, null, "\t"));
                    this.initAssetManager();
                    this.checkUpdate();
                });
            } else {
                this.initAssetManager();
                this.checkUpdate();
            }
        } else {
            console.log("go directly to sence...");
            this.alreadyUpToDate();
        }
    }

    initAssetManager() {
        console.log('Storage path for remote asset : ' + this._storagePath);

        this.lblStatus.string = "Đang kiểm tra phiên bản mới...";
        this.progressBar.progress = 0;
        this.lblRange.string="0%";
        var versionCompareHandle = (versionA: any, versionB: any) => {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        this._am = new jsb.AssetsManager('', this._storagePath, versionCompareHandle);
        if(cc.sys.os === cc.sys.OS_IOS) {
            this._am.setMaxConcurrentTask(6);
        }
    }

    checkUpdate() {
        if (this._updating) {
            return;
        }
        this._failCount = 0;

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(this.getCusomManifestStr(), this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
        }

        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        console.log("Start check update local: " + this._am.getLocalManifest().getVersionFileUrl());
        console.log("Start check update remote: " + this._am.getRemoteManifest().getVersionFileUrl());
        this._updating = true;
    }

    checkCb(event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                this.lblStatus.string = "No local manifest file found, hot update skipped.";
                this.lblRange.string="0%";
                //this.alertDialog.showMsg("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                this.lblStatus.string = "Fail to download manifest file, hot update skipped.";
                this.alreadyUpToDate();
                // this.alertDialog.show4("Fail to download manifest file, hot update skipped.", "Tiếp tục", () => {
                //     _this.alreadyUpToDate();
                // });
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("CheckCB Already up to date with the latest remote version.");
                this.lblStatus.string = "Already up to date with the latest remote version.";
                this.alreadyUpToDate();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log("New version found, please try to update.");
                this.lblStatus.string = "New version found, please try to update.";
                this.progressBar.progress = 0;
                this.lblRange.string="0%";
                break;
            default:
                return;
        }
        if(event.getEventCode() === jsb.EventAssetsManager.NEW_VERSION_FOUND) {
            this._am.setEventCallback(null);
            this._updating = false;
            this.startUpdate();
        } else {
            this._am.setEventCallback(null);
            this._updating = false;
        }
    }

    startUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var manifest = new jsb.Manifest(this.getCusomManifestStr(), this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
            }

            this._am.update();
            this._updating = true;
        }
    }

    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                this.lblStatus.string = "No local manifest file found, hot update skipped.";
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                console.log("files: " + event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                console.log("bytes: " + event.getTotalBytes() + ' / ' + event.getDownloadedBytes());
                console.log("event.getPercent(): " + event.getPercent());
                this.lblStatus.node.active = true;
                this.progressBar.progress = event.getPercent();
                this.lblRange.string=Math.round(event.getPercent() * 100) + "%";
                this.lblStatus.string = "Đang tải dữ liệu..." + Math.round(event.getDownloadedFiles() / event.getTotalFiles() * 100) + "%";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                this.lblStatus.string = "Fail to download manifest file, hot update skipped.";
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("update CB Already up to date with the latest remote version.");
                this.lblStatus.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log("Update finished. " + event.getMessage());
                needRestart = true;

                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());
                if (this._failCount < 5) {
                    cc.sys.localStorage.setItem("HotUpdated", "false");
                    this._am.downloadFailedAssets();
                } else {
                    this._updating = false;
                    failed = true;
                }
                this._failCount++;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.alertDialog.showMsg('Decompress error: ' + event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
            this.alertDialog.show4("Tải xuống không thành công, vui lòng thử lại sau.", "Thử lại", () => {
                cc.game.restart();
            });
        }

        if (needRestart && !failed) {
            this._am.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths: Array<string> = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log("manifest paths: " + JSON.stringify(newPaths));
            for (var i = 0; i < newPaths.length; i++) {
                if (searchPaths.indexOf(newPaths[i]) == -1) {
                    searchPaths.push(newPaths[i]);
                }
            }
            // Array.prototype.unshift.apply(searchPaths, newPaths);
            console.log("new paths: " + JSON.stringify(newPaths));

            cc.sys.localStorage.setItem("HotUpdated", "true");
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.game.restart();

        }
    }

    alreadyUpToDate() {
        this.lblStatus.string = cc.sys.isNative ? "Đang chuẩn bị tài nguyên (Không tốn dữ liệu)...0%" : "Đang tải...0%";
        this.loadSceneGame();
        // SubpackageDownloader.downloadSubpackage("Lobby", (err, progress) => {
        //     cc.director.preloadScene("Lobby", (c, t, i) => {
        //         this.progressBar.progress = (Math.round((c / t) * 100)) / 100;
        //         this.lblRange.string = (Math.round((c / t) * 100)) + "%";
        //     }, () => {
        //         cc.director.loadScene("Lobby");
        //     });
        // })
    }

    apiRequestConfig(url, onSuccess, onFail) {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    try {
                        if(onSuccess) {
                            onSuccess(JSON.parse(response));
                        }
                    } catch(e) {
                        cc.log("API Error: ", xhr);
                        if(onFail) {
                            onFail();
                        }
                    }
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }

    loadBundleLobby() {
        let self = this;
        let progress = 0;
        return BundleControl.loadBundle('Lobby').then((bundle) => {
            // @ts-ignore
            window.lobbyBundle = bundle;
            return new Promise((resolve, reject) => {
                bundle.loadDir('', function(finish, total) {
                    let tempProgress = (100 * finish / total);
                    if(tempProgress > progress) {
                        progress = tempProgress;
                    }
                    self.updateProgress(progress);
                }, function(err, assets) {
                    if(!err) {
                        resolve(assets);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    updateProgress(progress) {
        let percent = parseFloat(progress);
        this.progressBar.progress = percent / 100;
        this.lblRange.string = `${Math.floor(percent)}%`;
    }

    hotUpdateLobby() {
        this.loadBundleLobby().then((assets) => {
            if(assets) {
                cc.director.loadScene("Lobby");
            }
        });
    }

    loadSceneGame() {
        let self = this;
        let progress = 0;

        self.progressBar.progress = progress / 100;
        self.lblRange.string = `0%`;

        this.initDomainConfig();
    }

    initDomainConfig() {
        let configBundle = `https://${Configs.App.BUNDLE_URL}/remote/setting.json?v=${Date.now()}`;
        if(cc.sys.isNative) {
            this.apiRequestConfig(configBundle, function(data) {
                if(data !== null) {
                    Configs.App.BUNDLE_CONFIG = data;
                    this.hotUpdateLobby();
                }
            }.bind(this), null);
        } else {
            this.hotUpdateLobby();
        }

        let DOMAIN_GAME_PROD = "bon.tips";
        let DOMAIN_GAME_DEV = "bon.tips";
        let MINIGAME_CONTEXT = "minigame";
        let SLOT_CONTEXT = "slotmachine";
        let TLMN_CONTEXT = "tienlenmiennam";
        let SHOOT_FISH_CONTEXT = "banca";
        let SAM_CONTEXT = "sam";
        let XOCDIA_CONTEXT = "xocdia";
        let BACAY_CONTEXT = "bacay";
        let BAICAO_CONTEXT = "baicao";
        let POKER_CONTEXT = "poker";
        let BINH_CONTEXT = "binh";
        let TAIXIU_CONTEXT = "taixiu";
        let TAIXIUMD5_CONTEXT = "taixiumd5";
        let BAUCUA_CONTEXT = "baucua";
        cc.sys.localStorage.setItem("DOMAIN_GAME_PROD", DOMAIN_GAME_PROD);
        cc.sys.localStorage.setItem("DOMAIN_GAME_DEV", DOMAIN_GAME_DEV);
        cc.sys.localStorage.setItem("MINIGAME_CONTEXT", MINIGAME_CONTEXT);
        cc.sys.localStorage.setItem("TAIXIU_CONTEXT", TAIXIU_CONTEXT);
        cc.sys.localStorage.setItem("SLOT_CONTEXT", SLOT_CONTEXT);
        cc.sys.localStorage.setItem("TLMN_CONTEXT", TLMN_CONTEXT);
        cc.sys.localStorage.setItem("SHOOT_FISH_CONTEXT", SHOOT_FISH_CONTEXT);
        cc.sys.localStorage.setItem("SAM_CONTEXT", SAM_CONTEXT);
        cc.sys.localStorage.setItem("XOCDIA_CONTEXT", XOCDIA_CONTEXT);
        cc.sys.localStorage.setItem("BACAY_CONTEXT", BACAY_CONTEXT);
        cc.sys.localStorage.setItem("BAICAO_CONTEXT", BAICAO_CONTEXT);
        cc.sys.localStorage.setItem("POKER_CONTEXT", POKER_CONTEXT);
        cc.sys.localStorage.setItem("BINH_CONTEXT", BINH_CONTEXT);
        cc.sys.localStorage.setItem("TAIXIUMD5_CONTEXT", TAIXIUMD5_CONTEXT);
        cc.sys.localStorage.setItem("BAUCUA_CONTEXT", BAUCUA_CONTEXT);
        Configs.App.init();
    }
}