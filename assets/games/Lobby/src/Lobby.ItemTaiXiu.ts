import ItemGame from "./Lobby.ItemGame";
import Utils from "../../../scripts/common/Utils";
import Random from "../../../scripts/common/Random";
import Tween from "../../../scripts/common/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemTaiXiu extends ItemGame {
    @property([cc.Label])
    lblJackpots: cc.Label[] = [];
    @property
    fakeJackpot: boolean = false;

    start() {
        if (this.fakeJackpot) {
        }
    }
   
}
