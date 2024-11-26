import Dialog from "../../../scripts/common/Dialog";
import Configs from "../../../scripts/common/Configs";
import Http from "../../../scripts/common/Http";
import App from "../../../scripts/common/App";
import Utils from "../../../scripts/common/Utils";

const {ccclass, property} = cc._decorator;

namespace taixiukubet {
    @ccclass
    export class PopupHonors extends Dialog {
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property(cc.Node)
        itemTemplateMonth: cc.Node = null;
        @property(cc.Node)
        titleCaoThuTx: cc.Node = null;
        @property(cc.Node)
        ListItem: cc.Node = null;
        @property(cc.Node)
        ListItemMonth: cc.Node = null;
        @property(cc.Node)
        iconGuiCTTX: cc.Node = null;
        @property(cc.Node)
        popUpEventTX: cc.Node = null;
        @property(cc.Label)
        typeVinhDanh: cc.Label = null;

        private items = new Array<cc.Node>();
        private itemMonth = new Array<cc.Node>();

        private BY_DAY = "byDay";
        private BY_MONTH = "byMonth";

        show() {
            super.show();

            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }

            if (this.itemTemplate != null) this.itemTemplate.active = false;
            if (this.itemTemplateMonth != null) this.itemTemplateMonth.active = false;
            this.actShowTopByDay();
        }

        dismiss() {
            super.dismiss();
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            for (let i = 0; i < this.itemMonth.length; i++) {
                this.itemMonth[i].active = false;
            }
        }

        _onShowed() {
            super._onShowed();
            this.loadDataByDay();
        }

        actShowPopUpEvent() {
            this.popUpEventTX.active = true;
        }

        actDismissPopUpEvent() {
            this.popUpEventTX.active = false;
        }


        private loadDataByDay() {
            App.instance.showLoading2(true);
            var userCurrent = Configs.Login.Nickname + "";
            Http.get(Configs.App.API, {
                "c": 4007,
                "mt": Configs.App.MONEY_TYPE,
                "txType": 1,
                "userCurrent": userCurrent,
                "typeVinhDanh": this.BY_DAY
            }, (err, res) => {
                App.instance.showLoading2(false);
                if (err != null) return;
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

                    this.typeVinhDanh.string = "Vinh Danh Ngày - Tổng Cược Ngày Của Bạn: " + Utils.formatNumber(res["totalMoneyStakesMine"]);
                    for (let i = 0; i < this.items.length; i++) {
                        let item = this.items[i];
                        if (i < res["topTX"].length) {

                            let itemData = res["topTX"][i];
                            item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                            item.getChildByName("lblToTalCuoc").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);

                            if (i == 0) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(20000000) + "";
                                this.settingItemDetailByDay(item, true, false, false, true, false, false, false, false, false, false, itemData["username"], "", "", "");
                            } else if (i == 1) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(10000000) + "";
                                this.settingItemDetailByDay(item, false, true, false, false, true, false, false, false, false, false, "", itemData["username"], "", "");
                            } else if (i == 2) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(5000000) + "";
                                this.settingItemDetailByDay(item, false, false, true, false, false, true, false, false, false, false, "", "", itemData["username"], "");
                            } else if (i == 3) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(3000000) + "";
                                this.settingItemDetailByDay(item, false, false, false, false, false, false, true, false, false, false, "", "", "", itemData["username"]);
                            } else {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(1000000) + "";
                                this.settingItemDetailByDay(item, false, false, false, false, false, false, false, false, false, true, "", "", "", itemData["username"]);
                            }
                            item.active = true;
                        } else {
                            item.active = false;
                        }
                    }

                }
            });
        }

        private loadDataByMonth() {

            // GET Today and LastDay
            let dateObj = new Date();
            let month = dateObj.getUTCMonth() + 1; //months from 1-12
            let today = dateObj.getUTCDate();
            let year = dateObj.getUTCFullYear();
            let d = new Date(year, month, 0); // months from 1-12
            let lastday = d.getUTCDate() + 1;
            // GET Today and LastDay
            App.instance.showLoading2(true);
            var userCurrent = Configs.Login.Nickname + "";
            Http.get(Configs.App.API, {
                "c": 4007,
                "mt": Configs.App.MONEY_TYPE,
                "txType": 1,
                "userCurrent": userCurrent,
                "typeVinhDanh": this.BY_MONTH
            }, (err, res) => {
                App.instance.showLoading2(false);
                if (err != null) return;
                if (res["success"]) {
                    this.typeVinhDanh.string = "Vinh Danh Tháng - Tổng Cược Tháng Của Bạn: " + Utils.formatNumber(res["totalMoneyStakesMine"]);
                    if (this.itemMonth.length == 0) {
                        for (var i = 0; i < 20; i++) {
                            let item = cc.instantiate(this.itemTemplateMonth);
                            item.parent = this.itemTemplateMonth.parent;
                            this.itemMonth.push(item);
                        }
                        this.itemTemplateMonth.destroy();
                        this.itemTemplateMonth = null;
                    }
                    for (let i = 0; i < this.itemMonth.length; i++) {
                        let item = this.itemMonth[i];
                        if (i < res["topTX"].length) {

                            let itemData = res["topTX"][i];
                            item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                            item.getChildByName("lblToTalCuoc").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);

                        
                            if (19 < today && today < lastday) {
                                console.log("ẨN TOP 3");
                                if(i== 0 || i == 1 || i ==2){
                                    item.getChildByName("lblToTalCuoc").getComponent(cc.Label).string = "******";
                                }
                            }

                            if (i == 0) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(400000000) + "";
                                this.settingItemDetailByMonth(item, true, false, false, true, false, false, false, false, false, false, itemData["username"], "", "", "");
                            } else if (i == 1) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(150000000) + "";
                                this.settingItemDetailByMonth(item, false, true, false, false, true, false, false, false, false, false, "", itemData["username"], "", "");
                            } else if (i == 2) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(80000000) + "";
                                this.settingItemDetailByMonth(item, false, false, true, false, false, true, false, false, false, false, "", "", itemData["username"], "");
                            } else if (i == 3) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(30000000) + "";
                                this.settingItemDetailByMonth(item, false, false, false, false, false, false, true, false, false, false, "", "", "", itemData["username"]);
                            } else if(i ==4 ) {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(15000000) + "";
                                this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, true, false, false, "", "", "", itemData["username"]);
                            } else if( i == 5 || i == 6 ||  i ==7 || i == 8 || i ==9){
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(5000000) + "";
                                this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, false, true, false, "", "", "", itemData["username"]);
                            } else {
                                item.getChildByName("lblWinReward").getComponent(cc.Label).string = Utils.formatNumber(2000000) + "";
                                this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, false, false, true, "", "", "", itemData["username"]);
                            }
                            item.active = true;
                        } else {
                            item.active = false;
                        }
                    }
                }
            });
        }

        private settingItemDetailByDay(item: cc.Node, lblRank1Ani: boolean, lblRank2Ani: boolean, lblRank3: boolean,
                                      lblRankReward1: boolean, lblRankReward2: boolean, lblRankReward3: boolean, lblRankReward4: boolean, lblRankReward5: boolean,
                                      lblRankReward6: boolean, lblRankReward7: boolean, lblAcc: string, lblAcc2: string, lblAc3: string, lblAc4: string) {
            item.getChildByName("lblRank1Ani").active = lblRank1Ani;
            item.getChildByName("lblRankReward1").active = lblRankReward1;
            item.getChildByName("lblRankReward2").active = lblRankReward2;
            item.getChildByName("lblRankReward3").active = lblRankReward3;
            item.getChildByName("lblRankReward4").active = lblRankReward4;
            item.getChildByName("lblRankReward5").active = lblRankReward5;
            item.getChildByName("lblRankReward6").active = lblRankReward6;
            item.getChildByName("lblRankReward7").active = lblRankReward7;
            item.getChildByName("lblRank2Ani").active = lblRank2Ani;
            item.getChildByName("lblRank3").active = lblRank3;
            item.getChildByName("lblAccount").getComponent(cc.Label).string = lblAcc + "";
            item.getChildByName("lblAccount2").getComponent(cc.Label).string = lblAcc2 + "";
            item.getChildByName("lblAccount3").getComponent(cc.Label).string = lblAc3 + "";
            item.getChildByName("lblAccount4").getComponent(cc.Label).string = lblAc4 + "";
        } 
        
        private settingItemDetailByMonth(item: cc.Node, lblRank1Ani: boolean, lblRank2Ani: boolean, lblRank3: boolean,
                                      lblRankReward1: boolean, lblRankReward2: boolean, lblRankReward3: boolean, lblRankReward4: boolean, lblRankReward5: boolean,
                                      lblRankReward6: boolean, lblRankReward7: boolean, lblAcc: string, lblAcc2: string, lblAc3: string, lblAc4: string) {
            item.getChildByName("lblRank1Ani").active = lblRank1Ani;
            item.getChildByName("lblRankRewardMonth1").active = lblRankReward1;
            item.getChildByName("lblRankRewardMonth2").active = lblRankReward2;
            item.getChildByName("lblRankRewardMonth3").active = lblRankReward3;
            item.getChildByName("lblRankRewardMonth4").active = lblRankReward4;
            item.getChildByName("lblRankRewardMonth5").active = lblRankReward5;
            item.getChildByName("lblRankRewardMonth6").active = lblRankReward6;
            item.getChildByName("lblRankRewardMonth7").active = lblRankReward7;
            item.getChildByName("lblRank2Ani").active = lblRank2Ani;
            item.getChildByName("lblRank3").active = lblRank3;
            item.getChildByName("lblAccount").getComponent(cc.Label).string = lblAcc + "";
            item.getChildByName("lblAccount2").getComponent(cc.Label).string = lblAcc2 + "";
            item.getChildByName("lblAccount3").getComponent(cc.Label).string = lblAc3 + "";
            item.getChildByName("lblAccount4").getComponent(cc.Label).string = lblAc4 + "";
        }

        actShowTopByMonth() {
            this.titleCaoThuTx.active = true;
            this.ListItem.active = false;
            this.ListItemMonth.active = true;
            this.loadDataByMonth();
        }


        actShowTopByDay() {
            this.titleCaoThuTx.active = true;
            this.ListItemMonth.active = false;
            this.ListItem.active = true;
            this.loadDataByDay();
        }

        // private loadDataByMonth() {
        //     App.instance.showLoading2(true);
        //     var userCurrent = Configs.Login.Nickname + "";
        //     Http.get(Configs.App.API, { "c": 407, "mt": Configs.App.MONEY_TYPE, "txType": 1, "userCurrent": userCurrent , "typeVinhDanh" : this.BY_MONTH}, (err, res) => {
        //         App.instance.showLoading2(false);
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
        //                         this.settingItemDetailByMonth(item, true, false, false, true, false, false, false, false, false, false, itemData["username"], "", "", "");
        //                     }
        //                     else if (i == 1) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(120000000) + "";
        //                         this.settingItemDetailByMonth(item, false, true, false, false, true, false, false, false, false, false, "", itemData["username"], "", "");
        //                     }
        //                     else if (i == 2) {
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(80000000) + "";
        //                         this.settingItemDetailByMonth(item, false, false, true, false, false, true, false, false, false, false, "", "", itemData["username"], "");
        //                     } else if (i == 3) {
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(50000000) + "";
        //                         this.settingItemDetailByMonth(item, false, false, false, false, false, false, true, false, false, false, "", "", "", itemData["username"]);
        //                     } else if (i == 4) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(30000000) + "";
        //                         this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, true, false, false, "", "", "", itemData["username"]);
        //
        //                     } else if (i == 5 || i == 6) {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(20000000) + "";
        //                         this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, false, true, false, "", "", "", itemData["username"]);
        //                     } else {
        //
        //                         item.getChildByName("lblWinRewardDT").getComponent(cc.Label).string = Utils.formatNumber(5000000) + "";
        //                         this.settingItemDetailByMonth(item, false, false, false, false, false, false, false, false, false, true, "", "", "", itemData["username"]);
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

export default taixiukubet.PopupHonors;