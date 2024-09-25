const {ccclass, property} = cc._decorator;

@ccclass
export default class GameSuccessMessage extends cc.Component {

    public static COPY_SUCCESSFULLY: string = "Sao chép thành công";

    public static WITHDRAW_SUCCESSFULLY: string = 'Rút tiền thành công, vui lòng chờ';

    public static GET_OTP_SUCCESSFULLY: string = "Lấy OTP thành công.";
}
