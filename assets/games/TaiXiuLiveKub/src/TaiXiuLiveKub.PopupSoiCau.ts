import TaiXiuLiveKubController from "./TaiXiuLiveKub.TaiXiuLiveKubController";
import Dialog from "../../../scripts/common/Dialog";
import Utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import TaiXiuKuBetController from "./TaiXiuLiveKub.TaiXiuLiveKubController";

const {ccclass, property} = cc._decorator;

namespace taixiukubet {
    @ccclass
    export class PopupSoiCau extends Dialog {
        @property(cc.Node)
        lineTemplate: cc.Node = null;

        @property(cc.Node)
        iconTaiTemplate: cc.Node = null;
        @property(cc.Node)
        iconXiuTemplate: cc.Node = null;

        @property(cc.Node)
        iconTaiP2Template: cc.Node = null;
        @property(cc.Node)
        iconXiuP2Template: cc.Node = null;

        @property(cc.Node)
        iconXX1Template: cc.Node = null;
        @property(cc.Node)
        iconXX2Template: cc.Node = null;
        @property(cc.Node)
        iconXX3Template: cc.Node = null;

        @property(cc.Node)
        page1: cc.Node = null;
        @property(cc.Label)
        lblLastSession: cc.Label = null;
        @property(cc.Node)
        xx1Draw: cc.Node = null;
        @property(cc.Node)
        xx2Draw: cc.Node = null;
        @property(cc.Node)
        xx3Draw: cc.Node = null;
        @property(cc.Node)
        xx123Draw: cc.Node = null;

        @property(cc.Node)
        page2: cc.Node = null;
        @property(cc.Label)
        lblTai1: cc.Label = null;
        @property(cc.Label)
        lblTai2: cc.Label = null;
        @property(cc.Label)
        lblXiu1: cc.Label = null;
        @property(cc.Label)
        lblXiu2: cc.Label = null;
        @property(cc.Node)
        contentDraw: cc.Node = null;
        @property(cc.Node)
        contentSoiCau: cc.Node = null;
        @property(cc.ScrollView)
        scrollSoiCau = null;

        @property({type: cc.Node})
        btnPrev: cc.Node = null;
        @property({type: cc.Node})
        btnNext: cc.Node = null;

        show() {
            super.show();
            this.page1.active = false;
            this.page2.active = false;
            this.lineTemplate.parent.active = false;
        }

        dismiss() {
            this.node.getChildByName('Container').runAction(
                cc.sequence(
                    cc.scaleTo(.15, 1.1, 1.1),
                    cc.scaleTo(.35, 0, 0),
                    cc.callFunc(() => {
                        this.node.destroy();
                        TaiXiuKuBetController.instance.toggleVideoLiveStream(true);
                        TaiXiuKuBetController.instance.isOpenPopup = false;
                    })
                )
            )
        }

        _onShowed() {
            super._onShowed();

            this.drawPage1();
            nodeUtils.disableNode(this.btnPrev);
            nodeUtils.activeNode(this.btnNext);
            this.page1.active = true;
            this.page2.active = false;
        }

        protected onLoad() {
            this.lineTemplate.parent.active = false;
            this.drawPage1();
            nodeUtils.disableNode(this.btnPrev);
            nodeUtils.activeNode(this.btnNext);
            this.page1.active = true;
            this.page2.active = false;
        }

        toggleXX1(target: cc.Toggle) {
            this.xx1Draw.active = target.isChecked;
        }

        toggleXX2(target: cc.Toggle) {
            this.xx2Draw.active = target.isChecked;
        }

        toggleXX3(target: cc.Toggle) {
            this.xx3Draw.active = target.isChecked;
        }

        togglePage() {
            this.page1.active = !this.page1.active;
            this.page2.active = !this.page1.active;
            if (this.page1.active) {
                nodeUtils.disableNode(this.btnPrev);
                nodeUtils.activeNode(this.btnNext);
                this.drawPage1();
            } else {
                nodeUtils.activeNode(this.btnPrev);
                nodeUtils.disableNode(this.btnNext);
                this.drawPage2();
            }
        }

        private drawPage1() {
            let data = TaiXiuLiveKubController.instance.histories.slice();
            if (data.length > 21) {
                data.splice(0, data.length - 21);
            }
            var last = data[data.length - 1];
            var lastDices = last.dices;
            var lastScore = lastDices[0] + lastDices[1] + lastDices[2];
            this.lblLastSession.string = "Phiên gần nhất: #" + " " + last.session + "-" + (lastScore >= 11 ? "Tài" : "Xỉu") + " " + "(" + lastDices[0] + "-" + lastDices[1] + "-" + lastDices[2] + ")";
            let endPosX = 413;
            let startPosY = -164;
            let startPosY123 = 9.6;
            this.xx1Draw.removeAllChildren();
            this.xx2Draw.removeAllChildren();
            this.xx3Draw.removeAllChildren();
            this.xx123Draw.removeAllChildren();

            let _i = 0;
            const spacingX = 41.3;
            const spacingY = 31;
            for (var i = data.length - 1; i >= 0; i--) {
                var dices = data[i].dices;
                var score = dices[0] + dices[1] + dices[2];

                let startPosXX1 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[0] - 1) * spacingY);
                let startPosXX2 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[1] - 1) * spacingY);
                let startPosXX3 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[2] - 1) * spacingY);
                let startPosXX123 = cc.v2(endPosX - _i * spacingX, startPosY123 + (score - 3) * (spacingY / 3));

                let iconXX1 = cc.instantiate(this.iconXX1Template);
                iconXX1.parent = this.xx1Draw;
                iconXX1.position = startPosXX1;

                let iconXX2 = cc.instantiate(this.iconXX2Template);
                iconXX2.parent = this.xx2Draw;
                iconXX2.position = startPosXX2;

                let iconXX3 = cc.instantiate(this.iconXX3Template);
                iconXX3.parent = this.xx3Draw;
                iconXX3.position = startPosXX3;

                let iconXX123 = cc.instantiate(score >= 11 ? this.iconTaiTemplate : this.iconXiuTemplate);
                iconXX123.parent = this.xx123Draw;
                iconXX123.position = startPosXX123;
                iconXX123.getChildByName("score").getComponent(cc.Label).string = score;

                if (_i > 0) {
                    dices = data[i + 1].dices;
                    score = dices[0] + dices[1] + dices[2];

                    let endPosXX1 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[0] - 1) * spacingY);
                    let endPosXX2 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[1] - 1) * spacingY);
                    let endPosXX3 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[2] - 1) * spacingY);
                    let endPosXX123 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY123 + (score - 3) * (spacingY / 3));

                    let line = cc.instantiate(this.lineTemplate);
                    line.parent = this.xx1Draw;
                    line.width = Utils.v2Distance(startPosXX1, endPosXX1);
                    line.position = startPosXX1;
                    line.angle = Utils.v2Degrees(startPosXX1, endPosXX1);
                    line.color = cc.Color.BLACK.fromHEX("#ff00ff");
                    line.zIndex = 0;

                    line = cc.instantiate(this.lineTemplate);
                    line.parent = this.xx2Draw;
                    line.width = Utils.v2Distance(startPosXX2, endPosXX2);
                    line.position = startPosXX2;
                    line.angle = Utils.v2Degrees(startPosXX2, endPosXX2);
                    line.color = cc.Color.BLACK.fromHEX("#FFFF00");
                    line.zIndex = 0;

                    line = cc.instantiate(this.lineTemplate);
                    line.parent = this.xx3Draw;
                    line.width = Utils.v2Distance(startPosXX3, endPosXX3);
                    line.position = startPosXX3;
                    line.angle = Utils.v2Degrees(startPosXX3, endPosXX3);
                    line.color = cc.Color.BLACK.fromHEX("#FF0000");
                    line.zIndex = 0;

                    line = cc.instantiate(this.lineTemplate);
                    line.parent = this.xx123Draw;
                    line.width = Utils.v2Distance(startPosXX123, endPosXX123);
                    line.position = startPosXX123;
                    line.angle = Utils.v2Degrees(startPosXX123, endPosXX123);
                    line.color = cc.Color.BLACK.fromHEX("#ffea00");
                    line.zIndex = -1;
                }

                _i++;
            }
        }

        private drawPage2() {
            var startPosX = 22;
            var startPosY = 60;
            var spacingX = 41.5;
            var spacingY = 30.5;

            this.contentDraw.removeAllChildren();
            var data = [];
            var curData = [];
            var count = TaiXiuLiveKubController.instance.histories.length;
            var countTai = 0;
            var countXiu = 0;
            if (count > 1) {
                var dices = TaiXiuLiveKubController.instance.histories[0].dices;
                var score = dices[0] + dices[1] + dices[2];
                var isTai = score >= 11;
                var maxItem = 5;
                for (var i = 0; i < count; i++) {
                    dices = TaiXiuLiveKubController.instance.histories[i].dices;
                    score = dices[0] + dices[1] + dices[2];
                    var _isTai = score >= 11;

                    if (_isTai !== isTai) {
                        // if (curData.length > maxItem) {
                        //     curData.splice(0, curData.length - maxItem);
                        // }
                        data.push(curData);
                        if (isTai) {
                            countTai += curData.length;
                        } else {
                            countXiu += curData.length;
                        }

                        isTai = _isTai;
                        curData = [];
                        curData.push(score);
                    } else {
                        if(curData.length == maxItem){
                            data.push(curData);
                            curData = [];
                        }
                        curData.push(score);
                    }
                    if (i === count - 1) {
                        // if (curData.length > maxItem) {
                        //     curData.splice(0, curData.length - maxItem);
                        // }
                        data.push(curData);
                        if (isTai) {
                            countTai += curData.length;
                        } else {
                            countXiu += curData.length;
                        }
                    }
                }
            }
            if (data.length > 100) {
                data.splice(0, data.length - 100);
            }

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    let score = data[i][j];
                    let icon = cc.instantiate(score >= 11 ? this.iconTaiP2Template : this.iconXiuP2Template);
                    icon.scaleX = 1;
                    icon.scaleY = 1;
                    icon.parent = this.contentSoiCau;
                    icon.position = cc.v2(startPosX + spacingX * i, startPosY - spacingY * j);
                    if(this.scrollSoiCau.content.width - icon.x < 30) {
                        this.scrollSoiCau.content.width += 35.28;
                    }
                    icon.getChildByName("score").getComponent(cc.Label).string = score;
                }
            }

            startPosX = -393;
            startPosY = -65;

            let startRotatePosY = -187;
            let column = 0;
            let row = 0;
            let countTai2 = 0;
            let countXiu2 = 0;
            data = TaiXiuLiveKubController.instance.histories.slice();
            if (data.length > 100) {
                data.splice(0, data.length - 100);
            }
            for (let i = 0; i < data.length; i++) {
                const score = data[i].dices[0] + data[i].dices[1] + data[i].dices[2];
                if (score >= 11) {
                    countTai2++;
                } else {
                    countXiu2++;
                }

                let iconXX123 = cc.instantiate(score >= 11 ? this.iconTaiTemplate : this.iconXiuTemplate);
                iconXX123.scaleY = 1;
                iconXX123.scaleX = 1;
                iconXX123.parent = this.contentDraw;
                if(column % 2 == 0) {
                    iconXX123.position = cc.v2(startPosX + spacingX * column - column, startPosY - spacingY * row);
                } else {
                    iconXX123.position = cc.v2(startPosX + spacingX * column - column, startRotatePosY + spacingY * row);
                }
                row++;
                if (row >= 5) {
                    row = 0;
                    column++;
                }
            }
            this.lblTai1.string = `:${countTai2.toString()}`;
            this.lblXiu1.string = `${countXiu2.toString()}:`;
            this.scrollSoiCau.scrollToRight(0, this.scrollSoiCau.getMaxScrollOffset());
        }
    }
}
export default taixiukubet.PopupSoiCau;