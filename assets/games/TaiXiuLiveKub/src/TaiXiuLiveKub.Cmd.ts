import OutPacket from "../../../scripts/networks/Network.OutPacket";
import Configs from "../../../scripts/common/Configs";
import InPacket from "../../../scripts/networks/Network.InPacket";

const { ccclass, property } = cc._decorator;

export namespace cmd {
    export class Code {
        static SCRIBE = 2000;
        static UNSCRIBE = 2001;
        static BET = 2110;
        static HISTORIES = 2116;
        static GAME_INFO = 2111;
        static UPDATE_TIME = 2112;
        static DICES_RESULT = 2113;
        static RESULT = 2114;
        static NEW_GAME = 2115;
        static LOG_CHAT = 19003;
        static SEND_CHAT = 19000;
        static SCRIBE_CHAT = 19001;
        static UNSCRIBE_CHAT = 19002;
    }
    // todo : gửi request vào phòng
    export class SendScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiu);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }
    // gửi request rời phòng
    export class SendUnScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiu);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }
    // gởi request chat
    export class SendScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE_CHAT);
            this.packHeader();
            this.updateSize();
        }
    }
    // thoát chat
    export class SendUnScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE_CHAT);
            this.packHeader();
            this.updateSize();
        }
    }
    // gửi message 
    export class SendChat extends OutPacket {
        constructor(message: string, type, money = 0) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEND_CHAT);
            this.packHeader();
            this.putString(message);
            this.putShort(type);
            this.putLong(money);
            this.updateSize();
        }
    }
    // gửi lệnh lên server là bet với value nào đó và referenceId là gì đó , cửa nào 
    export class SendBet extends OutPacket {
        constructor(referenceId: number, betValue: number, door: number, remainTime: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BET);
            this.packHeader();
            this.putInt(1);
            this.putLong(referenceId);
            this.putLong(betValue);
            this.putShort(Configs.App.MONEY_TYPE);
            this.putShort(door);
            this.putShort(remainTime);
            this.updateSize();
        }
    }

    export class ReceiveGameInfo extends InPacket {
        gameId = 0;
        moneyType = 0;
        referenceId = 0;
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        betTai = 0;
        betXiu = 0;
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        remainTimeRutLoc = 0;
        moneyHu = 0;

        potChan = 0;
        potLe = 0;
        betChan = 0;
        betLe = 0;
        streamURL = "";
        currentSessionDateTime = "";

        constructor(data: Uint8Array) {
            super(data);
            this.gameId = this.getShort();
            this.moneyType = this.getShort();
            this.referenceId = this.getLong();
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.betTai = this.getLong();
            this.betXiu = this.getLong();

            this.potChan = this.getLong();
            this.potLe = this.getLong();
            this.betChan = this.getLong();
            this.betLe = this.getLong();

            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();
            this.remainTimeRutLoc = this.getShort();
            this.moneyHu = this.getLong();
            this.streamURL = this.getString();
            this.currentSessionDateTime = this.getString();
        }
    }

    export class ReceiveUpdateTime extends InPacket {
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        potChan = 0;
        potLe = 0;
        numBetTai = 0;
        numBetXiu = 0;
        numBetChan = 0;
        numBetLe = 0;
        moneyhu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.potChan = this.getLong();
            this.potLe = this.getLong();
            this.numBetTai = this.getLong();
            this.numBetXiu = this.getLong();
            this.numBetChan = this.getLong();
            this.numBetLe = this.getLong();
            this.moneyhu = this.getLong();
        }
    }

    export class ReceiveDicesResult extends InPacket {
        result = 0;
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getShort();
            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();
        }
    }

    export class ReceiveResult extends InPacket {
        moneyType = 1;
        totalMoney = 0;
        currentMoney = 0;
        moneyHu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyType = this.getShort();
            this.totalMoney = this.getLong();
            this.currentMoney = this.getLong();
            this.moneyHu = this.getLong()
        }
    }

    export class ReceiveNewGame extends InPacket {
        referenceId = 0;
        moneyHu = 0;
        remainTimeRutLoc = 0;
        currentSessionDateTime = "";
        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.moneyHu = this.getLong();
            this.remainTimeRutLoc = this.getShort();
            this.currentSessionDateTime = this.getString();
        }
    }

    export class ReceiveHistories extends InPacket {
        data = "";

        constructor(data: Uint8Array) {
            super(data);
            this.data = this.getString();
        }
    }

    export class ReceiveBet extends InPacket {
        result = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getError();
            this.currentMoney = this.getLong();
        }
    }

    export class ReceiveLogChat extends InPacket {
        message = "";
        minVipPoint = 0;
        timeBan = 0;
        userType = 0;
        chatMinRequired = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.message = this.getString();
            this.minVipPoint = this.getByte();
            this.timeBan = this.getLong();
            this.userType = this.getByte();
            this.chatMinRequired = this.getInt();
        }
    }

    export class ReceiveSendChat extends InPacket {
        error = 0;
        nickname = "";
        message = "";
        type = 0;
        money = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.nickname = this.getString();
            this.message = this.getString()
            this.type = this.getShort();
            this.money = this.getLong();
        }
    }
}
export default cmd;