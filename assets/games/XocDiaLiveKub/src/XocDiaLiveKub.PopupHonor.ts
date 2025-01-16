import Popup from "../../../scripts/common/Popup";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";
import XocDiaLiveKubHonorItem from "./XocDiaLiveKub.HonorItem";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";
import XocDiaLiveKubController from "./XocDiaLiveKub.XocDiaController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubPopupHonor extends Popup {

    @property(cc.Node)
    nodeHonorTemplate = null;
    @property(cc.Node)
    honorContainer = null;

    private _gameName = "";
    protected onLoad() {
        super.onLoad();
        this._getListHonor();
    }

    private _getListHonor() {
        App.instance.showLoading2(true);
        GameGetLeaderBoard.getInstance().getGameLeaderBoard("XocDiaKubet", "DAY", (res) => {
            App.instance.showLoading2(false);
            // if (err != null) return;
            // if (!res["success"]) return;
            let listHonor = res['listVinhDanh'];

            for (let i = 0; i < listHonor.length; i++) {
                let item = listHonor[i];
                let nodeHonor = cc.instantiate(this.nodeHonorTemplate);
                nodeHonor.getComponent(XocDiaLiveKubHonorItem).initHonorItem(item, i);
                this.honorContainer.addChild(nodeHonor);
            }
        });
    }

    runActionClose() {
        super.runActionClose(() => {
                XocDiaLiveKubController.getInstance().toggleLiveStreamVideo(true);
                XocDiaLiveKubController.getInstance().setIsOpenPopup(false);
            }
        );
    }
}
