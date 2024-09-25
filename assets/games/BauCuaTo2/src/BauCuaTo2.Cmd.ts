import OutPacket from "../../../scripts/networks/Network.OutPacket";
import InPacket from "../../../scripts/networks/Network.InPacket";

export namespace cmd {
    export class Code {
        static SCRIBE = 5001;
        static UNSCRIBE = 5002;
        static CHANGE_ROOM = 5003;
        static BET = 5004;
        static INFO = 5005;
        static START_NEW_GAME = 5007;
        static UPDATE = 5006;
        static RESULT = 5008;
        static WINEFFECT = 5010;
        static UPDATELISTUSER = 5011;
        static PRIZE = 5009;
        static LOGIN = 1;
        static CHAT_ROOM = 5018;
        static LICH_SU_NO_HU = 5019;
    }

    export class SendScribe extends OutPacket {
        constructor(betIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE);
            this.packHeader();
            this.putByte(betIdx);
            this.updateSize();
        }
    }

    export class SendUnScribe extends OutPacket {
        constructor(betIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE);
            this.packHeader();
            this.putByte(betIdx);
            this.updateSize();
        }
    }

    export class SendGetLichSu extends OutPacket {
        constructor(betIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LICH_SU_NO_HU);
            this.packHeader();
            this.putByte(betIdx);
            this.updateSize();
        }
    }


    export class SendChatRoom extends OutPacket{

        constructor(betIdx: number,a: number, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHAT_ROOM);
            this.packHeader();
            this.putByte(betIdx);
            this.putByte(a ? 1 : 0);
            this.putString(encodeURI(b));
            this.updateSize();
        }

    }
    export class SendChangeRoom extends OutPacket {
        constructor(oldBetIdx: number, newBetIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_ROOM);
            this.packHeader();
            this.putByte(oldBetIdx);
            this.putByte(newBetIdx);
            this.updateSize();
        }
    }

    export class SendBet extends OutPacket {
        constructor(betData: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BET);
            this.packHeader();
            this.putString(betData);
            this.updateSize();
        }
    }

    export class ReceiveBet extends InPacket {
        result = 0;
        currentMoney = 0;
        potId =-1 ;
        moneyBet =0 ;
        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getByte();
            this.currentMoney = this.getLong();
            this.potId = this.getByte();
            this.moneyBet = this.getLong();
        }
    }

    export class ReceivedChatRoom extends InPacket {
        isIcon: boolean;
        content: string;
        nickname: string;
        constructor(data: Uint8Array) {
            super(data);
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    export class ReceivedLichSuNoHu extends InPacket {
        rate =[] ;
        listTras =[]
        constructor(data: Uint8Array) {
            super(data);
          let sizeRate = this.getInt();
          for(let i =0 ; i< sizeRate ; i++){
              let potId = this.getInt();
              this.rate.push(potId);
          }
          let sizeTrans = this.getInt();
          for(let i =0 ; i< sizeTrans; i++){
              let obj : any ={};
              obj["session"] = this.getLong();
              obj["time"] = atob(this.getString());
              obj["potId"] = this.getInt();
              obj["totalMoney"] = this.getLong();
              
              let sizeUser = this.getInt();
              let listUser =[];
              for(let j=0 ; j< sizeUser ; j++){
                  let user : any ={};
                  user["userName"] =atob(this.getString());
                  user["moneyWin"] = this.getLong();
                  listUser.push(user);
              }
              obj["listUser"] = listUser;
              this.listTras.push(obj);
          }
        }
    }




    export class ReceiveInfo extends InPacket {
        referenceId = 0;
        remainTime = 0;
        bettingState = false;
        potData = "";
        betData = "";
        lichSuPhien = "";
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        xPot = 0;
        xValue = 0;
        room = 0;
        listUsers =[];
        funds =0;
        isNohu=false;
        listBets = [];
        totalBetTime = 0;
        remainBetTime = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.remainTime = this.getByte();
            this.bettingState = this.getBool();
            this.potData = this.getString();
            this.betData = this.getString();
            this.lichSuPhien = this.getString();
            this.dice1 = this.getByte();
            this.dice2 = this.getByte();
            this.dice3 = this.getByte();
            this.xPot = this.getByte();
            this.xValue = this.getByte();
            this.room = this.getByte();
            
            let sizelistUser = this.getInt();
            for(let i =0 ; i< sizelistUser ; i++){
                let obj :any ={};
                obj["username"] =this.getString();
                obj["currentMoney"] =this.getLong();
                obj["avatar"] =this.getString();
                this.listUsers.push(obj);
            }
            this.funds = this.getLong();
            this.isNohu = this.getBool();

            let sizeListTrans = this.getInt();
            for(let i=0 ; i < sizeListTrans; i++){
                let obj :any ={};
                obj["username"] =this.getString();
                obj["betStr"] =this.getString();
                this.listBets.push(obj);
            }
            this.totalBetTime = this.getByte();
            this.remainBetTime = this.getByte();
        }
    }

    export class ReceiveUpdateListUser extends InPacket{

        listUsers = [];
        constructor(data :Uint8Array){
            super(data);
            let sizelistUser = this.getInt();
            for(let i =0 ; i< sizelistUser ; i++){
                let obj :any ={};
                obj["username"] =this.getString();
                obj["currentMoney"] =this.getLong();
                obj["avatar"] =this.getString();
                this.listUsers.push(obj);
            }
        }
    }

    export class ReceiveNewGame extends InPacket {
        referenceId = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
        }
    }

    export class ReceiveUpdate extends InPacket {
        potData = "";
        remainTime = 0;
        bettingState = 0;
        listBets = [];
 
        constructor(data: Uint8Array) {
            super(data);
            this.potData = this.getString();
            this.remainTime = this.getByte();
            this.bettingState = this.getByte();
            let sizeList = this.getInt();
            for(let i =0 ; i< sizeList ; i++){
                let obj :any ={};
                obj["username"] =this.getString();
                obj["betStr"] =this.getString();
                this.listBets.push(obj);
            }

           
        }
    }


    export class ResultMsgWinEffect extends InPacket{

        listWins =[];
        funds =0;
        isNohu = false;
        constructor(data: Uint8Array) {
            super(data);
            let size = this.getInt();
            for(let i =0 ; i< size;i++){
                let object :any ={};
                object["username"] = this.getString();
                object["winMoney"] = this.getLong();
                object["currentMoney"] = this.getLong();
                this.listWins.push(object);
            }
            this.funds = this.getLong();
            this.isNohu = this.getBool();
            
        }

    }

    export class ReceiveResult extends InPacket {
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        xPot = 0;
        xValue = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.dice1 = this.getByte();
            this.dice2 = this.getByte();
            this.dice3 = this.getByte();
            this.xPot = this.getByte();
            this.xValue = this.getByte();
        }
    }

    export class ReceivePrize extends InPacket {
        prize = 0;
        currentMoney = 0;
        room = 0;
        nohuprize = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
            this.room = this.getByte();
            this.nohuprize = this.getLong();
        }
    }
}
export default cmd;