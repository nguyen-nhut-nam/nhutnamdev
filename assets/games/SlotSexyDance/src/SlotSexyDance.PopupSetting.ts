import Dialog from "../../../scripts/common/Dialog";
import SlotSexyDanceSlotSexyDanceController from "./SlotSexyDance.SlotSexyDanceController";
import PopupJackpotHistory from "./SlotSexyDance.PopupJackpotHistory";
import PopupHistory from "./SlotSexyDance.PopupHistory";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Popup from "../../../scripts/common/Popup";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSetting extends Popup {
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
            SlotSexyDanceSlotSexyDanceController.getInstance().muteAllAudioSource();
            SlotSexyDanceSlotSexyDanceController.getInstance().playAudioSourceMain();
        } else {
            SlotSexyDanceSlotSexyDanceController.getInstance().muteAllAudioSource();
        }
    }

    settingSoundEffect() {
        GameConfigManager.getInstance().enableSound = this.effectToggle.isChecked;
        GameConfigManager.getInstance().setEnableSound(GameConfigManager.getInstance().enableSound);
        if(GameConfigManager.getInstance().enableSound) {
            SlotSexyDanceSlotSexyDanceController.getInstance().playSoundButton();
        }
    }

    onJackpotHistoryClicked() {
        let popupJackpotHistory = cc.instantiate(this.prefabJackpotHistory);
        this.node.parent.addChild(popupJackpotHistory);
        popupJackpotHistory.getComponent(PopupJackpotHistory).show();
    }

    onHistoryClicked() {
        let popupHistory = cc.instantiate(this.prefabHistory);
        this.node.parent.addChild(popupHistory);
        popupHistory.getComponent(PopupHistory).show();
    }

}
export default PopupSetting;