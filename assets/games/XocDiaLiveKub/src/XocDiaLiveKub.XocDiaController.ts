import Lobby from "./XocDiaLiveKub.Lobby";
import Play from "./XocDiaLiveKub.Play";
import XocDiaNetworkClient from "./XocDiaLiveKub.XocDiaNetworkClient";
import App from "../../../scripts/common/App";
import InPacket from "../../../scripts/networks/Network.InPacket";
import cmdNetwork from "../../../scripts/networks/Network.Cmd";
import Configs from "../../../scripts/common/Configs";
import Dialog from "../../../scripts/common/Dialog";
import AlertDialog from "../../../scripts/common/AlertDialog";
import cmd from "./XocDiaLiveKub.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class XocDiaLiveKubController extends cc.Component {

    public static instance: XocDiaLiveKubController = null;

    public xocDiaLiveKubView = null;

    public static getInstance() {
        if(this.instance == null) {
            this.instance = new XocDiaLiveKubController();
        }

        return this.instance;
    }

    public setXocDiaLiveView(xocView) {
        this.xocDiaLiveKubView = xocView;
    }

    public getXocDiaLiveView() {
        return this.xocDiaLiveKubView;
    }

    public toggleLiveStreamVideo(isUsed = false) {
        return this.xocDiaLiveKubView.toggleVideoLiveStream(isUsed);
    }

    public setIsOpenPopup(isActive) {
        this.xocDiaLiveKubView.isOpenPopup = isActive;
    }
}
