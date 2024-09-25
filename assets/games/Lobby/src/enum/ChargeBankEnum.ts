const {ccclass, property} = cc._decorator;

@ccclass
export default class ChargeBankEnum extends cc.Component {

    public static CHARGE_BANK_NUMBER: string = "NUMBER";

    public static CHARGE_BANK_QR: string = 'QR';
}
