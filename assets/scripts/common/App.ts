import AlertDialog from "../common/AlertDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import SubpackageDownloader from "./SubpackageDownloader";
import BroadcastReceiver from "./BroadcastReceiver";
import MiniGameNetworkClient from "../networks/MiniGameNetworkClient";
import Configs from "./Configs";
import SlotNetworkClient from '../networks/SlotNetworkClient';
import Http from './Http';
import TaiXiuNetWorkClient from '../networks/TaiXiuNetWorkClient';
import LoadingCirle from "./LoadingCirle";
import nodeUtils from "./NodeUtils";
import TaiXiuMD5NetWorkClient from "../networks/TaiXiuMD5NetWorkClient";
import InPacket from "../networks/Network.InPacket";
import MiniGame from "./MiniGame";
import ButtonMiniGame from "./ButtonMiniGame";
import cmd from "./Lobby.Cmd";
import TienLenNetworkClient from "../networks/TienLenNetworkClient";
import ShootFishNetworkClient from "../networks/ShootFishNetworkClient";
import BauCuaTo2NetworkClient from "../networks/BauCuaTo2NetworkClient";
import SPUtils from "./SPUtils";
import BundleControl from "./BundleControl";
import * as moment from "moment";
const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {

    static instance: App = null;

    @property
    designResolution: cc.Size = new cc.Size(1560, 720);

    @property(cc.Node)
    loading2: cc.Node = null;

    @property(AlertDialog)
    alertDialog: AlertDialog = null;

    @property(ConfirmDialog)
    confirmDialog: ConfirmDialog = null;

    @property(ConfirmDialog)
    confirmDialog2: ConfirmDialog = null;

    @property(cc.Node)
    thongBaoDialog: cc.Node = null;

    @property([cc.SpriteFrame])
    sprFrameAvatars: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();

    @property(cc.Node)
    buttonMiniGameNode: cc.Node = null;

    @property(cc.Node)
    public miniGame: cc.Node = null;
    @property(AlertDialog)
    popUpSercretCode : AlertDialog = null;
    @property({type: cc.Node})
    popupThongBao2: cc.Node = null;
    @property(cc.Node)
    nodeNoHuEffect: cc.Node = null;
    @property(cc.Node)
    nodeButtonMiniGames = null;

    public buttonMiniGame: ButtonMiniGame;

    private lastWitdh: number = 0;
    private lastHeight: number = 0;

    private timeOutLoading: any = null;
    private timeOutLoading2: any = null;
    private isFisrtNetworkConnected = false;

    private subpackageLoaded: Object = {};

    public taiXiuDouble: MiniGame = null;
    public taiXiuMD5: MiniGame = null;
    public miniPoker: MiniGame = null;
    public caoThap: MiniGame = null;
    private bauCua: MiniGame = null;
    public slot3x3: MiniGame = null;
    private oanTuTi: MiniGame = null;

    public onPoker = true;
    public onKimcuong = true;
    public onTrenduoi = true;
    public _selectGameNode = null;

    public isDownloadingGame = false;
    public lobbyBundle = null;
    public isMiniGameOpened = false;

    // LIFE-CYCLE CALLBACKS:
    nodeClickInAll : cc.Node = null;

    private _lastZIndex = 0;
    public originalMiniGamesButtonPosition = null;

    onLoad() {
        // console.log("App onLoad");
        if (App.instance != null) {
            this.node.destroy();
            return;
        }
        App.instance = this;
        App.instance.isDownloadingGame = false;
        this.originalMiniGamesButtonPosition = this.nodeButtonMiniGames.position;
        cc.game.addPersistRootNode(App.instance.node);
        cc.debug.setDisplayStats(false);
        cc.game.setFrameRate(60);
        if(cc.sys.isNative) {
            // @ts-ignore
            if(cc.Device) {
                // @ts-ignore
                cc.Device.setKeepScreenOn(true);
            } else { // @ts-ignore
                if(jsb.Device) {
                    // @ts-ignore
                    jsb.Device.setKeepScreenOn(true);
                }
            }
        }
        this.buttonMiniGame = this.buttonMiniGameNode.getComponent(ButtonMiniGame);
        this.nodeNoHuEffect.getChildByName("bgnohu").active = false;
        this.nodeNoHuEffect.getChildByName("noHuDecor").active = false;
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                // case cmd.Code.NOTIFY_NO_HU: {
                //     let res = new cmd.ResNotifyNoHu(data);
                //     console.log(res);
                //     // no hu
                //     if (res.type == 1) { // nổ hũ slot
                //         // handle no hu
                //         let gameName = 'Thần Tài';
                //         switch (res.gamename) {
                //             case 'SexyDance':
                //                 gameName = 'Sexy Dance';
                //                 break;
                //             case 'FastAndFurious':
                //                 gameName = 'Fast And Furious';
                //                 break;
                //             case 'Cowboy':
                //                 gameName = 'Cao Bồi Viễn Tây';
                //                 break;
                //             case 'LienMinh':
                //                 gameName = 'Liên Minh Huyền Thoại';
                //                 break;
                //             case 'LadyNight':
                //                 gameName = 'Lady Night';
                //                 break;
                //             case 'CANDY':
                //                 gameName = 'Whiskey';
                //                 break;
                //             case 'MINIPOKER':
                //                 gameName = 'MiniPoker';
                //                 break;
                //         }
                //         this.nodeNoHuEffect.getChildByName("bgnohu").position = cc.v2(234.777, 584.379);
                //         this.nodeNoHuEffect.getChildByName("bgnohu").active = true;
                //         this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("bg").active = true;
                //         this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("nohuAnimaiton").active = true;
                //         this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("hunohu").getChildByName("name").getComponent(cc.Label).string = res.username + " nổ hũ " + gameName;
                //         this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("hunohu").getChildByName("moneyno").getComponent(cc.Label).string = "$" + Utils.formatMoney(res.totalPrizes);
                //         this.scheduleOnce(() => {
                //             this.nodeNoHuEffect.getChildByName("bgnohu").runAction(cc.sequence(
                //                 cc.scaleTo(1, 1),
                //                 cc.delayTime(0),
                //                 cc.moveBy(10, cc.v2(234.777, 590)),
                //                 cc.callFunc(() => {
                //                     this.nodeNoHuEffect.getChildByName("bgnohu").active = false;
                //                     this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("bg").active = false;
                //                     this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("hunohu").getChildByName("name").getComponent(cc.Label).string = "";
                //                     this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("hunohu").getChildByName("moneyno").getComponent(cc.Label).string = "";
                //                     this.nodeNoHuEffect.getChildByName("bgnohu").getChildByName("nohuAnimaiton").active = false;
                //                 })
                //             ));
                //
                //         }, 5);
                //
                //     }
                //     break;
                // }
                case cmd.Code.LOGIN_OTHER_DEVICE:
                    let res = new cmd.ResLoginOtherDevice(data);
                    let errorMessage = res.text;
                    SPUtils.setUserName("");
                    SPUtils.setUserPass("");
                    MiniGameNetworkClient.getInstance().close();
                    TaiXiuNetWorkClient.getInstance().close();
                    TaiXiuMD5NetWorkClient.getInstance().close();
                    SlotNetworkClient.getInstance().close();
                    TienLenNetworkClient.getInstance().close();
                    ShootFishNetworkClient.getInstance().close();
                    BauCuaTo2NetworkClient.getInstance().close();
                    BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                    App.instance.alertDialog.show4(errorMessage, "", () => {
                        Configs.Login.clear();
                        if(cc.director.getScene().name != "Lobby") {
                            this.loadSceneFromBundle("Lobby",  {"src": "Lobby"}, () => {
                                this.scheduleOnce(() => {
                                    App.instance.buttonMiniGame.hidden();
                                }, .5);
                            });
                        }
                    });
                    break;
            }
        }, this);
    }

    start() {

    }

    showLoading(isShow: boolean, timeOut: number = 3) {
        // if(timeOut <= 0) {
        //     timeOut =3;
        // }
        // this.loadingLabel.string = "Đang tải...";
        // if (this.timeOutLoading != null){
        //     clearTimeout(this.timeOutLoading);
        //     this.loading.active = false;
        // };
        // if (isShow) {
        //     if (timeOut > 0) {
        //         this.timeOutLoading = setTimeout(() => {
        //             this.showLoading(false);
        //         }, timeOut * 1000);
        //     }
        //     this.loading.active = true;
        // } else {
        //     this.loading.active = false;
        // }
       // this.loadingIcon.stopAllActions();
      //  this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
        this.showLoading2(isShow);
    }

    showLoading2(isShow: boolean, timeOut: number = 10) {
        if (this.timeOutLoading2 != null) clearTimeout(this.timeOutLoading2);
        if (isShow) {
            if (timeOut > 0) {
                this.timeOutLoading2 = setTimeout(() => {
                    this.showLoading2(false);
                }, timeOut * 1000);
            }
            this.loading2.active = true;
        } else {
            this.loading2.active = false;
        }
    }

    showErrLoading(msg?: string) {
        this.showLoading2(true, -1);
        // this.loadingLabel.string = msg ? msg : "Mất kết nối, đang thử lại...";
    }

    showBaoTri(msg?: string) {
        this.showLoading(true, -1);
        // this.loadingLabel.string = msg ? msg : "Hệ thống đang bảo trì, vui lòng thử lại sau";
    }

    update(dt: number) {
        // this.updateSize();
    }

    updateSize() {
        var frameSize = cc.view.getFrameSize();
        if (this.lastWitdh !== frameSize.width || this.lastHeight !== frameSize.height) {

            this.lastWitdh = frameSize.width;
            this.lastHeight = frameSize.height;

            var newDesignSize = cc.Size.ZERO;
            if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
                newDesignSize = cc.size(this.designResolution.width, this.designResolution.width * (frameSize.height / frameSize.width));
            } else {
                newDesignSize = cc.size(this.designResolution.height * (frameSize.width / frameSize.height), this.designResolution.height);
            }
            // cc.log("update node size: " + newDesignSize);
            this.node.setContentSize(newDesignSize);
            this.node.setPosition(cc.v2(newDesignSize.width / 2, newDesignSize.height / 2));
        }
    }

    getAvatarSpriteFrame(avatar: string): cc.SpriteFrame {
        let avatarInt = parseInt(avatar);
        if (isNaN(avatarInt) || avatarInt < 0 || avatarInt >= this.sprFrameAvatars.length) {
            return this.sprFrameAvatars[0];
        }
        return this.sprFrameAvatars[avatarInt];
    }

    loadScene(sceneName: string, onLoaded: () => void = null) {
        cc.director.preloadScene(sceneName, (c, t, item) => {
            if(sceneName === "TienLen") {
                let loadingNode = null;
                let loadingNodeBg = null;
                if(App.instance._selectGameNode) {
                    loadingNode = App.instance._selectGameNode.getChildByName('load');
                    loadingNodeBg = App.instance._selectGameNode.getChildByName('load_bg');
                    loadingNode.active = true;
                    loadingNodeBg.active = true;
                    loadingNode.getComponent(cc.ProgressBar).progress = 0;
                    App.instance._selectGameNode.getComponent('ColorChild').setDarken(0.3);
                    if (App.instance._selectGameNode.getComponent(cc.Button))
                        App.instance._selectGameNode.getComponent(cc.Button).interactable = false;
                }

                let percent = 0;

                let tempPercent = Math.round( c / t * 100);
                if(percent < tempPercent) {
                    percent = tempPercent;
                }

                if(loadingNode) {
                    loadingNode.active = true;
                    loadingNodeBg.active = true;
                    loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                    loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                }
            } else {
                this.showErrLoading("Đang tải..." + parseInt("" + ((c / t) * 100)) + "%");
            }
        }, (err) => {
            this.showLoading(false);
            cc.director.loadScene(sceneName);
            if(onLoaded != null) {
                onLoaded();
            }
        });
    }
    showLoadingSun(isShow, rate? ){
        try {
            this.nodeClickInAll.getChildByName("loadingSun").getComponent(LoadingCirle).showLoadingSun(isShow,rate);
        } catch (error) {
        }
    }

    loadSceneFromBundle(sceneName, option, onLoaded = null) {
        if(App.instance.isDownloadingGame) {
            this.actShowThongBao('Game đang tải, vui lòng chờ!');
            return;
        }
        if(sceneName != "Lobby") {
            App.instance.isDownloadingGame = true;
        }
        if(option && (option.src !== undefined) && (option.src !== null)) {
            BundleControl.loadScene(option.src, sceneName).then(scene => {
                if(onLoaded != null) {
                    onLoaded();
                }
                App.instance.isDownloadingGame = false;
                cc.director.runScene(scene);
            });
        }
    }

    loadPrefabFromBundle(prefabName, option, onLoaded = null) {
        if(App.instance.isDownloadingGame) {
            this.actShowThongBao('Game đang tải, vui lòng chờ!');
            return;
        }
        App.instance.isDownloadingGame = true;
        if(option && (option.src !== undefined) && (option.src !== null)) {
            BundleControl.loadPrefab(option.src, prefabName).then(prefab => {
                App.instance.isDownloadingGame = false;
                if(prefab == null) {
                    console.log("error");
                    return;
                }

                if(onLoaded != null) {
                    onLoaded(prefab);
                }
            });
        }
    }


    loadSceneInSubpackage(subpackageName: string, sceneName: string) {
        if(App.instance.isDownloadingGame) {
            this.actShowThongBao('Game đang tải, vui lòng chờ!');
            return;
        }
        App.instance.isDownloadingGame = true;
        let loadingNode = null;
        let loadingNodeBg = null;
        if(App.instance._selectGameNode) {
            loadingNode = App.instance._selectGameNode.getChildByName('load');
            loadingNodeBg = App.instance._selectGameNode.getChildByName('load_bg');
            loadingNode.active = true;
            loadingNodeBg.active = true;
            loadingNode.getComponent(cc.ProgressBar).progress = 0;
            if (App.instance._selectGameNode.getComponent(cc.Button))
                App.instance._selectGameNode.getComponent(cc.Button).interactable = false;
        }

        let percent = 0;
        if (!this.subpackageLoaded.hasOwnProperty(subpackageName) || !this.subpackageLoaded[subpackageName]) {
            //   this.showLoading(true, -1);
            // this.showLoadingSun(true,-1);
            SubpackageDownloader.downloadSubpackage(subpackageName, (err, progress) => {
                if (err == "progress") {
                    this.showLoadingSun( true,progress);
                    return;
                }
                //  this.showLoading(false);
                this.showLoadingSun(false,0);
                if (err) {
                    this.alertDialog.showMsg(err);
                    return;
                }
                //    this.showLoading(true, -1);
                // this.showLoadingSun(true,-1);
                this.subpackageLoaded[subpackageName] = true;
                cc.director.preloadScene(sceneName, (c, t, item) => {
                    // this.showLoadingSun(true,(c / t));

                    let tempPercent = Math.round( c / t * 100);
                    if(percent < tempPercent) {
                        percent = tempPercent;
                    }

                    if(loadingNode) {
                        loadingNode.active = true;
                        loadingNodeBg.active = true;
                        loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                        loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                    }
                    // this.showErrLoading("Đang tải..." + parseInt("" + ((c / t) * 100)) + "%");
                }, (err) => {
                    // this.showLoadingSun(false,0);
                    // this.showLoading(false);
                    if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent(cc.Button))
                        App.instance._selectGameNode.getComponent(cc.Button).interactable = true;
                    if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent('ColorChild')) {
                        App.instance._selectGameNode.getComponent('ColorChild').Darken = 1;
                        App.instance._selectGameNode = null;
                    }
                    App.instance.isDownloadingGame = false;
                    if (loadingNode) {
                        loadingNode.active = false;
                        loadingNodeBg.active = false;
                    }
                    cc.director.loadScene(sceneName);
                });
            });
        } else {
            cc.director.preloadScene(sceneName, (c, t, item) => {
                // this.showLoadingSun(true,(c/t))
                let tempPercent = Math.round( c / t * 100);
                if(percent < tempPercent) {
                    percent = tempPercent;
                }

                if(loadingNode) {
                    loadingNode.active = true;
                    loadingNodeBg.active = true;
                    loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                    loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                }
            }, (err) => {
                if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent(cc.Button))
                    App.instance._selectGameNode.getComponent(cc.Button).interactable = true;
                if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent('ColorChild')) {
                    App.instance._selectGameNode.getComponent('ColorChild').Darken = 1;
                    App.instance._selectGameNode = null;
                }
                if (loadingNode) {
                    loadingNode.active = false;
                    loadingNodeBg.active = false;
                }
                this.isDownloadingGame = false;
                cc.director.loadScene(sceneName);
            });
        }
    }

    loadGamePrefabInSubpackage(subpackageName: string, prefabPath: string, onLoaded: (err: string, prefab: cc.Prefab) => void) {
        if(App.instance.isDownloadingGame) {
            this.actShowThongBao('Game đang tải, vui lòng chờ!');
            return;
        }
        App.instance.isDownloadingGame = true;
        let loadingNode = null;
        let loadingNodeBg = null;
        if(App.instance._selectGameNode) {
            loadingNode = App.instance._selectGameNode.getChildByName('load');
            loadingNodeBg = App.instance._selectGameNode.getChildByName('load_bg');
            loadingNode.active = true;
            loadingNodeBg.active = true;
            loadingNode.getComponent(cc.ProgressBar).progress = 0;
            if (App.instance._selectGameNode.getComponent(cc.Button))
                App.instance._selectGameNode.getComponent(cc.Button).interactable = false;
        }

        let percent = 0;

        if (!this.subpackageLoaded.hasOwnProperty(subpackageName) || !this.subpackageLoaded[subpackageName]) {
            SubpackageDownloader.downloadSubpackage(subpackageName, (err, progress) => {
                if (err == "progress") {
                    this.showLoadingSun( true,progress);
                    // this.showErrLoading("Đang tải..." + parseInt("" + (progress * 100)) + "%");
                    return;
                }
                // this.showLoading(false);
                if (err) {
                    this.alertDialog.showMsg(err);
                    return;
                }
                this.subpackageLoaded[subpackageName] = true;
                cc.loader.loadRes(prefabPath, cc.Prefab, (c, t, item) => {
                    let tempPercent = 0;
                    if(t != 1) {
                        tempPercent = Math.round( c / t * 100);
                    }
                    if(percent < tempPercent) {
                        percent = tempPercent;
                    }
                    if(loadingNode) {
                        loadingNode.active = true;
                        loadingNodeBg.active = true;
                        loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                        loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                    }
                }, (err, prefab) => {
                    if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent(cc.Button))
                        App.instance._selectGameNode.getComponent(cc.Button).interactable = true;
                    if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent('ColorChild')) {
                        App.instance._selectGameNode.getComponent('ColorChild').setDarken(1);
                        App.instance._selectGameNode = null;
                    }
                    if (loadingNode) {
                        loadingNode.active = false;
                        loadingNodeBg.active = false;
                    }
                    this.isDownloadingGame = false;
                    onLoaded(err == null ? null : err.message, prefab);
                });
            });
        } else {
            cc.loader.loadRes(prefabPath, cc.Prefab, (c, t, item) => {
                // this.showLoadingSun(true,(c / t));
                let tempPercent = Math.round( c / t * 100);
                if(percent < tempPercent) {
                    percent = tempPercent;
                }

                if(loadingNode) {
                    loadingNode.active = true;
                    loadingNodeBg.active = true;
                    loadingNode.getChildByName('label').getComponent(cc.Label).string = Math.round(percent) + '%';
                    loadingNode.getComponent(cc.ProgressBar).progress = Math.round(percent) / 100;
                }
            }, (err, prefab) => {
                this.isDownloadingGame = false;
                if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent(cc.Button))
                    App.instance._selectGameNode.getComponent(cc.Button).interactable = true;
                if (App.instance._selectGameNode && App.instance._selectGameNode.getComponent('ColorChild')) {
                    App.instance._selectGameNode.getComponent('ColorChild').setDarken(1);
                    App.instance._selectGameNode = null;
                }
                if (loadingNode) {
                    loadingNode.active = false;
                    loadingNodeBg.active = false;
                }

                onLoaded(err == null ? null : err.message, prefab);
            });
        }
    }



    openGameBauCua() {
        App.instance.loadGamePrefabInSubpackage("BauCua", "prefabs/BauCua", (err, prefab) => {
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.bauCua == null) {
                        let node = cc.instantiate(prefab);
                        node.parent = this.miniGame;
                        node.active = false;
                        this.bauCua = node.getComponent(MiniGame);
                    }
                    this.bauCua.show();
                } else {
                    console.log(err);
                }
            });
        });
    }

    openGameBauCua2() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
            App.instance.loadSceneInSubpackage("BauCuaTo2", "BauCuaTo2");
        });
    }

    openGameSlot3x3() {
        this.loadPrefabFromBundle("Slot3x3" , {src: "Slot3x3"}, (prefab) => {
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.slot3x3 == null) {
                        let node = prefab;
                        node.parent = this.miniGame;
                        node.active = false;
                        this.slot3x3 = node.getComponent(MiniGame);
                    }
                    this.slot3x3.show();
                }
            });
        })
    }

    openGameTaiXiuMini() {
        this.loadPrefabFromBundle("TaiXiuDouble" , {src: "TaiXiuDouble"}, (prefab) => {
            TaiXiuNetWorkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.taiXiuDouble == null) {
                        let node = prefab;
                        node.parent = this.miniGame;
                        node.active = false;
                        this.taiXiuDouble = node.getComponent(MiniGame);
                    }
                    this.taiXiuDouble.show();
                }
            });
        })
    }

    openGameTaiXiuMD5() {
        this.loadPrefabFromBundle("TaiXiuMD5" , {src: "TaiXiuMD5"}, (prefab) => {
            TaiXiuMD5NetWorkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.taiXiuMD5 == null) {
                        let node = prefab;
                        node.parent = this.miniGame;
                        node.active = false;
                        this.taiXiuMD5 = node.getComponent(MiniGame);
                    }
                    this.taiXiuMD5.show();
                }
            });
        })
    }

    openGameMiniPoker() {
        this.loadPrefabFromBundle("MiniPoker" , {src: "MiniPoker"}, (prefab) => {
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.miniPoker == null) {
                        let node = prefab;
                        node.parent = this.miniGame;
                        node.active = false;
                        this.miniPoker = node.getComponent(MiniGame);
                    }
                    this.miniPoker.show();
                }
            });
        })
    }

    openGameCaoThap() {
        this.loadPrefabFromBundle("CaoThap" , {src: "CaoThap"}, (prefab) => {
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.caoThap == null) {
                        let node = prefab;
                        node.parent = this.miniGame;
                        node.active = false;
                        this.caoThap = node.getComponent(MiniGame);
                    }
                    this.caoThap.show();
                }
            });
        })
    }

    openGameOanTuTi() {
        // this.alertDialog.showMsg("Sắp ra măt.");
        // return;
        App.instance.loadGamePrefabInSubpackage("OanTuTi", "prefabs/OanTuTi", (err, prefab) => {
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                if (prefab != null) {
                    if (this.oanTuTi == null) {
                        let node = cc.instantiate(prefab);
                        node.parent = this.miniGame;
                        node.active = false;
                        this.oanTuTi = node.getComponent(MiniGame);
                    }
                    this.oanTuTi.show();
                } else {
                    console.log(err);
                }
            });
        });
    }

    public openTelegram(name: string = null) {
        if(name == null){
            name = Configs.App.getLinkTelegram();
        }
        let url = "https://t.me/" + name;
        if (cc.sys.isNative) {
            url = "tg://resolve?domain=" + name;
        }
        cc.sys.openURL(url);
    }
    public ShowAlertDialog(mess: string)
    {
        this.alertDialog.showMsg(mess);
    }

    public cleanAccents(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Combining Diacritical Marks
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
        return str;
    }

    public countClick() {
        if (!cc.sys.isNative) {
            let url = new URL(window.location.href);
            if (url.searchParams.get("seo") == 'true'){
                let utm_campaign = url.searchParams.get("utm_campaign");
                let utm_medium = url.searchParams.get("utm_medium");
                let utm_source = url.searchParams.get("utm_source");
                let utm_dl = url.searchParams.get("utm_dl");
                let reqParams = { "c": 4055,
                    "utm_dl": utm_dl,
                    "utm_source": utm_source,
                    "utm_medium": utm_medium,
                    "utm_campaign": utm_campaign,
                    "ip": "",
                    "device": navigator.userAgent,
                    "note1": "",
                    "note2": window.location.hostname,
                    "note3": ""
                };
                Http.get(Configs.App.API, reqParams , (err, res) => {
                    window.history.pushState({}, document.title, "/");
                });
            }
        }

    }

    actShowThongBao(text, delay = 3) {
        this.thongBaoDialog.stopAllActions();
        this.thongBaoDialog.getChildByName('lbTextThongBao').getComponent(cc.Label).string = text;
        this.thongBaoDialog.active = true;
        let oldDialogPosition = cc.v2(0, 1200);
        this.thongBaoDialog.runAction(
            cc.sequence(
                cc.moveTo(0.25, cc.v2(0, 320)),
                cc.delayTime(delay),
                cc.moveTo(0.25, oldDialogPosition),
                cc.delayTime(0.5)
            )
        );
    }

    actCloseThongBao() {
        let position = cc.v2(0, 1200);
        this.thongBaoDialog.position = position;
    }

    actShowThongBao2(mess: string, err = 0) {
        this.popupThongBao2.stopAllActions();
        let lbl = nodeUtils.getChildNode(this.popupThongBao2, "lbl");
        nodeUtils.setNodeLabel(lbl, mess);
        let bg = nodeUtils.getChildNode(this.popupThongBao2, "Bg");
        // bg.width = lbl.width * 4;
        this.popupThongBao2.position = cc.v2(0, 400);
        cc.tween(this.popupThongBao2)
            //.parallel(
            //    cc.tween().to(0.4, {opacity: 255}),
            .to(0.4, {position: cc.v2(0, 318)})
            // )
            .delay(2)
            //.parallel(
            //cc.tween().to(0.4, {opacity: 0}),
            .to(0.4, {position: cc.v2(0, 400)})
            //)
            .start();
    }

    setButtonMiniGamesPosition(position) {
        this.nodeButtonMiniGames.position = position;
    }

    getCurrentDate() {
        return moment(Date.now()).format("DD/MM/YYYY");
    }

    getCurrentTime() {
        return moment(Date.now()).format("HH:mm:ss");
    }
}
