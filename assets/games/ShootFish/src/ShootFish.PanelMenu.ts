import SPUtils from "../../../scripts/common/SPUtils";
import Play from "./ShootFish.Play";
import GameConfigManager from "../../../scripts/common/game/GameConfigManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelMenu extends cc.Component {

    @property(cc.Node)
    arrow: cc.Node = null;

    @property(cc.Button)
    btnSound: cc.Button = null;
    @property(cc.SpriteFrame)
    sfSoundOn: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfSoundOff: cc.SpriteFrame = null;
    @property(cc.Button)

    btnMusic: cc.Button = null;
    @property(cc.SpriteFrame)
    sfMusicOn: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfMusicOff: cc.SpriteFrame = null;

    private isShow = false;

    private soundState = 1;
    private musicState = 1;

    show(isShow: boolean) {
        this.isShow = isShow;
        if (this.isShow) {
            this.node.runAction(cc.moveTo(0.3, cc.v2(-100, 0)));
            this.arrow.runAction(cc.rotateTo(0.3, 0));
        } else {
            this.node.runAction(cc.moveTo(0.3, cc.v2(5, 0)));
            this.arrow.runAction(cc.rotateTo(0.3, 180));
        }
        
        this.btnSound.getComponent(cc.Sprite).spriteFrame = GameConfigManager.getInstance().enableSound ? this.sfSoundOn : this.sfSoundOff;
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = GameConfigManager.getInstance().enableBackgroundMusic ? this.sfMusicOn : this.sfMusicOff;
    }

    toggleShow() {
        this.show(!this.isShow);
    }

    toggleSound() {
        GameConfigManager.getInstance().enableSound = !GameConfigManager.getInstance().enableSound;
        this.btnSound.getComponent(cc.Sprite).spriteFrame = GameConfigManager.getInstance().enableSound ? this.sfSoundOn : this.sfSoundOff;
        Play.instance.settingSound();
    }

    toggleMusic() {
        GameConfigManager.getInstance().enableBackgroundMusic = !GameConfigManager.getInstance().enableBackgroundMusic;
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = GameConfigManager.getInstance().enableBackgroundMusic ? this.sfMusicOn : this.sfMusicOff;
        Play.instance.settingMusic();
    }
}
