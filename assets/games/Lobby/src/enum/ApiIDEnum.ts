const {ccclass, property} = cc._decorator;

@ccclass
export default class ApiIDEnum extends cc.Component {
    public static USER_REGISTER: number = 1;
    public static UPDATE_NICKNAME: number = 5;
    public static CHECK_NICKNAME_VALID: number = 17;
    public static GET_BANK_INFORMATION: number = 4050;
    public static SAVE_BANK_INFORMATION: number = 4051;
    public static CASH_OUT_BANK: number = 4052;
    public static CASH_OUT_CARD: number = 4088;
    public static CASH_OUT_BANK_POST: number = 44052;
    //Mailbox
    public static GET_MAIL: number = 402;
    public static DELETE_MAIL: number = 403;
    public static READ_MAIL: number = 404;

    //INSERT GIFTCODE
    public static INSERT_GIFT_CODE: number = 4109;

    //Charge auto bank
    public static LIST_CHARGE_AUTO_BANK: number = 4114;
    public static CHARGE_AUTO_BANK_DETAIL: number = 4115;
    public static GET_SUPPORTED_WITHDRAW_BANK: number = 4116;
    //Withdraw
        //withdraw bank
    public static SAVE_USER_WITHDRAWAL_BANK: number = 4110;
    public static GET_USER_WITHDRAWAL_BANK: number = 4111;
        //withdraw momo
    public static SAVE_WITHDRAW_MOMO: number = 4117;
    public static GET_WITHDRAW_MOMO: number = 4118;
    public static SAVE_USER_WITHDRAWAL_MOMO: number = 4120;
    public static GET_USER_WITHDRAWAL_MOMO: number = 4121;

    public static CHARGE_MOMO_DETAIL: number = 4039;
    public static CHARGE_CARD: number = 4087;

    public static GAME_CONFIG: number = 130;

    public static CREATE_DEFAULT_NAME: number = 4051;
    //GET SOCIAL NETWORK URL
    public static GET_URL_LINK: number = 4112;
    //VERIFY ACTIVE OTP TELEGRAM
    public static VERIFY_OTP: number = 4119;
    public static GET_PHONE_OTP: number = 4123;//GET PHONE OTP
    public static VERIFY_PHONE_OTP: number = 4124; // VERIFY PHONE OTP
    public static QUICK_OTP_TELEGRAM: number = 4125;
}
