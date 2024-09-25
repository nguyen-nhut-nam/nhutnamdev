import GameConfigManager from "../../../../scripts/common/game/GameConfigManager";
import LobbyLobbyController from "../Lobby.LobbyController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupSetting extends cc.Component {

    @property(cc.Toggle)
    toggleSoundEffect = null;
    @property(cc.Toggle)
    toggleMusic = null;
    @property(cc.Toggle)
    toggleAutoAccept = null;

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
            LobbyLobbyController._instance.actPlaySFXClick();
        }
    }

    onChangeMusic(event) {
        this.toggleMusic.target.active = !this.toggleMusic.isChecked;
        GameConfigManager.getInstance().setEnableBgMusic(this.toggleMusic.isChecked);
        if(this.toggleMusic.isChecked) {
            LobbyLobbyController._instance.actPlayAudioMain();
        } else {
            LobbyLobbyController._instance.actPauseAudioMain();
        }
    }

    onChangeAutoAccept(event) {
        this.toggleAutoAccept.target.active = !this.toggleAutoAccept.isChecked;
    }

    actCloseSetting() {
        LobbyLobbyController._instance.actClosePopup(this.node);
    }

}
