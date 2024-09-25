import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Utils from "../../../scripts/common/Utils";
import Configs from "../../../scripts/common/Configs";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmd from "../../../scripts/common/Lobby.Cmd";
import App from "../../../scripts/common/App";
import PopupProfile from "./Lobby.PopupProfile";
import nodeUtils from "../../../scripts/common/NodeUtils";
import utils from "../../../scripts/common/Utils";
import LobbyLobbyController from "./Lobby.LobbyController";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupKetsat extends cc.Component {

    @property(cc.EditBox)
    moneyInput: cc.EditBox = null;
    @property(cc.Label)
    lblBalanceSafes = null;
    @property(cc.Label)
    lblBalance = null;
    @property(cc.EditBox)
    edbCoin = null;
    @property(cc.Label)
    lblEdbCoin = null;

    private _transferAmount = 0;
    protected onLoad() {
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(0, 1));
    }

    start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            // console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.RESULT_SAFES: {
                    App.instance.showLoading2(false);
                    let res = new cmd.ResResultSafes(data);
                    switch (res.error) {
                        case 0:
                            this.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                            this.clearTextValue();
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        case 3:
                            this.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                            this.clearTextValue();
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    this.clearTextValue();
                    break;
                }
            }
        }, this);
    }

    show() {
        App.instance.showLoading2(true);
    }

    actSubmitSafesNap() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
            return;
        } else if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số tiền hiện tại không đủ thực hiện yêu cầu nạp");
            return;
        }
        App.instance.confirmDialog.show3("Bạn muốn gửi $" + utils.formatNumber(coin) + " vào két sắt?", "RÚT KÉT", (isConfirm) => {
            if(isConfirm) {
                MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 1));
            }
        });
    }

    actSubmitSafesRut() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch không hợp lệ.");
            return;
        }
        else if (coin > Utils.stringToInt(this.lblBalanceSafes.string.trim())) {
            App.instance.alertDialog.showMsg("Số tiền trong két không đủ để thực hiện yêu cầu rút");
            return;
        }

        App.instance.confirmDialog.show3("Bạn muốn rút $" + utils.formatNumber(coin) + " khỏi két sắt?", "RÚT KÉT", (isConfirm) => {
            if(isConfirm) {
                MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 0));
            }
        });
    }

    onTextChanged() {
        this._transferAmount = parseInt(this.edbCoin.string.trim());
        if(this.edbCoin.string.trim() === "") {
            this.lblEdbCoin.string = '';
        } else {
            this.lblEdbCoin.string = Utils.formatNumber(this._transferAmount);
        }
    }

    clearTextValue() {
        this.edbCoin.string = "";
        this.lblEdbCoin.string = "";
    }

    onEditBegan() {
        this.edbCoin.textLabel.node.active = false;
        this.edbCoin.textLabel.node.opacity = 0;
        this.edbCoin.fontColor = new cc.Color(255, 255, 255, 0);
    }

    actCloseKetSat() {
        this.node.getChildByName('Container').runAction(
            cc.sequence(
                cc.scaleTo(.1, 1.1),
                cc.scaleTo(.3, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                })
            )
        )
    }

    actGoToPopupShop() {
        this.node.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    LobbyLobbyController._instance.actAddCoin();
                }),
                cc.scaleTo(.1, 1.1),
                cc.scaleTo(.3, 0),
                cc.callFunc(() => {
                    this.node.destroy();
                })
            )
        )
    }
}
