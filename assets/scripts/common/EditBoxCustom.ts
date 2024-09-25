// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.EditBox {



    onLoad(){
        this.node.on('text-changed', this.callback, this);
    }
    callback(editbox:cc.EditBox) {
        console.log("go here")
        editbox.placeholderLabel.string = Utils.formatNumber(parseInt(editbox.string));
        editbox.textLabel.string =Utils.formatNumber(parseInt(editbox.string));
        editbox.string = Utils.formatNumber(parseInt(editbox.string));
    }
  
    actReset(){
        this.string="";
        this.textLabel.string="";
        this.placeholderLabel.string="";

    }
   getValueMoney():number{
    return Utils.stringToInt(this.textLabel.string.trim() );
   }

}
