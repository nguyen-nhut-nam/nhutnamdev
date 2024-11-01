const {ccclass, property} = cc._decorator;

@ccclass
export default class GameErrorMessage extends cc.Component {
    //Account
    public static ACCOUNT_LOCKED: string = "Tài khoản của bạn đã bị khóa.";
    public static LOGIN_OTHER_DEVICE: string = 'Tài khoản đã được đăng nhập ở thiết bị khác.';
    public static LOGIN_FAILED: string = 'Đăng nhập không thành công vui lòng thử lại sau.';
    public static WRONG_LOGIN_INFORMATION: string = 'Thông tin đăng nhập không hợp lệ.';
    public static NOT_LOGINED: string = 'Bạn chưa đăng nhập.';
    public static NICKNAME_NOT_ENOUGH_LENGTH: string = 'Tên nhân vật tối thiểu 6 ký tự.';
    public static PASSWORD_NOT_ENOUGH_LENGTH: string = "Mật khẩu tối thiểu 6 ký tự.";
    public static TWO_PASSWORD_NOT_MATCH: string = "Hai mật khẩu không khớp.";
    public static NOT_ENOUGH_BALANCE: string = 'Số dư không đủ';
    public static USERNAME_NOT_ENOUGH_LENGTH: string = "Tên đăng nhập tối thiểu 6 ký tự.";
    public static NICKNAME_MUST_BE_UNIQUE: string = "Tên hiển thị không được trùng với tên đăng nhập.";
    //Charge
    public static INVALID_CARD_VALUE: string = 'Vui lòng chọn mệnh giá thẻ';

    //Withdraw
    public static INVALID_WITHDRAW_AMOUNT_VALUE: string = 'Số tiền rút không hợp lệ';

    public static NO_BANK_NUMBER_FILLED: string = 'Vui lòng nhập số tài khoản!';
    public static NO_BANK_ACCOUNT_FILLED: string = 'Vui lòng nhập tên tài khoản';
    public static INVALID_OTP: string = 'Mã OTP không hợp lệ.';
    public static NO_BANK_SELECTED: string = 'Vui lòng chọn ngân hàng';

    //GAME
    public static NOT_SELECT_LINES: string = 'Vui lòng chọn dòng cược.';

    //TRANSFER USER TO USER
    public static NICKNAME_BLANK: string = 'Nickname không được để trống.';
    public static TRANSFER_NOTE_BLANK: string = 'Lý do chuyển khoản không được để trống.';
    public static TRANSFER_AMOUNT_MIN_DESCRIPTION: string = 'Số tiền giao dịch tối thiểu 1.000';
    public static ACCOUNT_BAN_TRANSFER: string = 'Tài khoản bị cấm chuyển tiền.';
    public static NICKNAME_NOT_EXISTED: string = 'Nickname không tồn tại.';

}
