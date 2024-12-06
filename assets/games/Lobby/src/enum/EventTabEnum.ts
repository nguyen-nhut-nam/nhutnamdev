const {ccclass, property} = cc._decorator;

@ccclass
export default class EventTabEnum extends cc.Component {

    public static CHARGE_EVENT: string = "CHARGE";

    public static CHARGE_WITHDRAW_RULE: string = "CHARGE_RULE";
}
