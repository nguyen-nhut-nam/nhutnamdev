import cmd from "./../../../scripts/common/Lobby.Cmd";
import Tween from "../../../scripts/common/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonListJackpot extends cc.Component {

    @property(cc.Node)
    button: cc.Node = null;
    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Label)
    lblFastAndFurious: cc.Label = null;
    @property(cc.Label)
    lblCowBoy: cc.Label = null;
    @property(cc.Label)
    lblLadyNight: cc.Label = null;
    @property(cc.Label)
    lblLienMinh: cc.Label = null;
    @property(cc.Label)
    lblSexyDance = null;
    @property(cc.Label)
    lblBongLaiCac = null;
    @property(cc.Label)
    lblHalloween = null;
    @property(cc.Label)
    lblMaCao = null;
    @property(cc.Label)
    lblBigCityBoy = null;
    @property(cc.Label)
    labelsMiniPoker: cc.Label = null;
    @property(cc.Label)
    labelsSlot3x3: cc.Label = null;
    @property(cc.Label)
    labelsCaoThap = null;

    @property([cc.Node])
    listAllJackPotGames = [];
    @property([cc.Node])
    listAllBigSlots = [];

    private buttonClicked = true;
    private buttonMoved = cc.Vec2.ZERO;
    private animate = false;

    private static lastRes: cmd.ResUpdateJackpots = null;
    private static lastResSlotBig: cmd.ResUpdateJackpotSlots = null;
    private selectedIdx = 2;

    onLoad() {
        this.container.active = false;
        this.button.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClicked = true;
            this.buttonMoved = cc.Vec2.ZERO;
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMoved = this.buttonMoved.add(event.getDelta());
            if (this.buttonClicked) {
                if (Math.abs(this.buttonMoved.x) > 30 || Math.abs(this.buttonMoved.y) > 30) {
                    let pos = this.button.position;
                    pos.x += this.buttonMoved.x;
                    pos.y += this.buttonMoved.y;
                    this.button.position = pos;
                    this.buttonClicked = false;
                }
            } else {
                let pos = this.button.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.button.position = pos;
            }
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClicked) {
                this.toggleShowPanel();
            }
        }, this);

        this.updateJackpot(0.3);
        this.updateJackpotBig(.3);
    }

    private toggleShowPanel() {
        if (this.animate) return;
        this.animate = true;
        if (!this.container.active) {
            this.container.stopAllActions();
            this.container.active = true;
            this.container.scaleY = 0;
            this.container.runAction(cc.sequence(
                cc.scaleTo(.15, 1.02, 1.02),
                cc.callFunc(() => {
                    this.animate = false;
                })
            ));
        } else {
            this.container.stopAllActions();
            this.container.runAction(cc.sequence(
                cc.scaleTo(.35, 1.02, 0).easing(cc.easeBackIn()),
                cc.callFunc(() => {
                    this.container.active = false;
                    this.animate = false;
                })
            ));
        }
    }

    setData(res: cmd.ResUpdateJackpots) {
        ButtonListJackpot.lastRes = res;
        this.updateJackpot();
    }

    setDataSlot(res: cmd.ResUpdateJackpotSlots) {
        ButtonListJackpot.lastResSlotBig = res;
        this.updateJackpotBig();
    }

    updateJackpot(duration: number = 4) {
        if (ButtonListJackpot.lastRes == null) return;
        this.labelsCaoThap.node.parent.active = true;
        switch(this.selectedIdx) {
            case 0:
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker100, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo100, duration);
                // Tween.numberTo(this.labelsCaoThap, ButtonListJackpot.lastRes.pokeGo100, duration);
                this.labelsCaoThap.node.parent.active = false;
                break;
            case 1:
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker1000, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo1000, duration);
                Tween.numberTo(this.labelsCaoThap, ButtonListJackpot.lastRes.caoThap1000, duration);
                break;
            case 2:
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker10000, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo10000, duration);
                Tween.numberTo(this.labelsCaoThap, ButtonListJackpot.lastRes.caoThap10000, duration);
                break;
        }
    }

    updateJackpotBig(duration: number = 4) {
        if (ButtonListJackpot.lastResSlotBig == null) return;
        let data = JSON.parse(ButtonListJackpot.lastResSlotBig.pots)
        switch (this.selectedIdx) {
            case 0:
                Tween.numberTo(this.lblFastAndFurious, data['FastAndFurious'][100]['p'], duration);
                Tween.numberTo(this.lblCowBoy, data['Cowboy'][100]['p'], duration);
                Tween.numberTo(this.lblLadyNight, data['LadyNight'][100]['p'], duration);
                Tween.numberTo(this.lblLienMinh, data['LienMinh'][100]['p'], duration);
                Tween.numberTo(this.lblSexyDance, data['SexyDance'][100]['p'], duration);
                Tween.numberTo(this.lblBongLaiCac, data['BongLaiCac'][100]['p'], duration);
                Tween.numberTo(this.lblHalloween, data['Halloween'][100]['p'], duration);
                Tween.numberTo(this.lblMaCao, data['LasVegas'][100]['p'], duration);
                Tween.numberTo(this.lblBigCityBoy, data['BigCityBoy'][100]['p'], duration);
                break;
            case 1:
                Tween.numberTo(this.lblFastAndFurious, data['FastAndFurious'][1000]['p'], duration);
                Tween.numberTo(this.lblCowBoy, data['Cowboy'][1000]['p'], duration);
                Tween.numberTo(this.lblLadyNight, data['LadyNight'][1000]['p'], duration);
                Tween.numberTo(this.lblLienMinh, data['LienMinh'][1000]['p'], duration);
                Tween.numberTo(this.lblSexyDance, data['SexyDance'][1000]['p'], duration);
                Tween.numberTo(this.lblBongLaiCac, data['BongLaiCac'][1000]['p'], duration);
                Tween.numberTo(this.lblHalloween, data['Halloween'][1000]['p'], duration);
                Tween.numberTo(this.lblMaCao, data['LasVegas'][1000]['p'], duration);
                Tween.numberTo(this.lblBigCityBoy, data['BigCityBoy'][1000]['p'], duration);
                break;
            case 2:
                Tween.numberTo(this.lblFastAndFurious, data['FastAndFurious'][10000]['p'], duration);
                Tween.numberTo(this.lblCowBoy, data['Cowboy'][10000]['p'], duration);
                Tween.numberTo(this.lblLadyNight, data['LadyNight'][10000]['p'], duration);
                Tween.numberTo(this.lblLienMinh, data['LienMinh'][10000]['p'], duration);
                Tween.numberTo(this.lblSexyDance, data['SexyDance'][10000]['p'], duration);
                Tween.numberTo(this.lblBongLaiCac, data['BongLaiCac'][10000]['p'], duration);
                Tween.numberTo(this.lblHalloween, data['Halloween'][10000]['p'], duration);
                Tween.numberTo(this.lblMaCao, data['LasVegas'][10000]['p'], duration);
                Tween.numberTo(this.lblBigCityBoy, data['BigCityBoy'][10000]['p'], duration);
                break;
        }
    }

    onSelectAllGame() {
        this.listAllJackPotGames.forEach((node) => node.active = true);
    }

    onSelectSlotBig() {
        this.listAllJackPotGames.forEach((node) => node.active = false);
        this.listAllBigSlots.forEach((node) => node.active = true);
    }

    onSelectJackpotRoom(event, data) {
        this.selectedIdx = parseInt(data);
        this.updateJackpot(.3);
        this.updateJackpotBig(.3);
    }
}