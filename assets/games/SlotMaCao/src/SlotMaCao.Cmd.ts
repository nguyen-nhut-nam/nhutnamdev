import OutPacket from "../../../scripts/networks/Network.OutPacket";
import InPacket from "../../../scripts/networks/Network.InPacket";

const { ccclass } = cc._decorator;

export namespace cmd {
    export class Code {
        static SUBCRIBE = 8003;
        static UNSUBCRIBE = 8004;
        static CHANGE_ROOM = 8005;
        static PLAY = 8001;
        static UPDATE_RESULT = 8001;
        static UPDATE_POT = 8002;
        static AUTO = 8006;
        static STOP_AUTO = 8006;
        static FORCE_STOP_AUTO = 8008;
        static GAME_INFO = 8009;
        static BIG_WIN = 8010;
        static FREE = 8011;
        static FREE_DAI_LY = 8012;
        static MINIMIZE = 8013;
    }
    export class SendSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }
    export class SendUnSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }
    export class SendPlay extends OutPacket {
        constructor(lines: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.PLAY);
            this.packHeader();
            this.putString(lines);
            this.updateSize();
        }
    }
    export class SendChangeRoom extends OutPacket {
        constructor(roomLeavedId: number, roomJoinedId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_ROOM);
            this.packHeader();
            this.putByte(roomLeavedId);
            this.putByte(roomJoinedId);
            this.updateSize();
        }
    }
    export class ReceiveUpdatePot extends InPacket {
        value100 = 0;
        value1000 = 0;
        value5000 = 0;
        value10000 = 0;
        x2Room100 = 0;
        x2Room1000 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.value100 = this.getLong();
            this.value1000 = this.getLong();
            this.value5000 = this.getLong();
            this.value10000 = this.getLong();
            this.x2Room100 = this.getByte();
            this.x2Room1000 = this.getByte();
        }
    }
    export class ReceiveResult extends InPacket {
        referenceId = 0;
        result = 0;
        matrix = "";
        linesWin = "";
        haiSao = "";
        prize = 0;
        currentMoney = 0;
        freeSpin = 0;
        isFreeSpin = false;

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.result = this.getByte();
            this.matrix = this.getString();
            this.linesWin = this.getString();
            this.haiSao = this.getString();
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
            this.freeSpin = this.getByte();
            this.isFreeSpin = this.getBool();
        }
    }

    export class ReceiveGameInfo extends InPacket {
        ngayX2 = "";
        remain = 0;
        currentMoney = 0;
        freeSpin = 0;
        lines = "";

        constructor(data: Uint8Array) {
            super(data);
            this.ngayX2 = this.getString();
            this.remain = this.getByte();
            this.currentMoney = this.getLong();
            this.freeSpin = this.getByte();
            this.lines = this.getString();
        }
    }
}
export default cmd;