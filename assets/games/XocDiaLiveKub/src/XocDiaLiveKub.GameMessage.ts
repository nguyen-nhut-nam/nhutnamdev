const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubGameMessage extends cc.Component {

    public static NOT_ENOUGH_BALANCE: string = 'Bạn không đủ tiền để tham gia phòng!';

    public static MAINTENANCE: string = 'Hệ thống đang tạm thời bảo trì!';

    public static KICKED: string = 'Bạn bị mời ra khỏi phòng vì quá lâu không tương tác!';

    public static NOT_ENOUGH_BALANCE_TO_BET: string = 'Số dư của bạn không đủ để đặt cược!';

    public static WAIT_FOR_NEW_SESSION: string = "Vui lòng chờ phiên mới";
}
