
import TaiXiuMiniController from "../TaiXiuMini/src/TaiXiuMini.TaiXiuMiniController";
import App from "../../../scripts/common/App";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import TaiXiuNetWorkClient from "../../../scripts/networks/TaiXiuNetWorkClient";
import nodeUtils from "../../../scripts/common/NodeUtils";
import MiniGame from "../../../scripts/common/MiniGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaiXiuDoubleController extends MiniGame {

    static instance: TaiXiuDoubleController = null;

    @property(TaiXiuMiniController)
    taiXiu1Node: cc.Node = null;

    taiXiu1: TaiXiuMiniController = null;

    private isShowTX1 = true;

    @property(cc.Node)
    btnNotTransparent: cc.Node = null;
    @property(cc.Node)
    btnTransparent: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;

    private isTransparent = false;
    private isDragging = false;
    private isActiveChat = false;
    private isResult = false;
    private defaultPosition = null;

    public onLoad() {
        super.onLoad();
        this.taiXiu1 = this.taiXiu1Node.getComponent(TaiXiuMiniController);
        TaiXiuDoubleController.instance = this;
        this.defaultPosition = this.gamePlay.position;
    }

    public start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        TaiXiuNetWorkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);
        let gamePlay = nodeUtils.getChildNode(this.taiXiu1.node, "GamePlay");
        gamePlay.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if((this.isResult && !this.taiXiu1.isBetting) || this.taiXiu1.isBetting) {
                let pos = this.gamePlay.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.gamePlay.position = pos;
                this.isDragging = true;
            }
        }, this);

        gamePlay.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.isResult = this.taiXiu1.isResult;
            this.isDragging = false;
            this.reOrder();
            this.actSetNotTransparent();
        }, this);
    }

    public show() {
        super.show();

        this.isShowTX1 = true;
        this.gamePlay.position = this.defaultPosition;
        TaiXiuNetWorkClient.getInstance().checkConnect(() => {
            this.taiXiu1.show();
        });
        App.instance.buttonMiniGame.showTimeTaiXiu(false);
        this.actSetNotTransparent();
    }

    public dismiss() {
        super.dismiss();
        App.instance.buttonMiniGame.showTimeTaiXiu(true);
        this.taiXiu1.dismiss();
        App.instance.taiXiuDouble = null;
    }

    actSetTransparent() {
        // let listNotTrans = ["bowl", "dice1", "dice2", "dice3", "PanelChat", "DiceAnim"];
        let listNotTrans = [];
        let gamePlay = nodeUtils.getChildNode(this.taiXiu1.node, "GamePlay");
        let chatPanel = nodeUtils.getChildNode(this.taiXiu1.node, "GamePlay").getChildByName('PanelChat');
        this.isActiveChat = chatPanel.active;
        if(this.isActiveChat) {
            chatPanel.active = false;
        }
        gamePlay.scale = 0.8;
        this.isTransparent = true;
        nodeUtils.disableNode(this.btnTransparent);
        nodeUtils.disableNode(this.bg);
    }

    actSetNotTransparent() {
        let gamePlay = nodeUtils.getChildNode(this.taiXiu1.node, "GamePlay");
        let chatPanel = nodeUtils.getChildNode(this.taiXiu1.node, "GamePlay").getChildByName('PanelChat');
        if(this.isActiveChat) {
            chatPanel.active = true;
        }
        gamePlay.scale = 1.1;
        nodeUtils.activeNode(this.btnTransparent);
        nodeUtils.activeNode(this.bg);
        this.reOrder();
    }
}
