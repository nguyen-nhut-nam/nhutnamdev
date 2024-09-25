// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;
@ccclass("BankItemImg")
export class BankItemImg{
    
    @property(cc.SpriteFrame)
    spr : cc.SpriteFrame = null;
    @property()
    text: string = 'hello';

} 

@ccclass("ListBankImg")
export default class ListBankImg extends cc.Component {


    
    @property(BankItemImg)
    public  lstBank : BankItemImg[] =[];


    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

   
    // update (dt) {}
}
 

