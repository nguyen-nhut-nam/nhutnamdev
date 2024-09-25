const {ccclass, property} = cc._decorator;

@ccclass
export default class TabWithdrawCoin extends cc.Component {

    @property(cc.EditBox)
    edbWalletAddress = null;
    @property(cc.EditBox)
    edbWithdrawAmount = null;
    @property(cc.Label)
    lblExchangeRate = null;

    private _selectedWalletID = 0;
    actChangeWallet(event, data) {
        this._selectedWalletID = parseInt(data);
    }

    actWithdrawByCoin() {

    }
}
