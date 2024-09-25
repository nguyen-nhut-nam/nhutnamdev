const {ccclass, property} = cc._decorator;

@ccclass
export default class GameConfigManager extends cc.Component {

    static _instance: GameConfigManager = null;
    public enableSound: boolean = true;
    public enableBackgroundMusic: boolean = true;

    public static getInstance() {
        if(this._instance == null) {
            this._instance = new GameConfigManager();
            this._instance.init();
        }
        return this._instance;
    }
    public init() {
        let lsEnableSound = cc.sys.localStorage.getItem("enableSound");
        if(lsEnableSound != null) {
            this.enableSound = lsEnableSound.localeCompare("true") === 0;
        } else {
            this.enableSound = true;
            cc.sys.localStorage.setItem("enableSound", true);
        }
        let lsEnableBackgroundMusic = cc.sys.localStorage.getItem("enableBackgroundMusic");
        if(lsEnableBackgroundMusic != null) {
            this.enableBackgroundMusic = lsEnableBackgroundMusic.localeCompare("true") === 0;
        } else {
            this.enableBackgroundMusic = true;
            cc.sys.localStorage.setItem("enableBackgroundMusic", true);
        }
    }

    public setEnableSound(enable) {
        cc.sys.localStorage.setItem("enableSound", enable);
        this.enableSound = enable;
    }

    public setEnableBgMusic(enable) {
        cc.sys.localStorage.setItem("enableBackgroundMusic", enable);
        this.enableBackgroundMusic = enable;
    }
}
