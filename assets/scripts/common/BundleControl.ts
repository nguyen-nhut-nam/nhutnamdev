import Configs from "./Configs";
import App from "./App";

export default class BundleControl {

    static async loadPrefabLobby(prefabName) {
        return new Promise<any>((resolve, _reject) => {
            App.instance.lobbyBundle.load(prefabName, cc.Prefab, function (finish, total, item) {
            }, function (err, prefab) {
                if (!err) {
                    let node = cc.instantiate(prefab);
                    resolve(node)
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async loadScene(bundleName, sceneName) {
        // @ts-ignore
        let _selectedGameNode = cc._selectedGameNode;
        let loadingNode = null;
        let loadingBgNode = null;
        if(_selectedGameNode) {
            loadingNode = _selectedGameNode.getChildByName("load");
            loadingBgNode = _selectedGameNode.getChildByName('load_bg');
            loadingNode.active = true;
            loadingBgNode.active = true;
            loadingNode.getComponent(cc.ProgressBar).progress = 0;
            if(_selectedGameNode.getComponent(cc.Button)) {
                _selectedGameNode.getComponent(cc.Button).interactable = false;
            }
        }
        let bundle = await this.loadBundle(bundleName);
        let percent = 0;
        return new Promise<any>((resolve, reject) => {
            bundle.loadScene(sceneName, function(finish, total, item) {
                let tempPercent = Math.round(finish / total * 100);
                if(percent < tempPercent) {
                    percent = tempPercent;
                }

                if(loadingNode) {
                    loadingNode.active = true;
                    loadingNode.getChildByName('label').getComponent(cc.Label).string = `${Math.round(percent)}%`;
                    loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                }
            }, function(err, scene) {
                if(!err) {
                    resolve(scene);
                } else {
                    resolve(null);
                }

                if(_selectedGameNode && _selectedGameNode.getComponent(cc.Button))
                    _selectedGameNode.getComponent(cc.Button).interactable = true;
                if(_selectedGameNode) {
                    // @ts-ignore
                    cc._selectedGameNode = null;
                }
                if(loadingNode) {
                    loadingNode.active = false;
                    loadingBgNode.active = false;
                }
            });
        });
    }

    static async loadPrefab(bundleName, prefabName) {
        // @ts-ignore
        let _selectedGameNode = cc._selectedGameNode;
        let loadingNode = null;
        let loadingBgNode = null;
        if (_selectedGameNode) {
            loadingNode = _selectedGameNode.getChildByName("load");
            loadingBgNode = _selectedGameNode.getChildByName('load_bg');
            loadingNode.active = true;
            loadingBgNode.active = true;
            loadingNode.getComponent(cc.ProgressBar).progress = 0;
            _selectedGameNode.getComponent('ColorChild').Darken = 0.3;
            if (_selectedGameNode.getComponent(cc.Button))
                _selectedGameNode.getComponent(cc.Button).interactable = false;
        }
        let bundle = await this.loadBundle(bundleName);
        let percent = 0;
        return new Promise<any>((resolve, _reject) => {
            bundle.load(prefabName, cc.Prefab, function (finish, total, item) {
                let tempPercent = Math.round(finish / total * 100);
                if(tempPercent != 1) {
                    tempPercent = Math.round( finish / total * 100);
                }
                if(percent < tempPercent) {
                    percent = tempPercent;
                }
                if (loadingNode) {
                    loadingNode.active = true;
                    loadingBgNode.active = true;
                    loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                    loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                }
            }, function (err, prefab) {
                if (!err) {
                    let node = cc.instantiate(prefab);
                    resolve(node)
                } else {
                    resolve(null);
                }
                if (_selectedGameNode && _selectedGameNode.getComponent(cc.Button))
                    _selectedGameNode.getComponent(cc.Button).interactable = true;
                if (_selectedGameNode && _selectedGameNode.getComponent('ColorChild')) {
                    _selectedGameNode.getComponent('ColorChild').Darken = 1;
                }
                // @ts-ignore
                cc._selectedGameNode = null;
                if (loadingNode) {
                    loadingNode.active = false;
                    loadingBgNode.active = false;
                }
            });
        });
    }

    static async loadBundle(bundleName) {
        let url = bundleName;
        if (CC_PREVIEW || !cc.sys.isNative) {
            return new Promise<any>((resolve, reject) => {
                cc.assetManager.loadBundle(url, (err, bundle) => {
                    if (err) {
                        cc.log("Error Donwload bundle:" + JSON.stringify(err));
                        resolve(null);
                    } else {
                        resolve(bundle);
                    }
                });
            });
        } else {
            let bundleVersion = Configs.App.BUNDLE_CONFIG.bundleVers[bundleName];
            url = `https://${Configs.App.BUNDLE_URL}/remote/${bundleName}`;
            return new Promise<any>((resolve, reject) => {
                cc.assetManager.loadBundle(url, {version: bundleVersion}, (err, bundle) => {
                    if (err) {
                        cc.log("Error Donwload bundle:" + JSON.stringify(err));
                        resolve(null);
                    } else {
                        resolve(bundle);
                    }
                });
            });
        }
    }

    static releaseBundle(bundleUrl: string): any {
        let bundle = cc.assetManager.getBundle(bundleUrl);
        if (bundle)
            bundle.releaseAll();
    }
}