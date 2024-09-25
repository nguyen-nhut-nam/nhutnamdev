import Dialog from "../../../scripts/common/Dialog";
import SlotFAFSlotFAFController from "./SlotFAF.SlotFAFController";
import PopupJackpotHistory from "./SlotFAF.PopupJackpotHistory";
import PopupHistory from "./SlotFAF.PopupHistory";
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
            SlotFAFSlotFAFController.getInstance().muteAllAudioSource();
            SlotFAFSlotFAFController.getInstance().playAudioSourceMain();
        } else {
            SlotFAFSlotFAFController.getInstance().muteAllAudioSource();
        }
    }

    settingSoundEffect() {
        GameConfigManager.getInstance().enableSound = this.effectToggle.isChecked;
        GameConfigManager.getInstance().setEnableSound(GameConfigManager.getInstance().enableSound);
        if(GameConfigManager.getInstance().enableSound) {
            SlotFAFSlotFAFController.getInstance().playSoundButton();
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