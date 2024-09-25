// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Dialog from "../../../scripts/common/Dialog";
import SPUtils from "../../../scripts/common/SPUtils";
import utils from "../../../scripts/common/Utils";
import nodeUtils from "../../../scripts/common/NodeUtils";
import InGame from "./TienLen.InGame";



const {ccclass, property} = cc._decorator;

@ccclass
export  class TienLenSetting extends Dialog {


    @property(cc.Node)
    onOffBtn : cc.Node =null;

    @property(cc.Node)
    onOffBtn2 : cc.Node =null;

    @property(cc.Node)
    onOffBtn3 : cc.Node =null

    on:boolean=true;
    on2:boolean =true;
    on3:boolean = true;
    start () {
        this.onOffBtn.on("click",this.actHandle ,this);
        this.onOffBtn2.on("click",this.actHandle2 ,this);
        this.onOffBtn3.on("click",this.actHandle3 ,this);
    }


    actHandle(){
        let animi = this.onOffBtn.getChildByName("slideItem");
        nodeUtils.reverseNodeByX(animi);
        this.on = !this.on;
    }

    actHandle2(){
        let animi = this.onOffBtn2.getChildByName("slideItem");
        nodeUtils.reverseNodeByX(animi);
        this.on2 = !this.on2;
        if (this.on2) {
            InGame.instance.settingMusic();
        } else {
            InGame.instance.offBgMusic();
        }
    }

    actHandle3(){
        let animi = this.onOffBtn3.getChildByName("slideItem");
        nodeUtils.reverseNodeByX(animi);
        this.on3 = !this.on3;
    }
    // update (dt) {}
}
export default TienLenSetting;
