import App from "../../../../../scripts/common/App";
import Http from "../../../../../scripts/common/Http";
import Configs from "../../../../../scripts/common/Configs";
import ApiIDEnum from "../../enum/ApiIDEnum";
import MailBoxItem from "./MailBoxItem";
import LobbyLobbyController from "../../Lobby.LobbyController";
import Utils from "../../../../../scripts/common/Utils";
import GameSuccessMessage from "../../../../../scripts/enum/GameSuccessMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupMailBox extends cc.Component {
    @property(cc.Node)
    itemMailBox = null;
    @property(cc.Node)
    mailContainer = null;
    @property(cc.Node)
    nodeListMail = null;
    @property(cc.Node)
    nodeMailContent = null;
    @property(cc.Label)
    lblMailTitle = null;
    @property(cc.Label)
    lblMailContent = null;
    @property(cc.Label)
    lblMailGiftCode = null;

    private _selectedMail = null;
    private _listMail = null;

    protected onLoad() {
        this.actSwitchDetail(false);
        this.loadListMail();
    }

    loadListMail() {
        App.instance.showLoading2(true);
        this.mailContainer.removeAllChildren(true);
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.GET_MAIL, "nn": Configs.Login.Nickname, "p": 0}, (err, res) => {
                App.instance.showLoading2(false);
                if(res.success) {
                    this._listMail = res.transactions;
                    for(let i = 0; i < res.transactions.length; i++) {
                        let mailInformation = res.transactions[i];
                        let mailItem = cc.instantiate(this.itemMailBox);
                        mailItem.getComponent(MailBoxItem).initMail(mailInformation);
                        this.mailContainer.addChild(mailItem);
                        let clickEventHandler = new cc.Component.EventHandler();
                        clickEventHandler.target = this.node;
                        clickEventHandler.component = "PopupMailBox";
                        clickEventHandler.handler = "actReadMail";
                        clickEventHandler.customEventData = mailInformation.mail_id;
                        mailItem.getComponent(cc.Button).clickEvents.push(clickEventHandler);

                        let clickDeleteEventHandler = new cc.Component.EventHandler();
                        clickDeleteEventHandler.target = this.node;
                        clickDeleteEventHandler.component = "PopupMailBox";
                        clickDeleteEventHandler.handler = "actDeleteMail";
                        clickDeleteEventHandler.customEventData = mailInformation.mail_id;
                        mailItem.getChildByName('delete').getComponent(cc.Button).clickEvents.push(clickDeleteEventHandler);
                    }
                }
            });
        } catch(ex) {
            console.log(ex);
        } finally {
            App.instance.showLoading2(false);
        }
    }

    actReadMail(event, data) {
        let mailId = data;
        this._selectedMail = this._listMail.find(mail => mail.mail_id === mailId);
        if(this._selectedMail == null) {
            return;
        }

        App.instance.showLoading2(true);
        try {
            Http.get(Configs.App.API, { "c": ApiIDEnum.READ_MAIL, "mid": mailId}, (err, res) => {
                if(err) {
                    console.log(err);
                    App.instance.alertDialog.showMsg(err);
                    return;
                }
                App.instance.showLoading2(false);
                if(res.success) {
                    this.actSwitchDetail(true);
                    this.lblMailTitle.string = `${this._selectedMail.title}`;
                    this.lblMailContent.string = this._selectedMail.content;
                    if(this._selectedMail.giftCode && this._selectedMail.giftCode.length > 0) {
                        this.lblMailGiftCode.string = `GIFTCODE: ${this._selectedMail.giftCode}`;
                        this.lblMailGiftCode.node.on(cc.Node.EventType.TOUCH_END, () => {
                            Utils.copyTextToClipboard(this._selectedMail.giftCode);
                            App.instance.actShowThongBao(GameSuccessMessage.COPY_SUCCESSFULLY);
                        })
                    }
                }
            });
        } catch (ex) {

        } finally {
            App.instance.showLoading2(false);
        }
    }

    actDeleteMail(event, data) {
        let deleteMailMsg = "Bạn có chắc chắn muốn xóa thư không?";
        let deleteMailSuccessfully = "Xóa thư thành công";
        let deleteMailFailed = "Xóa thư thất bại";
        let mailId = data;
        try {
            App.instance.confirmDialog.show2(deleteMailMsg, (isConfirm) => {
                if(isConfirm) {
                    Http.get(Configs.App.API, { "c": ApiIDEnum.DELETE_MAIL, "mid": mailId}, (err, res) => {
                        if(err) {
                            App.instance.alertDialog.showMsg(err);
                            return;
                        }
                        if(!res.success) {
                            App.instance.actShowThongBao(deleteMailFailed);
                            return;
                        }
                        if(res.success) {
                            App.instance.actShowThongBao(deleteMailSuccessfully);
                            this.loadListMail();
                        }
                    });
                }
            });
        } catch (ex) {
            console.log(ex);
        } finally {
            App.instance.showLoading2(false);
        }
    }

    actSwitchDetail(enabled) {
        this.nodeListMail.active = !enabled;
        this.nodeMailContent.active = enabled;
    }

    actBackToListMail() {
        this.loadListMail();
        this.actSwitchDetail(false);
    }

    actClosePopupMailBox(event) {
        event.currentTarget.off(cc.Node.EventType.TOUCH_END);
        LobbyLobbyController._instance.loadListMail();
        LobbyLobbyController._instance.actClosePopup(this.node);
    }
}
