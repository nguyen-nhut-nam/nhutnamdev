import GameConfigManager from "./GameConfigManager";
import StringUtils from "./StringUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MusicPlayer extends cc.Component {

    static _instance: MusicPlayer = null;

    private isLostFocus = false;
    private countTimeCheckMusic = false;
    private onPlayMusic = false;
    public loopEffectId = -1;
    private currEffectId = -1;
    private pathEffectLoop = "";

    protected onLoad() {
        MusicPlayer._instance = this;
    }

    public static getInstance() {
        if(this._instance == null) {
            this._instance = new MusicPlayer();
        }
        return this._instance;
    }

    playEffectLoop(pathEffectLoop) {
        if(GameConfigManager.getInstance().enableSound != false) {
            this.pathEffectLoop = pathEffectLoop;
            cc.loader.loadRes(pathEffectLoop, cc.AudioClip, this.playEffectWhenLoadDoneLoop.bind(this));
        }
    }

    playEffectWhenLoadDoneLoop(error, audioClip) {
        if(!error) {
            this.loopEffectId = cc.audioEngine.playEffect(audioClip, true);
        }
    }

    playEffect(pathSoundEffect, e = false) {
        if(!StringUtils.isNullOrEmpty(pathSoundEffect) && GameConfigManager.getInstance().enableSound) {
            cc.loader.loadRes(pathSoundEffect, cc.AudioClip, this.playEffectWhenLoadDone.bind(this));
        }
    }

    playEffectWhenLoadDone(error, audioClip) {
        if(!error) {
            cc.audioEngine.playEffect(audioClip, false);
        }
    }

    playEffectWhenLoadDoneWithId(error, audioClip) {
        if(!error) {

        }
    }
}
