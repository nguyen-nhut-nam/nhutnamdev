import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import TaiXiuMD5NetWorkClient from "../../../scripts/networks/TaiXiuMD5NetWorkClient";
import TaiXiuMD5Controller from "./TaiXiuMD5.TaiXiuMD5Controller";
import nodeUtils from "../../../scripts/common/NodeUtils";
import MiniGame from "../../../scripts/common/MiniGame";
import App from "../../../scripts/common/App";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MD5Controller extends MiniGame {
    static instance: MD5Controller = null;

    @property(cc.Node)
    taiXiuMD5Node = null;

    @property(cc.Node)
    btnNotTransparent: cc.Node = null;
    @property(cc.Node)
    btnTransparent: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;

    taiXiuMD5: TaiXiuMD5Controller = null;
    private isTransparent = false;
    private isDragging = false;
    private isActiveChat = false;
    private defaultPosition = null;
    private isResult = false;
    onLoad() {
        MD5Controller.instance = this;
        this.taiXiuMD5 = this.taiXiuMD5Node.getComponent(TaiXiuMD5Controller);
        this.defaultPosition = this.gamePlay.position;
    }

    public start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        TaiXiuMD5NetWorkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        let gamePlay = nodeUtils.getChildNode(this.taiXiuMD5.node, "GamePlay");
        gamePlay.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if((this.isResult && !this.taiXiuMD5.isBetting) || this.taiXiuMD5.isBetting) {
                let pos = this.gamePlay.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.gamePlay.position = pos;
                this.isDragging = true;
            }
        }, this);
        gamePlay.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.isResult = this.taiXiuMD5.isResult;
            this.isDragging = false;
            this.reOrder();
            this.actSetNotTransparent();
        }, this);
    }

    public show() {
        super.show();

        TaiXiuMD5NetWorkClient.getInstance().checkConnect(() => {
            this.taiXiuMD5.show();
        });
        this.actSetNotTransparent();
        this.gamePlay.position = this.defaultPosition;
    }

    public dismiss() {
        super.dismiss();
        this.taiXiuMD5.dismiss();
        App.instance.taiXiuMD5 = null;
    }

    actSetTransparent() {
        // let listNotTrans = ["bowl", "dice1", "dice2", "dice3", "PanelChat", "DiceAnim"];
        let listNotTrans = ["bowl"];
        let gamePlay = nodeUtils.getChildNode(this.taiXiuMD5.node, "GamePlay");
        let chatPanel = nodeUtils.getChildNode(this.taiXiuMD5.node, "GamePlay").getChildByName('PanelChat');
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
        let gamePlay = nodeUtils.getChildNode(this.taiXiuMD5.node, "GamePlay");
        let listNotTrans = ["bowl"];
        let chatPanel = nodeUtils.getChildNode(this.taiXiuMD5.node, "GamePlay").getChildByName('PanelChat');
        if(this.isActiveChat) {
            chatPanel.active = true;
        }
        gamePlay.scale = 1.05;
        nodeUtils.activeNode(this.btnTransparent);
        nodeUtils.activeNode(this.bg);
        this.reOrder();
    }

}
