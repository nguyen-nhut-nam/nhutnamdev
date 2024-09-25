import App from "../../../../scripts/common/App";
import Http from "../../../../scripts/common/Http";
import Configs from "../../../../scripts/common/Configs";
import ApiIDEnum from "../enum/ApiIDEnum";
import Utils from "../../../../scripts/common/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    lblOwnerName = null;
    @property(cc.Label)
    lblOwnerNumber = null;
    @property(cc.Label)
    lblTransferContent = null;
    @property(cc.Node)
    nodeQRCode = null;

    actSelectWallet(event, data) {

    }

    protected onEnable() {
        try {
            Http.get(Configs.App.API, {"c": ApiIDEnum.CHARGE_MOMO_DETAIL, "at": Configs.Login.AccessToken}, (err, res) => {
                if (err != null) {
                    App.instance.actShowThongBao2("Tạo giao dịch lỗi");
                    return;
                }
                this.lblOwnerName.string = res.phoneName;
                this.lblOwnerNumber.string = res.phoneNum;
                this.lblTransferContent.string = res.code;
                this.nodeQRCode.getComponent('CQRCode').string = this.getQRCode(res.phoneNum, res.code);
            });
        } catch(ex) {
            console.log(ex);
            App.instance.showLoading2(false);
        }
    }

    actCopyWalletNumber() {
        if(this.lblOwnerNumber.string.trim().length === 0) {
            App.instance.actShowThongBao('Không có dữ liệu');
            return;
        }
        App.instance.actShowThongBao('Sao chép thành công');
        Utils.copyTextToClipboard(this.lblOwnerNumber.string);
    }

    actCopyWalletContent() {
        if(this.lblTransferContent.string.trim().length === 0) {
            App.instance.actShowThongBao('Không có dữ liệu');
            return;
        }
        App.instance.actShowThongBao('Sao chép thành công');
        Utils.copyTextToClipboard(this.lblTransferContent.string);
    }

    getQRCode(phoneNumber, transferContent) {
        let qrCodeText = `2|99|${phoneNumber}|${phoneNumber}|${phoneNumber}|0|0|10000|${transferContent}`;
        return qrCodeText;
    }
}
