const {ccclass, property} = cc._decorator;
@ccclass
export default class ShopTabEnum extends cc.Component {

    public static AUTO_BANK:string = "AUTOBANK";

    public static WALLET:string = "WALLET";

    public static COIN:string = "COIN";

    public static CARD:string = "CARD";

    public static GIFTCODE:string = "GIFTCODE";
}
