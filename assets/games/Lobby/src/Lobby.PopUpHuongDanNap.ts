// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../../scripts/common/Dialog";
import nodeUtils from "../../../scripts/common/NodeUtils";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";

const {ccclass, property} = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopUpHuongDanNap extends Dialog {

        // @property({type: cc.Node})
        // hdBank: cc.Node = null;
        // @property({type: cc.Node})
        // hdSmartLink: cc.Node = null;
        // @property({type: cc.Node})
        // codePay: cc.Node = null;
        // @property({type: cc.Node})
        // momo: cc.Node = null;
        //
        // @property({type: cc.Node})
        // content: cc.Node = null;
        //
        // @property({type: cc.ScrollView})
        // scrollView : cc.ScrollView = null;
        // LIFE-CYCLE CALLBACKS:

        // onLoad () {}
        @property(cc.WebView)
        webView: cc.WebView = null;

        private hdBank = "https://huongdan.linksunwin.top/nap-tien-banking/"
        private hdSmartLink = "https://huongdan.linksunwin.top/nap-tien-smartlink/"
        private hdCodePay = "https://huongdan.linksunwin.top/nap-tien-codepay/"
        private hdMomo = "https://huongdan.linksunwin.top/nap-tien-vidientu/"
        private url ;

        start() {
            Http.get(Configs.App.API, {"c": 4082}, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                this.hdBank = res["clientsun"].huongdan.napBank;
                this.hdSmartLink = res["clientsun"].huongdan.napSmartLink;
                this.hdCodePay = res["clientsun"].huongdan.napCodePay;
                this.hdMomo = res["clientsun"].huongdan.napMomo;
            });
            // nodeUtils.disableNode(this.hdSmartLink);
            // nodeUtils.disableNode(this.codePay);
            // nodeUtils.disableNode(this.momo);
        }

        disableAll() {
            // nodeUtils.disableNode(this.hdBank);
            // nodeUtils.disableNode(this.hdSmartLink);
            // nodeUtils.disableNode(this.codePay);
            // nodeUtils.disableNode(this.momo);
        }

        showHuongDan(event, id) {
            this.disableAll();
            let idx = parseInt(id);
            //let nodeActive = null;
            if (idx === 1) {
                this.url = this.hdBank;
                // nodeActive = this.hdBank;
            } else if (idx === 2) {
                this.url = this.hdSmartLink;
                // nodeActive = this.hdSmartLink;
            } else if (idx === 3) {
                this.url = this.hdCodePay;
                //nodeActive = this.codePay;
            } else if (idx === 4) {
                this.url = this.hdMomo;
                //nodeActive = this.momo;
            } else {
                this.url = this.hdBank;
                // nodeActive = this.hdBank;
            }
            this.webView.url = this.url;
            // this.scrollView.content.height = nodeActive.height;
            // nodeUtils.activeNode(nodeActive);
            this.show();
        }

        show() {
            super.show();
        }

        // update (dt) {}
    }
}
export default Lobby.PopUpHuongDanNap;
 

