// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Dialog from "../../../scripts/common/Dialog";
import SPUtils from "../../../scripts/common/SPUtils";
import utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import BauCuaController from "./BauCuaTo2.BauCuaController";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Play from "../../XocDia/src/XocDia.Play";



const {ccclass, property} = cc._decorator;

@ccclass
export  class BauCuaTo2setting extends Dialog {

    @property(cc.Toggle)
    toggleMusic = null;
    @property(cc.Toggle)
    toggleSoundEffect = null;

    protected onLoad() {
        this.toggleSoundEffect.isChecked = GameConfigManager.getInstance().enableSound;
        this.toggleSoundEffect.target.active = !this.toggleSoundEffect.isChecked;
        this.toggleMusic.isChecked = GameConfigManager.getInstance().enableBackgroundMusic;
        this.toggleMusic.target.active = !this.toggleMusic.isChecked;
    }

    onChangeSoundEffect(event) {
        this.toggleSoundEffect.target.active = !this.toggleSoundEffect.isChecked;
        GameConfigManager.getInstance().setEnableSound(this.toggleSoundEffect.isChecked);
        if(this.toggleSoundEffect.isChecked) {
            BauCuaController.instance.actClick();
        }
    }

    onChangeMusic(event) {
        BauCuaController.instance.actClick();
        this.toggleMusic.target.active = !this.toggleMusic.isChecked;
        GameConfigManager.getInstance().setEnableBgMusic(this.toggleMusic.isChecked);
        if(this.toggleMusic.isChecked) {
            BauCuaController.instance.actOnBgMusic();
        } else {
            BauCuaController.instance.offBgMusic();
        }
    }
}
export default BauCuaTo2setting;
