import {common} from "../../../scripts/common/Utils";
import Utils = common.Utils;

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaLiveKubHonorItem extends cc.Component {

    @property(cc.Label)
    lblRank = null;
    @property(cc.Sprite)
    rankSprite = null;
    @property([cc.SpriteFrame])
    spfRank = [];
    @property(cc.Label)
    lblDisplayName = null;
    @property(cc.Label)
    lblTotalWin = null;

    private initHonorItem(_honorItem, _index) {
        if(_index < 3) {
            this.lblRank.node.active = false;
            this.rankSprite.node.active = true;
            this.rankSprite.spriteFrame = this.spfRank[_index];
        } else {
            this.lblRank.node.active = true;
            this.rankSprite.node.active = false;
            this.lblRank.string = `${_index + 1}`;
        }

        this.lblDisplayName.string = _honorItem.username;
        this.lblTotalWin.string = `${Utils.formatNumber(_honorItem.money)}`;
    }

}
