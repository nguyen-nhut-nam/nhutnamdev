import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Button)
    btnInvite: cc.Button = null;
    @property(cc.Node)
    info: cc.Node = null;

    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Sprite)
    sprAvatar: cc.Sprite = null;
    @property(cc.Node)
    winCoin: cc.Node = null;
    @property(cc.Node)
    wineff: cc.Node = null;
    @property(cc.Node)
    refundCoin: cc.Node = null;
    @property(cc.Node)
    chipsPoint: cc.Node = null;
    @property(cc.Node)
    chipsPoint2: cc.Node = null;
    @property(cc.Node)
    banker: cc.Node = null;

    public nickname: string = "";
    public avatar: string = "";

    public leave() {
        this.nickname = "";

        if (this.btnInvite) this.btnInvite.node.active = true;
        if (this.info) this.info.active = false;
        this.winCoin.active = false;
        this.wineff.active = false;
        this.refundCoin.active = false;
        this.banker.active = false;
        this.unscheduleAllCallbacks();
    }

    public set(nickname: string, avatar: string, coin: number, isBanker: boolean) {
        this.nickname = nickname;
        this.lblNickname.string = nickname;
        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(avatar);
        this.setCoin(coin);
        this.banker.active = isBanker;

        if (this.btnInvite) this.btnInvite.node.active = false;
        if (this.info) this.info.active = true;
    }

    public setCoin(coin: number) {
        this.lblCoin.string = Utils.NFormatter(coin);
    }

    public showWinCoin(coin: number) {
        this.winCoin.active = true;
        this.wineff.active = true;
        this.winCoin.getComponentInChildren(cc.Label).string = Utils.NFormatter(coin);
        let nodeLabel = this.winCoin.children[0];
        nodeLabel.scale = 0;
        this.winCoin.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    this.winCoin.getComponent(sp.Skeleton).setAnimation(0, 'user_thang2', false);
                }),
                cc.delayTime(.5),
                cc.callFunc(() => {
                    nodeLabel.runAction(
                        cc.scaleTo(.2, 1)
                    )
                }),
                cc.delayTime(5.5),
                cc.callFunc(() => {
                    this.winCoin.active = false;
                    this.wineff.active = false;
                })
            )
        )
    }

    public showRefundCoin(coin: number) {
        this.refundCoin.active = true;
        this.refundCoin.getComponentInChildren(cc.Label).string = Utils.NFormatter(coin);
        this.scheduleOnce(() => {
            this.refundCoin.active = false;
        }, 4);
    }

    @property(cc.Node)
    chatEmotion: cc.Node = null;

    @property(cc.Node)
    chatMsg: cc.Node = null;
    private timeoutChat =null;
    showChatEmotion(content) {
        this.chatEmotion.active = true;
        this.chatMsg.active = false;
        clearTimeout(this.timeoutChat);
        this.chatEmotion.getComponent(sp.Skeleton).setAnimation(0, `Emoji_${content}`, true);
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 3000);
    }

    showChatMsg(content) {
        this.chatEmotion.active = false;
        this.chatMsg.active = true;
        clearTimeout(this.timeoutChat);
        this.chatMsg.children[0].children[0].getComponent(cc.Label).string = content;
        this.chatMsg.children[0].scale = 0;
        this.chatMsg.children[0].runAction(
            cc.sequence(
                cc.scaleTo(.1, 1),
                cc.delayTime(3),
                cc.scaleBy(.1,0),
                cc.callFunc(() => {
                    this.chatEmotion.active = false;
                    this.chatMsg.active = false;
                })
            )
        )
    }

    hideWinCoin() {
        this.winCoin.active = false;
        this.wineff.active = false;
        this.winCoin.stopAllActions();
    }
}
