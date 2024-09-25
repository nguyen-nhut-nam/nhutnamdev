import Dialog from "../../../scripts/common/Dialog";
import PopupJackpotHistory from "./SlotLadyNight.PopupJackpotHistory";
import PopupHistory from "./SlotLadyNight.PopupHistory";
import UIToggleSlider from "../../../scripts/common/game/UIToggleSlider";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import SlotLadyNightController from "./SlotLadyNight.SlotLNController";
import SlotLadyNightSlotLNController from "./SlotLadyNight.SlotLNController";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSetting extends Dialog {

    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property(cc.Button)
    btnClose = null;
    @property(cc.Prefab)
    prefabJackpotHistory = null;
    @property(cc.Prefab)
    prefabHistory = null;
    @property(UIToggleSlider)
    isSoundEffect = null;
    @property(UIToggleSlider)
    isBgMusic = null;

    start() {

    }

    protected onLoad() {
        this.isSoundEffect.initStart(GameConfigManager.getInstance().enableSound);
        this.isSoundEffect.onValueChange = this.onChangeSoundEffect.bind(this);
        this.isBgMusic.initStart(GameConfigManager.getInstance().enableBackgroundMusic);
        this.isBgMusic.onValueChange = this.onChangeSettingBgMusic.bind(this);
    }

    onChangeSettingBgMusic(enable) {
        cc.sys.localStorage.setItem("enableBackgroundMusic", enable);
        GameConfigManager.getInstance().setEnableBgMusic(enable);
        if(enable) {
            SlotLadyNightController.getInstance().playAudioSourceMain();
        } else {
            SlotLadyNightSlotLNController.getInstance().muteAllAudioSource();
        }
    }

    onChangeSoundEffect(enable) {
        GameConfigManager.getInstance().setEnableSound(enable);
    }

    show() {
        super.show();
        this.btnClose.interactable = true;
    }

    dismiss() {
        this.btnClose.interactable = false;
        super.dismiss();
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