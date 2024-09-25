import Lobby from "./XocDia.Lobby";
import Play from "./XocDia.Play";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import App from "../../../scripts/common/App";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmdNetwork from "../../../scripts/networks/Network.Cmd";
import Configs from "../../../scripts/common/Configs";
import Dialog from "../../../scripts/common/Dialog";
import AlertDialog from "../../../scripts/common/AlertDialog";
import cmd from "./XocDia.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class XocDiaController extends cc.Component {

    public static instance: XocDiaController = null;

    // @property(cc.Node)
    // noteLobby: cc.Node = null;
    @property(cc.Node)
    nodePlay: cc.Node = null;

    public isCloseGame = false;

    public lobby: Lobby = null;
    public play: Play = null;
    public diaLog : AlertDialog = null;



    onLoad() {
        XocDiaController.instance = this;
        // this.lobby = this.noteLobby.getComponent(Lobby);
        this.play = this.nodePlay.getComponent(Play);
    }

    start() {
        if(Configs.Login.Coin <=1000){
            // XocDiaController.instance.closeGameAndShowDialg("Bạn phải có tối thiểu 1k you để chơi xóc đĩa!");
        }
        // this.lobby.init();
        this.play.init();

        this.play.node.active = true;

        App.instance.showErrLoading("Đang kết nối tới server...");

        XocDiaNetworkClient.getInstance().addOnOpen(() => {

            App.instance.showErrLoading("Đang đang đăng nhập...");
            XocDiaNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        XocDiaNetworkClient.getInstance().addOnClose(() => {
            Play.instance.offBgMusic();
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }, this);
        XocDiaNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmdNetwork.Code.LOGIN:
                    App.instance.showLoading(true);
                    XocDiaNetworkClient.getInstance().send(new cmd.SendJoinRoomById(1));
                    break;
            }
        }, this);
        XocDiaNetworkClient.getInstance().connect();
    }


    public closeGameAndShowDialg(text){
        App.instance.alertDialog.showMsgWithOnDismissed(text, () => {
            Play.instance = null;
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        });
        this.scheduleOnce(()=>{
            Play.instance = null;
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        },3)
       
    }

    public closeDiaLog(){
        App.instance.alertDialog.dismiss();
        Play.instance = null;
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }

    public showLobby() {
        this.lobby.show();
        this.play.node.active = false;
    }
}
