import AlertDialog from "../../../scripts/common/AlertDialog";
import App from "../../../scripts/common/App";
import BroadcastReceiver from "../../../scripts/common/BroadcastReceiver";
import Configs from "../../../scripts/common/Configs";
import Dialog from "../../../scripts/common/Dialog";
import Http from "../../../scripts/common/Http";
import Utils from "../../../scripts/common/Utils";
import Tween from '../../../scripts/common/Tween';

const {ccclass, property} = cc._decorator;

cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
@ccclass
export default class NewClass extends cc.Component {
 
    @property(cc.WebView)
    webview : cc.WebView =null;
    @property(cc.Canvas)
    myCanvas : cc.Canvas = null;
    // LIFE-CYCLE CALLBACKS:
    @property(Dialog)
    bongdaDialog: Dialog =null;
    @property(Dialog)
    popUpNapRut:Dialog =null;
    @property(cc.EditBox)
    money:cc.EditBox =null;
    @property(cc.Node)
    gameplayNode :cc.Node =null;
    @property(AlertDialog)
    alertDialog : AlertDialog =null;
    @property(cc.Label)
    currentMoney : cc.Label = null;
    @property(cc.Label) 
    moneyBongDa : cc.Label =null;


    private  currentMoneyQue  = Configs.Login.Coin;
     onLoad () {
        
        
     }

     callback (event) {
         console.log("webview url la"+this.webview.url)
        if(this.webview.url=== Configs.App.BANCA || this.webview.url==="https://null"){
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }
        // The event here is an EventCustom object, and you can get the WebView component through event.detail
        var webview = event.detail;
        // do whatever you want with webview
        // Also, note that this way the registered event can not pass customEventData
     }
    start () {
        //cc.director.setClearColor(new cc.Color(0, 0, 0, 0))
        cc.director.setClearColor(new cc.Color(0, 0, 0, 0))
        this.webview.url= Configs.App.BANCA + "/?token="+Configs.Login.AccessToken+"&brand=sun9.club&domain=sun9.club";
       // this.currentMoney.string = Utils.formatMoney(Configs.Login.Coin);
        Tween.numberTo(this.currentMoney,Configs.Login.Coin, 0.3);
     //   cc.director.setClearColor(new cc.Color(0, 0, 0, 0))
      //  this.webview.node.zIndex = -2;
      BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
        Tween.numberTo(this.currentMoney, Configs.Login.Coin, 0.3);
      
    }, this);
      // this.myCanvas.node.zIndex =4;
      this.callToGetMoney();
    } 
//https://chocon/sport/user/getUserByToken?token=

     callToGetMoney(){
        Http.get(Configs.App.API, {c: 4025,}, (err, res) => {
            // console.log(res);
        
            if(res){

               // this.moneyBongDa.string =Utils.formatMoney(res['balance']*1000);
                Tween.numberTo(this.moneyBongDa,res['balance']*1000, 0.3);
               try {
                   
               } catch (error) {
                   
               }

            }
            
            
           // this.actClosePopUpNap();
        });
       
    }

    actBack(){
        this.actRut();
        App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
    }
    actNap(){

        let mMoney = Configs.Login.Coin;
        if(!mMoney){
            this.popUpNapRut.dismiss();
            this.alertDialog.showMsg("Lỗi không xác định.");
        }
        Http.get(Configs.App.API, {c: 4026, nickname: Configs.Login.Nickname, money: mMoney}, (err, res) => {
            // console.log(res);
            try {
                
                switch (parseInt(res["errorCode"])) {
                    case 0:
                        // console.log("Đăng nhập thành công.");
                        this.popUpNapRut.dismiss();
                        this.alertDialog.showMsg("Chuyển tiền thành công!");
                        this.currentMoneyQue = this.currentMoneyQue -mMoney;
                        //this.currentMoney.string = Utils.formatMoney(Configs.Login.Coin-mMoney);
                     //   Tween.numberTo(this.currentMoney,this.currentMoneyQue, 0.3);
                    
                        break;
                        
                    case 500:
                        this.alertDialog.showMsg("Chuyển tiền thất bại!");
                           // Tween.numberTo(this.currentMoney,this.currentMoneyQue, 0.3);
                        break;
                    default:
                        this.alertDialog.showMsg(res["errorCode"]);
                               // Tween.numberTo(this.currentMoney,this.currentMoneyQue, 0.3);
                        break;
                    }
    
                } catch (error) {
                    this.alertDialog.showMsg(res["errorCode"]);
                }
            Tween.numberTo(this.currentMoney,this.currentMoneyQue, 0.3);
           // this.actClosePopUpNap();
        });
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
       
      //  this.popUpNapRut.dismiss();
    }

    onchangeMoney(){
        let value = Utils.formatMoney(parseInt(this.money.string)) ;
        this.money.string = value;
    }
    actRut(){
        let mMoney = Utils.stringToInt(this.moneyBongDa.string);
        if(!mMoney){
            this.popUpNapRut.dismiss();
            this.alertDialog.showMsg("Lỗi không xác định.");
        }

        Http.get(Configs.App.API, {c: 4027, nickname: Configs.Login.Nickname, money: mMoney}, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) {
                this.alertDialog.showMsg("Lỗi không xác định.");
                return;
            }
            // console.log(res);
            try {
                
           
                // console.log(res);
                switch (parseInt(res["errorCode"])) {
                    case 0:
                        this.popUpNapRut.dismiss();
                        // console.log("Đăng nhập thành công.");
                        this.alertDialog.showMsg("Rút tiền thành công!");
                        this.currentMoney.string = Utils.formatMoney(Configs.Login.Coin+mMoney);
                        this.currentMoneyQue = this.currentMoneyQue +mMoney;
                      
                     
                        break;
                   
                    case 500:
                        this.popUpNapRut.dismiss();
                        this.alertDialog.showMsg("Rút tiền thất bại!");
                            
                        break;
                    default :
                        this.popUpNapRut.dismiss();
                        this.alertDialog.showMsg(res["errorCode"]);
                        
                        break;
                }
            } catch (error) {
                this.popUpNapRut.dismiss();
                this.alertDialog.showMsg(res["errorCode"]); 
            }
            Tween.numberTo(this.currentMoney, this.currentMoneyQue , 0.3);
        });
        //this.popUpNapRut.dismiss();
      //  this.actClosePopUpNap();
      BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
     // this.currentMoney.string = Utils.formatMoney(Configs.Login.Coin);
    }

    CloseAlert(){
        this.alertDialog.dismiss();
        this.actClosePopUpNap();
    }
    //ac
    actShowPopup(){
      //  this.bongdaDialog.dismiss();
        this.gameplayNode.active =false;
        this.callToGetMoney();
        this.popUpNapRut.show();

    }

    actClosePopUpNap(){
        this.popUpNapRut.dismiss();
        this.gameplayNode.active =true;
      //  this.bongdaDialog.show();
    }
     update (dt) {
        console.log("webview url la"+this.webview.url)
        if(this.webview.url=== Configs.App.BANCA || this.webview.url==="https://null"){
            App.instance.loadSceneFromBundle("Lobby", {"src": "Lobby"});
        }
     }
}
