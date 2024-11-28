const {ccclass, property} = cc._decorator;

@ccclass
export default class ToastMessage extends cc.Component {
    //TAIXIU
    public static TAI_XIU_CHAT_CHAT_FAST:string = "Bạn Chat Quá Nhanh. Thử lại sau vài giây.";

    public static TAI_XIU_CHAT_CHAT_TOO_LONG: string = "Câu Chat Quá Dài";

    public static TAI_XIU_CHAT_CANNOT_CHAT: string = "Bạn Không Thể Chat Vào Lúc Này";

    public static TAI_XIU_CHAT_TOO_LONG: string = "Nội dung chat quá dài.";
    //XOCDIA

    public static XOCDIA_START_SESSION: string = "Bắt đầu phiên mới";

    public static XOCDIA_START_BET: string = "Xin mời đặt cược";

    public static XOCDIA_STOP_BET: string = "Dừng đặt cược";

    public static XOCDIA_REWARD: string = "Bắt đầu trả thưởng";

    public static XOCDIA_OPEN_BOWL: string = "Mở bát";
}
