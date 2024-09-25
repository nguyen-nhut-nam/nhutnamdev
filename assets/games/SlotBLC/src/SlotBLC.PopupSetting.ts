import Dialog from "../../../scripts/common/Dialog";
import SlotBLCSlotBLCController from "./SlotBLC.SlotBLCController";
import PopupJackpotHistory from "./SlotBLC.PopupJackpotHistory";
import PopupHistory from "./SlotBLC.PopupHistory";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Popup from "../../../scripts/common/Popup";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSetting extends cc.Component {
    soundClick: cc.AudioClip = null;

    @property(cc.Toggle)
    musicToggle = null;
    @property(cc.Toggle)
    effectToggle = null;
    @property(cc.Prefab)
    prefabJackpotHistory = null;
    @property(cc.Prefab)
    prefabHistory = null;

    start() {
        this.musicToggle.isChecked = GameConfigManager.getInstance().enableBackgroundMusic;
        this.effectToggle.isChecked = GameConfigManager.getInstance().enableSound;
    }

    settingMusicNode() {
        GameConfigManager.getInstance().enableBackgroundMusic = this.musicToggle.isChecked;
        GameConfigManager.getInstance().setEnableBgMusic(GameConfigManager.getInstance().enableBackgroundMusic);
        if(GameConfigManager.getInstance().enableBackgroundMusic) {
            SlotBLCSlotBLCController._instance.muteAllAudioSource();
            SlotBLCSlotBLCController._instance.playAudioSourceMain();
        } else {
            if(SlotBLCSlotBLCController._instance) {
                SlotBLCSlotBLCController._instance.muteAllAudioSource();
            }
        }
    }

    settingSoundEffect() {
        GameConfigManager.getInstance().enableSound = this.effectToggle.isChecked;
        GameConfigManager.getInstance().setEnableSound(GameConfigManager.getInstance().enableSound);
        if(GameConfigManager.getInstance().enableSound) {
            SlotBLCSlotBLCController._instance.playSoundButton();
        }
    }

    onJackpotHistoryClicked() {
        let popupJackpotHistory = cc.instantiate(this.prefabJackpotHistory);
        let canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.addChild(popupJackpotHistory);
        popupJackpotHistory.getComponent(PopupJackpotHistory).show();
    }

    onHistoryClicked() {
        let popupHistory = cc.instantiate(this.prefabHistory);
        let canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.addChild(popupHistory);
        popupHistory.getComponent(PopupHistory).show();
    }

}
export default PopupSetting;