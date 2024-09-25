import InPacket from "../../scripts/networks/Network.InPacket";
import OutPacket from "../../scripts/networks/Network.OutPacket";
import Configs from "../../scripts/common/Configs";

export namespace cmd {
    export class Code {
        static readonly UPDATE_TIME_BUTTON = 2124;
        static readonly INSERT_GIFTCODE = 20017;
        static readonly DEPOSIT_CARD = 20012;
        static readonly CHECK_NICKNAME_TRANSFER = 20018;
        static readonly SUBCRIBE_HALL_SLOT = 10001;
        static readonly UNSUBCRIBE_HALL_SLOT = 10002;
        static readonly UPDATE_JACKPOT_SLOTS = 10003;
        static readonly SPIN_LUCKY_WHEEL = 20042;
        static readonly GET_SECURITY_INFO = 20050;
        static readonly UPDATE_USER_INFO = 20002;
        static readonly GET_OTP = 20220;
        //oke here
        static readonly SEND_OTP = 20019;
        static readonly TRANSFER_MONEY_TO_DAILY = 20301;
        static readonly RESULT_ACTIVE_MOBILE = 20026;
        static readonly RESULT_ACTIVE_NEW_MOBILE = 20028;
        static readonly RESULT_CHANGE_MOBILE_ACTIVED = 20027;
        static readonly ACTIVE_PHONE = 20006;
        static readonly CHANGE_PHONE_NUMBER = 20007;
        static readonly TRANSFER_COIN = 20014;
        static readonly TRANSFER_COIN_TO_AN_USER = 20222;
        static readonly RESULT_TRANSFER_COIN = 20034;
        static readonly SAFES = 20009;
        static readonly RESULT_SAFES = 20029;
        static readonly CHANGE_PASSWORD = 20000;
        static readonly RESULT_CHANGE_PASSWORD = 20020;
        static readonly EXCHANGE_VIP_POINT = 20001;
        static readonly RESULT_EXCHANGE_VIP_POINT = 20021;
        static readonly NOTIFY_MARQUEE = 20100;
        static readonly UPDATE_JACKPOTS = 20101;
        static readonly UPDATE_BAU_CUA_JACKPOTS = 20111;
        static readonly UPDATE_TX_JACKPOTS = 20112;
        static readonly UPDATE_TX_MD5_JACKPOTS = 20113;
        static readonly SUBCRIBE_JACPORTS = 20102;
        static readonly UNSUBCRIBE_JACPORTS = 20103;
        static readonly GET_MONEY_USE = 20051;
        static readonly DEPOSIT_BANK = 20201;
        static readonly DEPOSIT_MOMO = 20202;
        static readonly DEPOSIT_MOMO_SUBMIT = 20203;
        static readonly DEPOSIT_OnePayBANK = 20205;
        static readonly DEPOSIT_OTP_OnePayBANK = 20206;
        static readonly DEPOSIT_WAIT_OTP_OnePayBANK = 20299;
        static readonly DEPOSIT_NEED_SUBMIT_OTP_OnePayBANK = 20298;
        static readonly DEPOSIT_SUBMIT_OTP_OnePayBANK = 20297;
        static readonly DEPOSIT_ONEPAY_ACTION = 20290;
        static readonly DEPOSIT_UPDate_Trans_OnePayBANK = 20230;
        static readonly MONEY_CHANGE = 20333;
        static readonly CASHOUT_CARD = 20211;
        static readonly CASHOUT_BANK = 20219;
        static readonly CASHOUT_MOMO = 20215;
        static readonly GET_PHONE_NUMBER = 20221;
        static readonly NOTIFY_NO_HU  = 14022;
        static readonly CREATE_SECRET_CODE  = 20302;
        static readonly DEPOSIT_CODE_PAY = 20218;
        static readonly TIME_CHANGE = 20444;

        static readonly OUTGAME = 21444;
        static readonly LOGIN_OTHER_DEVICE = 20114;
    }

    export class ReceiveUpdateTimeButton extends InPacket {
        remainTime = 0;
        bettingState = false;

        constructor(data: Uint8Array) {
            super(data);
            this.remainTime = this.getByte();
            this.bettingState = this.getBool();
        }
    }

    export class ReqCreateSecretCode extends OutPacket {
        constructor( code :string , password: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CREATE_SECRET_CODE);
            this.packHeader();
            this.putString(code);
            this.putString(password);
            this.updateSize();
        }
    }

    export class ResSecretCode extends InPacket {
        stepcode = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.stepcode = this.getInt();
        }
    }

    export class ReqInsertGiftcode extends OutPacket {
        constructor(code: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.INSERT_GIFTCODE);
            this.packHeader();
            this.putString(code);
            this.updateSize();
        }
    }

    export class ResInsertGiftcode extends InPacket {
        error = 0;
        currentMoneyVin = 0;
        currentMoneyXu = 0;
        moneyGiftCodeVin = 0;
        moneyGiftCodeXu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoneyVin = this.getLong();
            this.currentMoneyXu = this.getLong();
            this.moneyGiftCodeVin = this.getLong();
            this.moneyGiftCodeXu = this.getLong();
        }
    }

    export class ReqDepositCard extends OutPacket {
        constructor(telcoId: number, serial: string, code: string, amount: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_CARD);
            this.packHeader();
            this.putByte(telcoId);
            this.putString(serial);
            this.putString(code);
            this.putString(amount);
            this.updateSize();
        }
    }
    export class ReqDepositBank extends OutPacket {
        constructor(bankNumber: string, amount: number, sender: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_BANK);
            this.packHeader();
            this.putString(bankNumber)
            this.putLong(amount);
            this.putString(sender)
            this.updateSize();
        }
    }

    export class ReqDepositCodePay extends OutPacket {
        constructor(bank: string, cardName: string, cardCode: string, ver= "new") {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_CODE_PAY);
            this.packHeader();
            this.putString(bank)
            this.putString(cardName);
            this.putString(cardCode)
            this.putString(ver)
            this.updateSize();
        }
    }

    export class ReqDepositOnepayBank extends OutPacket {
        constructor(bankNumber: string, amount: number, bankPassword: string, bankName: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_OnePayBANK);
            this.packHeader();
            this.putString(bankNumber)
            this.putLong(amount);
            this.putString(bankPassword);
            this.putString(bankName);
            this.updateSize();
        }
    }
    export class ReqOTPOnepayBank extends OutPacket {
        constructor(otp: string, transId: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_SUBMIT_OTP_OnePayBANK);
            this.packHeader();
            this.putString(otp);
            this.putString(transId);
            this.updateSize();
        }
    }
    export class ResMoneyChange extends InPacket {

        moneyCurrent = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.moneyCurrent = this.getLong();
        }
    }

    export class ResTimeChange extends InPacket {

        time = 1;
        error = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.time = this.getInt();
        }
    }


    export class ResDepositOnepayBank extends InPacket {
        error = 0;

        transId = "";
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.transId = this.getString();
        }
    }

    export class ResDepositOnepayOtpCmd extends InPacket {
        transId = "";
        techcombankTrans = ""
        constructor(data: Uint8Array) {
            super(data);
            this.transId = this.getString();
            this.techcombankTrans = this.getString();
        }
    }

    export class ResOnePayAction extends InPacket {
        code_step = 0;
        currentMoney = 0;
        techcombankTrans = "";
        constructor(data: Uint8Array) {
            super(data);
            this.code_step = this.getInt();
            this.currentMoney = this.getLong();
            this.techcombankTrans = this.getString();
        }
    }

    export class ReqDepositTransactionOnepayBank extends OutPacket {
        constructor(transId: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_UPDate_Trans_OnePayBANK);
            this.packHeader();
            this.putString(transId)
            this.updateSize();
        }
    }

    export class ReqDepositOTPOnepayBank extends OutPacket {
        constructor(otp: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_OTP_OnePayBANK);
            this.packHeader();
            this.putString(otp)
            this.updateSize();
        }
    }

    // vieest them response
    export class ResDepositBank extends InPacket {
        error = 0;
        currentMoney = 0;
        timeFail = 0;
        numFail = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.timeFail = this.getLong();
            this.numFail = this.getInt();
        }
    }

    export class ResDepositCodepay extends InPacket {
        error = 0;
        comment = '';
        transId = '';
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.comment = this.getString();
            this.transId = this.getString();
        }
    }

    export class ReqDepositMomo extends OutPacket {
        constructor(amount: number, phoneSent: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_MOMO);
            this.packHeader();

            this.putLong(amount);
            this.putString(phoneSent);
            this.updateSize();
        }
    }

    export class ReqDepositDoneMomo extends OutPacket {
        constructor(amount: number, phoneSent: string, transId: String, name: String, phoneReceiver: String, comment: String) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_MOMO_SUBMIT);
            this.packHeader();

            this.putLong(amount);
            this.putString(phoneSent);
            this.putString(transId);
            this.putString(name);
            this.putString(phoneReceiver);
            this.putString(comment);
            this.updateSize();
        }
    }


    export class ResDepositMomo extends InPacket {
        error = 0;
        currentMoney = 0;
        code = 0;
        name = "";
        receiverPhone = "";
        comment = "";
        transId = "";
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.code = this.getInt();
            this.name = this.getString();
            this.receiverPhone = this.getString();
            this.comment = this.getString();
            this.currentMoney = this.getLong();
            this.transId = this.getString();

        }
    }

    export class ResDepositCard extends InPacket {
        error = 0;
        currentMoney = 0;
        timeFail = 0;
        numFail = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.timeFail = this.getLong();
            this.numFail = this.getInt();
        }
    }

    export class ReqCheckNicknameTransfer extends OutPacket {
        constructor(nickname: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHECK_NICKNAME_TRANSFER);
            this.packHeader();
            this.putString(nickname);
            this.updateSize();
        }
    }

    export class ResCheckNicknameTransfer extends InPacket {
        error = 0;
        type = 0;
        fee = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.type = this.getByte();
            this.fee = this.getByte();
        }
    }

    export class ReqSpinLuckyWheel extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SPIN_LUCKY_WHEEL);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResSpinLuckyWheel extends InPacket {
        error = 0;
        prizeVin = "";
        prizeXu = "";
        prizeSlot = "";
        remainCount = 0;
        currentMoneyVin = 0;
        currentMoneyXu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.prizeVin = this.getString();
            this.prizeXu = this.getString();
            this.prizeSlot = this.getString();
            this.remainCount = this.getShort();
            this.currentMoneyVin = this.getLong();
            this.currentMoneyXu = this.getLong();
        }
    }

    export class ReqGetSecurityInfo extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_SECURITY_INFO);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResGetSecurityInfo extends InPacket {
        error = 0;
        username = "";
        cmt = "";
        email = "";
        mobile = "";
        mobileSecure = 0;
        emailSecure = 0;
        appSecure = 0;
        loginSecure = 0;
        moneyLoginOtp = 0;
        moneyUse = 0;
        safe = 0;
        configGame = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.username = this.getString();
            this.cmt = this.getString();
            this.email = this.getString();
            this.mobile = this.getString();
            this.mobileSecure = this.getByte();
            this.emailSecure = this.getByte();
            this.appSecure = this.getByte();
            this.loginSecure = this.getByte();
            this.moneyLoginOtp = this.getLong();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
            this.configGame = this.getString();
        }
    }

    export class ReqUpdateUserInfo extends OutPacket {
        constructor(phoneNumber: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UPDATE_USER_INFO);
            this.packHeader();
            this.putString("");
            this.putString("");
            this.putString(phoneNumber);
            this.updateSize();
        }
    }
    export class ResUpdateUserInfo extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqGetOTP extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_OTP);
            this.packHeader();
            this.updateSize();
        }
    }


    export class ReqCheckPhone extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_PHONE_NUMBER);
            this.packHeader();
            this.updateSize();
        }
    }


    export class ResGetOTP extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResCheckPhone extends InPacket {
        error = 0;
        phoneNumber = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.phoneNumber = this.getLong();
        }
    }


    export class ReqSendOTP extends OutPacket {
        constructor(otp: string, type: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEND_OTP);
            this.packHeader();
            this.putString(otp);
            this.putByte(type);//0: sms, 1: telegram
            this.updateSize();
        }
    }



    export class TransferMoneyToDaiLy extends OutPacket {
        constructor(userReceiver: string, moneyExchange: number, description: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TRANSFER_MONEY_TO_DAILY);
            this.packHeader();
            this.putLong(moneyExchange);
            this.putString(userReceiver);
            this.putString(description);
            this.putString(Configs.App.secretCode);
            this.updateSize();
        }
    }


    export class ResTransferMoneyToDaiLy extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResSendOTP extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResResultActiveMobie extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResResultActiveNewMobie extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqChangePhoneNumber extends OutPacket {
        constructor(phoneNumber: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_PHONE_NUMBER);
            this.packHeader();
            this.putString(phoneNumber);
            this.updateSize();
        }
    }
    export class ResChangePhoneNumber extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqActivePhone extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.ACTIVE_PHONE);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResActivePhone extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqTransferCoin extends OutPacket {
        constructor(nickname: string, coin: number, note: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TRANSFER_COIN);
            this.packHeader();
            this.putString(nickname);
            this.putLong(coin);
            this.putString(unescape(encodeURIComponent(note)));
            this.updateSize();
        }
    }

    export class ReqTransferCoinToAnUser extends OutPacket {
        constructor(nickname: string, coin: number, note: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TRANSFER_COIN_TO_AN_USER);
            this.packHeader();
            this.putString(nickname);
            this.putLong(coin);
            this.putString(unescape(encodeURIComponent(note)));
            this.putString(Configs.App.secretCode);
            this.updateSize();
        }
    }

    export class ResTransferCoin extends InPacket {
        error = 0;
        moneyUse = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
        }
    }
    export class ResResultTransferCoin extends InPacket {
        error = 0;
        moneyUse = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReqSafes extends OutPacket {
        constructor(coin: number, action: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SAFES);
            this.packHeader();
            this.putByte(action);//0: rút, 1: nạp
            this.putLong(coin);
            this.updateSize();
        }
    }
    export class ResSafes extends InPacket {
        error = 0;
        moneyUse = 0;
        safe = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
        }
    }
    export class ResResultSafes extends InPacket {
        error = 0;
        moneyUse = 0;
        safe = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReqChangePassword extends OutPacket {
        constructor(oldPassword: string, newPassword: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_PASSWORD);
            this.packHeader();
            this.putString(md5(oldPassword));
            this.putString(md5(newPassword));
            this.updateSize();
        }
    }
    export class ResChangePassword extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }
    export class ResResultChangePassword extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqExchangeVipPoint extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.EXCHANGE_VIP_POINT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResExchangeVipPoint extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }
    export class ResResultExchangeVipPoint extends InPacket {
        error = 0;
        currentMoney = 0;
        moneyAdd = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.moneyAdd = this.getLong()
        }
    }

    export class ResNotifyMarquee extends InPacket {
        message = "";

        constructor(data: Uint8Array) {
            super(data);
            this.message = this.getString();
        }
    }

    export class ReqSubcribeJackpots extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_JACPORTS);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ReqUnSubcribeJackpots extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE_JACPORTS);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResUpdateJackpots extends InPacket {
        miniPoker100 = 0;
        miniPoker1000 = 0;
        miniPoker10000 = 0;
        pokeGo100 = 0;
        pokeGo1000 = 0;
        pokeGo10000 = 0;
        khoBau100 = 0;
        khoBau1000 = 0;
        khoBau10000 = 0;
        NDV100 = 0;
        NDV1000 = 0;
        NDV10000 = 0;
        Avengers100 = 0;
        Avengers1000 = 0;
        Avengers10000 = 0;
        Vqv100 = 0;
        Vqv1000 = 0;
        Vqv10000 = 0;
        fish100 = 0;
        fish1000 = 0;

        //spartan
        spartan100 = 0;
        spartan1000 = 0;
        spartan5000 = 0;
        spartan10000 = 0;
        baucuato = 0;
        huTX = 0;
        txTai = 0;
        txXiu = 0;

        caoThap1000 = 0;
        caoThap10000 = 0;
        caoThap50000 = 0;
        caoThap100000 = 0;
        caoThap500000 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.miniPoker100 = this.getLong();
            this.miniPoker1000 = this.getLong();
            this.miniPoker10000 = this.getLong();
            this.pokeGo100 = this.getLong();
            this.pokeGo1000 = this.getLong();
            this.pokeGo10000 = this.getLong();
            this.khoBau100 = this.getLong();
            this.khoBau1000 = this.getLong();
            this.khoBau10000 = this.getLong();
            this.NDV100 = this.getLong();
            this.NDV1000 = this.getLong();
            this.NDV10000 = this.getLong();
            this.Avengers100 = this.getLong();
            this.Avengers1000 = this.getLong();
            this.Avengers10000 = this.getLong();
            this.Vqv100 = this.getLong();
            this.Vqv1000 = this.getLong();
            this.Vqv10000 = this.getLong();
            this.fish100 = this.getLong();
            this.fish1000 = this.getLong();
            //spartan game
            this.spartan100 = this.getLong();
            this.spartan1000 = this.getLong();
            this.spartan5000 = this.getLong();
            this.spartan10000 = this.getLong();
            this.baucuato = this.getLong();
            this.huTX = this.getLong();
            this.txTai = this.getLong();
            this.txXiu = this.getLong();

            this.caoThap1000 = this.getLong();
            this.caoThap10000 = this.getLong();
            this.caoThap50000 = this.getLong();
            this.caoThap100000 = this.getLong();
            this.caoThap500000 = this.getLong();
        }
    }
    export class ResUpdateBauCuaJackpots extends InPacket {

        baucuato = 0;
        txHu = 0;
        txTai = 0;
        txXiu = 0;
        constructor(data: Uint8Array) {
            super(data);

            this.baucuato = this.getLong();
            this.txHu = this.getLong();
            this.txTai = this.getLong();
            this.txXiu = this.getLong();

        }
    }

    export class ResNotifyNoHu extends InPacket {

        username = "";
        type = 0;
        totalPrizes = 0;
        gamename ="";
        constructor(data: Uint8Array) {
            super(data);
            this.username = this.getString();
            this.type = this.getByte();
            this.totalPrizes = this.getLong();
            this.gamename = this.getString();
        }
    }


    export class ResUpdateTXJackpots extends InPacket {

        txHu = 0;
        txTai = 0;
        txXiu = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.txHu = this.getLong();
            this.txTai = this.getLong();
            this.txXiu = this.getLong();

        }
    }

    export class ResUpdateTXMD5Jackpots extends InPacket {

        moneyHu = 0;
        moneyTai = 0;
        moneyXiu = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.moneyHu = this.getLong();
            this.moneyTai = this.getLong();
            this.moneyXiu = this.getLong();

        }
    }

    export class ReqGetMoneyUse extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_MONEY_USE);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResGetMoneyUse extends InPacket {
        moneyUse = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyUse = this.getLong();
        }
    }

    //slot
    export class ReqSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ReqUnSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResUpdateJackpotSlots extends InPacket {
        pots = "";

        constructor(data: Uint8Array) {
            super(data);
            this.pots = this.getString()
        }
    }

    // cashout class

    export class ReqCashoutCard extends OutPacket {
        constructor(telcoId: string, amount: number, quantity: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_CARD);
            this.packHeader();

            this.putString(telcoId);
            this.putInt(amount);
            this.putInt(quantity);
            this.putString(Configs.App.secretCode)
            this.updateSize();
        }
    }

    export class ResCashoutCard extends InPacket {
        error = 0;
        currentMoney = 0;
        listCard = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.listCard = this.getString();
        }
    }

    export class ReqCashoutBank extends OutPacket {
        constructor(bankName: string, bankNumber: string, bankActName: string, amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_BANK);
            this.packHeader();

            this.putString(bankName);
            this.putString(bankNumber);
            this.putString(bankActName);
            this.putInt(amount);
            this.putString(Configs.App.secretCode)
            this.updateSize();
        }
    }

    export class ResCashoutBank extends InPacket {
        error = 0;
        currentMoney = 0;
        //listCard = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            //this.listCard = this.getString();
        }
    }

    export class ReqCashoutMomo extends OutPacket {
        constructor(phoneNumber: string, amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_MOMO);
            this.packHeader();

            this.putString(phoneNumber);
            this.putInt(amount);
            this.updateSize();
        }
    }

    export class ResCashoutMomo extends InPacket {
        error = 0;
        currentMoney = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();

        }
    }

    export class ResLoginOtherDevice extends InPacket {
        text = "";

        constructor(data: Uint8Array) {
            super(data);
            this.text = this.getString();
        }
    }

}
export default cmd;
