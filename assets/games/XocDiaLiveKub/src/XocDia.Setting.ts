import Dialog from "../../../scripts/common/Dialog";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";
import Play from "./XocDia.Play";



const {ccclass, property} = cc._decorator;

@ccclass
export  class XocDiaSetting extends Dialog {


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
            Play.instance.actClick();
        }
    }

    onChangeMusic(event) {
        Play.instance.actClick();
        this.toggleMusic.target.active = !this.toggleMusic.isChecked;
        GameConfigManager.getInstance().setEnableBgMusic(this.toggleMusic.isChecked);
        if(this.toggleMusic.isChecked) {
            Play.instance.actOnBgMusic();
        } else {
            Play.instance.offBgMusic();
        }
    }

}
export default XocDiaSetting;
