import App from "../../../scripts/common/App";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";
import Popup from "../../../scripts/common/Popup";
import BauCuaTo2HonorItem from "./BauCuaTo2.HonorItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHonors extends Popup {
    @property(cc.Node)
    nodeHonorTemplate = null;
    @property(cc.Node)
    honorContainer = null;

    protected onLoad() {
        super.onLoad();
        this._getListHonor();
    }

    private _getListHonor() {
        App.instance.showLoading2(true);
        GameGetLeaderBoard.getInstance().getGameLeaderBoard("BauCua", "DAY", (res) => {
            App.instance.showLoading2(false);
            // if (err != null) return;
            // if (!res["success"]) return;
            let listHonor = res['listVinhDanh'];

            for (let i = 0; i < listHonor.length; i++) {
                let item = listHonor[i];
                let nodeHonor = cc.instantiate(this.nodeHonorTemplate);
                nodeHonor.getComponent(BauCuaTo2HonorItem).initHonorItem(item, i);
                this.honorContainer.addChild(nodeHonor);
            }
        });
    }
}
