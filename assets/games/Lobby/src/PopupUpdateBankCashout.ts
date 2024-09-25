import Dialog from "../../../scripts/common/Dialog";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import Dropdown from "../../../scripts/common/Dropdown";

const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupUpdateBankCashout extends Dialog {

        @property(Dropdown)
        dropdownBank: Dropdown = null;

        @property(cc.EditBox)
        edbBankAccountName: cc.EditBox = null;

        @property(cc.EditBox)
        edbBankNumber: cc.EditBox = null;

        private _listBank = [];

        show() {
            super.show();
        }

        start() {
            App.instance.showLoading2(true);
            Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                App.instance.showLoading2(false);
                if (err == null) {
                    if(res.list_bank_cashout === undefined || res.list_bank_cashout.length == 0){
                        return;
                    }
                    let listBank = res.list_bank_cashout;
                    this._listBank = listBank;
                    let bankName = [];
                    for(let i = 0; i < listBank.length; i ++){
                        bankName.push(listBank[i].bankName);
                    }
                    this.dropdownBank.setOptions(bankName);
                }
            });
        }

        public actUpdate() {
            let _this = this;
            let ddBank = this.dropdownBank.getValue();
            let bankSelected = this._listBank[ddBank].bankName;

            let bankActName = App.instance.cleanAccents(this.edbBankAccountName.string.trim());
            if(bankActName == ""){
                App.instance.alertDialog.showMsg("Vui lòng nhập tên tài khoản");
                return;
            }
            let bankNumber = this.edbBankNumber.string.trim();
            if(bankNumber == ""){
                App.instance.alertDialog.showMsg("Vui lòng nhập số tài khoản!");
                return;
            }
            App.instance.showLoading2(true);
            Http.get(Configs.App.API, { "c": 4051, "nickname": Configs.Login.Nickname, "bankname": bankActName.split(' ').join('_'), "banknumber": bankNumber, "bankbran": bankSelected   }, (err, res) => {
                App.instance.showLoading2(false);
                if (err == null) {
                    console.log(res);
                }
                _this.dismiss();
            });
        }
    }
}
export default Lobby.PopupUpdateBankCashout;
