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



const {ccclass, property} = cc._decorator;

@ccclass
export  class Slot4setting extends Dialog {

   @property(cc.Node)
   onOffBtn : cc.Node =null;

   @property(cc.Node)
   onOffBtn2 : cc.Node =null;
   
  
   @property(cc.Node)
   onOffBtn3 : cc.Node =null;
   

   on:boolean=true;
   on2:boolean =SPUtils.getMusicVolumn() > 0;
   on3:boolean =SPUtils.getSoundVolumn()>0;
   start () {
     this.on2 = SPUtils.getMusicVolumn() > 0;
     this.on3 = SPUtils.getSoundVolumn()>0;
        this.onOffBtn.getChildByName("slideItem").getComponent(cc.Button).node.on("click",this.actHandle ,this);
        this.onOffBtn2.getChildByName("slideItem").getComponent(cc.Button).node.on("click",this.actHandle2 ,this);
        this.onOffBtn3.getChildByName("slideItem").getComponent(cc.Button).node.on("click",this.actHandle3 ,this);
        let animi = this.onOffBtn2.getChildByName("slideItem").getComponent(cc.Animation);
        if(this.on2){
            
          let animationState =  animi.play("slidebtn1",1);
            animationState.wrapMode = cc.WrapMode.Normal;
            this.on2=false;
        } else{
             
         let animationState =  animi.play("slidebtn1");
         animationState.wrapMode = cc.WrapMode.Reverse;
         this.on2=true;
        }
        let animi2 = this.onOffBtn.getChildByName("slideItem").getComponent(cc.Animation);
        console.log("play");
        if(this.on){
            
          let animationState =  animi2.play("slidebtn1",1);
            animationState.wrapMode = cc.WrapMode.Normal;
            this.on=false;
        } else{
 
         let animationState =  animi2.play("slidebtn1");
         animationState.wrapMode = cc.WrapMode.Reverse;
         this.on=true;
        }
        let animi3 = this.onOffBtn3.getChildByName("slideItem").getComponent(cc.Animation);
        if(this.on3){
         
          let animationState =  animi3.play("slidebtn1",1);
            animationState.wrapMode = cc.WrapMode.Normal;
            this.on3=false;
        } else{
             
         let animationState =  animi3.play("slidebtn1");
         animationState.wrapMode = cc.WrapMode.Reverse;
         this.on3=true;
        }
    }


     actHandle(){
       let animi = this.onOffBtn.getChildByName("slideItem").getComponent(cc.Animation);
       console.log("play");
       if(this.on){
           
         let animationState =  animi.play("slidebtn1",1);
           animationState.wrapMode = cc.WrapMode.Normal;
           this.on=false;
       } else{

        let animationState =  animi.play("slidebtn1");
        animationState.wrapMode = cc.WrapMode.Reverse;
        this.on=true;
       }
    }

    actHandle2(){
        let animi = this.onOffBtn2.getChildByName("slideItem").getComponent(cc.Animation);
        if(this.on2){
          SPUtils.setSoundVolumn(1);
          BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
          let animationState =  animi.play("slidebtn1",1);
            animationState.wrapMode = cc.WrapMode.Normal;
            this.on2=false;
        } else{
          SPUtils.setSoundVolumn(0);
          BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
         let animationState =  animi.play("slidebtn1");
         animationState.wrapMode = cc.WrapMode.Reverse;
         this.on2=true;
        }
     
     }
     actHandle3(){
      let animi = this.onOffBtn3.getChildByName("slideItem").getComponent(cc.Animation);
      if(this.on3){
     
        let animationState =  animi.play("slidebtn1");
          animationState.wrapMode = cc.WrapMode.Normal;
          this.on3=false;
          SPUtils.setMusicVolumn(0);
          BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
      } else{
           
       let animationState =  animi.play("slidebtn1");
       animationState.wrapMode = cc.WrapMode.Reverse;
       this.on3=true;
       SPUtils.setMusicVolumn(1);
       BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
      }
     
   }
    // update (dt) {}
}
export default Slot4setting;
