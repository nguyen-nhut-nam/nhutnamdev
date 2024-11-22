import Dialog from "../../../scripts/common/Dialog";
import Utils from "../../../scripts/common/Utils";
import GameGetLeaderBoard from "../../../scripts/common/Game.GetLeaderBoard";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHonors extends Dialog {
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property(cc.Node)
        titleCaoThuTx: cc.Node = null;

        private items = new Array<cc.Node>();

        private itemDTs = new Array<cc.Node>();

        show() {
            super.show();

            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }

            for (let i = 0; i < this.itemDTs.length; i++) {
                this.itemDTs[i].active = false;
            }
            if (this.itemTemplate != null) this.itemTemplate.active = false;
            // if (this.itemTemplateDT != null) this.itemTemplateDT.active = false;
        }

        dismiss() {
            super.dismiss();
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
        }

        _onShowed() {
            super._onShowed();
            this.loadData();
        }
        private loadData() {
            GameGetLeaderBoard.getInstance().getGameLeaderBoard("TaiXiu", "DAY", (res) => {
                if (res["success"]) {
                    if (this.items.length == 0) {
                        for (var i = 0; i < 10; i++) {
                            let item = cc.instantiate(this.itemTemplate);
                            item.parent = this.itemTemplate.parent;
                            this.items.push(item);
                        }
                        this.itemTemplate.destroy();
                        this.itemTemplate = null;
                    }
                    if(res.listVinhDanh.length === 0) return;
                    for (let i = 0; i < this.items.length; i++) {
                        console.log(this.items);
                        let item = this.items[i];
                        let itemData = res.listVinhDanh[i];
                        item.active = true;
                        if(i < 3) {
                            item.getChildByName('lblRank').active = false;
                            item.getChildByName('iconRank').active = true;
                            item.getChildByName('iconRank').getComponent(sp.Skeleton).clearTracks();
                            item.getChildByName('iconRank').getComponent(sp.Skeleton).setAnimation(0, `Rank${i+1}`, true);
                        } else {
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                            item.getChildByName('lblRank').active = true;
                            item.getChildByName('iconRank').active = false;
                        }
                        item.getChildByName('lblAccount').getComponent(cc.Label).string = `${itemData.username}`;
                        item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]) + "";
                    }
                }
            });
        }

        private settingItemDetalHistory(item: cc.Node, lblRank1Ani: boolean, lblRank2Ani: boolean, lblRank3: boolean,
            lblRankReward1: boolean, lblRankReward2: boolean, lblRankReward3: boolean, lblRankReward4: boolean, lblRankReward5: boolean,
            lblRankReward6: boolean, lblRankReward7: boolean, lblAcc: string, lblAcc2: string, lblAc3: string, lblAc4: string) {
            item.getChildByName("lblRank1Ani").active = lblRank1Ani;
            // item.getChildByName("lblRankReward1").active = lblRankReward1;
            // item.getChildByName("lblRankReward2").active = lblRankReward2;
            // item.getChildByName("lblRankReward3").active = lblRankReward3;
            // item.getChildByName("lblRankReward4").active = lblRankReward4;
            // item.getChildByName("lblRankReward5").active = lblRankReward5;
            // item.getChildByName("lblRankReward6").active = lblRankReward6;
            // item.getChildByName("lblRankReward7").active = lblRankReward7;
            item.getChildByName("lblRank2Ani").active = lblRank2Ani;
            item.getChildByName("lblRank3").active = lblRank3;
            item.getChildByName("lblAccount").getComponent(cc.Label).string = lblAcc + "";
            item.getChildByName("lblAccount2").getComponent(cc.Label).string = lblAcc2 + "";
            item.getChildByName("lblAccount3").getComponent(cc.Label).string = lblAc3 + "";
            item.getChildByName("lblAccount4").getComponent(cc.Label).string = lblAc4 + "";
        }

        private settingItemDetailCTTX(item: cc.Node, lblRank1Ani: boolean, lblRank2Ani: boolean, lblRank3: boolean,
            lblRankReward1: boolean, lblRankReward2: boolean, lblRankReward3: boolean, lblRankReward4: boolean, lblRankReward5: boolean,
            lblRankReward6: boolean, lblRankReward7: boolean, lblAcc: string, lblAcc2: string, lblAc3: string, lblAc4: string) {
            item.getChildByName("lblRank1AniDT").active = lblRank1Ani;
            item.getChildByName("lblRankReward1DT").active = lblRankReward1;
            item.getChildByName("lblRankReward2DT").active = lblRankReward2;
            item.getChildByName("lblRankReward3DT").active = lblRankReward3;
            item.getChildByName("lblRankReward4DT").active = lblRankReward4;
            item.getChildByName("lblRankReward5DT").active = lblRankReward5;
            item.getChildByName("lblRankReward6DT").active = lblRankReward6;
            item.getChildByName("lblRankReward7DT").active = lblRankReward7;
            item.getChildByName("lblRank2AniDT").active = lblRank2Ani;
            item.getChildByName("lblRank3DT").active = lblRank3;
            item.getChildByName("lblAccountDT").getComponent(cc.Label).string = lblAcc + "";
            item.getChildByName("lblAccount2DT").getComponent(cc.Label).string = lblAcc2 + "";
            item.getChildByName("lblAccount3DT").getComponent(cc.Label).string = lblAc3 + "";
            item.getChildByName("lblAccount4DT").getComponent(cc.Label).string = lblAc4 + "";
        }

        actShowHisTop() {
            this.titleCaoThuTx.active = false;
            // this.loadDataDuaTop();
        }


        actShowCaoThuTx() {
            this.titleCaoThuTx.active = true;
            this.loadData();
        }

        // private loadDataDuaTop() {
        //     var userCurrent = Configs.Login.Nickname + "";
        //     Http.get(Configs.App.API, { "c": 101, "mt": Configs.App.MONEY_TYPE, "txType": 1, "userCurrent": userCurrent }, (err, res) => {
        //         if (err != null) return;
        //         if (res["success"]) {
        //
        //             if (this.itemDTs.length == 0) {
        //                 for (var i = 0; i < 10; i++) {
        //                     let item = cc.instantiate(this.itemTemplateDT);
        //                     item.parent = this.itemTemplateDT.parent;
        //                     this.itemDTs.push(item);
        //                 }
        //                 this.itemTemplateDT.destroy();
        //                 this.itemTemplateDT = null;
        //             }
        //
        //             for (let i = 0; i < this.itemDTs.length; i++) {
        //                 let item = this.itemDTs[i];
        //                 if (i < res["topTX"].length) {
        //                     let itemData = res["topTX"][i];
        //                     item.getChildByName("bg").opacity = i % 2 == 0 ? 0 : 10;
        //                     item.getChildByName("lblRankDT").getComponent(cc.Label).string = (i + 1).toString();
        //                     item.getChildByName("lblWinDT").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]) + "";
        //                     if (i == 0) {
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(200000000) + "";
        //                         this.settingItemDetailCTTX(item, true, false, false, true, false, false, false, false, false, false, itemData["username"], "", "", "");
        //                     }
        //                     else if (i == 1) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(120000000) + "";
        //                         this.settingItemDetailCTTX(item, false, true, false, false, true, false, false, false, false, false, "", itemData["username"], "", "");
        //                     }
        //                     else if (i == 2) {
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(80000000) + "";
        //                         this.settingItemDetailCTTX(item, false, false, true, false, false, true, false, false, false, false, "", "", itemData["username"], "");
        //                     } else if (i == 3) {
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(50000000) + "";
        //                         this.settingItemDetailCTTX(item, false, false, false, false, false, false, true, false, false, false, "", "", "", itemData["username"]);
        //                     } else if (i == 4) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(30000000) + "";
        //                         this.settingItemDetailCTTX(item, false, false, false, false, false, false, false, true, false, false, "", "", "", itemData["username"]);
        //
        //                     } else if (i == 5 || i == 6) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(20000000) + "";
        //                         this.settingItemDetailCTTX(item, false, false, false, false, false, false, false, false, true, false, "", "", "", itemData["username"]);
        //                     } else {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(5000000) + "";
        //                         this.settingItemDetailCTTX(item, false, false, false, false, false, false, false, false, false, true, "", "", "", itemData["username"]);
        //                     }
        //                     item.active = true;
        //                 } else {
        //                     item.active = false;
        //                 }
        //             }
        //         }
        //     });
        // }

    }



}

export default taixiumini.PopupHonors;