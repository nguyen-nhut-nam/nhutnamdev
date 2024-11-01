import Utils from "../../../../scripts/common/Utils";
import App from "../../../../scripts/common/App";
import Configs from "../../../../scripts/common/Configs";
import MiniGameNetworkClient from "../../../../scripts/networks/MiniGameNetworkClient";
import cmd from "../../../../scripts/common/Lobby.Cmd";
import InPacket from "../../../../scripts/networks/Network.InPacket";
import BroadcastReceiver from "../../../../scripts/common/BroadcastReceiver";
import GameErrorMessage from "../../../../scripts/enum/GameErrorMessage";
import Game = cc.Game;
import BoneAllTimelineState = dragonBones.BoneAllTimelineState;
import GameSuccessMessage from "../../../../scripts/enum/GameSuccessMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabWithdrawTransfer extends cc.Component {

    @property(cc.EditBox)
    edbNickname = null;
    @property(cc.EditBox)
    edbCoinTransfer = null;
    @property(cc.EditBox)
    edbNote = null;
    @property(cc.Label)
    lblBalance = null;
    @property(cc.Label)
    lblTransferAmount = null;
    @property(cc.Label)
    lblActuallyReceive = null;
    @property(cc.Label)
    lblTransferFee = null;

    private transferFee = Configs.App.SERVER_CONFIG.ratioTransfer;
    private transferAmount = 0;

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    switch (res.error) {
                        case 2:
                            App.instance.alertDialog.showMsg(GameErrorMessage.TRANSFER_AMOUNT_MIN_DESCRIPTION);
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_ENOUGH_BALANCE);
                            break;
                        case 5:
                            App.instance.alertDialog.showMsg(GameErrorMessage.ACCOUNT_BAN_TRANSFER);
                            break;
                        case 23:
                            App.instance.alertDialog.showMsg(GameErrorMessage.NICKNAME_NOT_EXISTED);
                            break;
                        case 24:
                            //case success
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            this.actResetInformation();
                            App.instance.actShowThongBao(GameSuccessMessage.TRANSFER_SUCCESSFULLY, 2);
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    break;
                }
            }
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        }, this);
    }

    protected onEnable() {
        this.lblTransferFee.string = `${Math.round((1 - this.transferFee) * 100)}%`;
        this.lblBalance.string = `${Utils.formatNumber(Configs.Login.Coin)}`;
    }

    actSubmit() {
        let nickname = this.edbNickname.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.string.trim());
        let note = this.edbNote.string.trim();

        if (nickname.length == 0) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NICKNAME_BLANK);
            return;
        }
        if (note == "") {
            App.instance.alertDialog.showMsg(GameErrorMessage.TRANSFER_NOTE_BLANK);
            return;
        }

        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg(GameErrorMessage.NOT_ENOUGH_BALANCE);
            return;
        }

        App.instance.confirmDialog.show2("Bạn chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + "\nSố tiền: " + Utils.formatNumber(coin) + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading2(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoinToAnUser(nickname, coin, note));
            }
        });
    }

    actResetInformation() {
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.edbNickname.string = "";
        this.edbCoinTransfer.string = "";
        this.edbNote.string = "";
        this.lblTransferAmount.string = '';
        this.lblActuallyReceive.string = '';
    }

    amountChange() {
        this.transferAmount = Utils.stringToInt(this.edbCoinTransfer.string.trim());
        if(this.transferAmount <= 0) {
            this.edbCoinTransfer.string = 0;
            this.lblTransferAmount.string = 0;
            this.lblActuallyReceive.string = 0;
            return;
        }

        if(this.transferAmount >= Configs.Login.Coin) {
            this.edbCoinTransfer.string = Configs.Login.Coin.toString();
            this.lblTransferAmount.string = Utils.formatNumber(Configs.Login.Coin);
            this.lblActuallyReceive.string = Utils.formatNumber(Math.ceil(Configs.Login.Coin * this.transferFee));
        } else {
            this.lblTransferAmount.string = Utils.formatNumber(this.transferAmount);
            this.lblActuallyReceive.string = Utils.formatNumber(Math.ceil(this.transferAmount * this.transferFee));
        }
    }

    onEditBegan() {
        this.edbCoinTransfer.textLabel.node.active = false;
        this.edbCoinTransfer.textLabel.node.opacity = 0;
        this.edbCoinTransfer.fontColor = new cc.Color(255, 255, 255, 0);
    }
}
