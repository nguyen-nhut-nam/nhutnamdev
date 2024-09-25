import Dialog from "../../../scripts/common/Dialog";
import nodeUtils from "../../../scripts/common/NodeUtils";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";
import App from "../../../scripts/common/App";

const {ccclass, property} = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupRulerGame extends Dialog {

        // @property({type: cc.Node})
        // listGame: cc.Node[] = [];
        // @property({type: cc.Node})
        // listRuler: cc.Node[] = [];
        //
        // @property(cc.Node)
        // content: cc.Node = null;
        //
        // @property(cc.Node)
        // lblGameName: cc.Node = null;
        //
        // private rulerSelected: cc.Node = null;
        //
        // private readonly baseHeight = 330;
        // private readonly listGamesName = ["TIẾN LÊN MIỀN NAM", "SÂM LỐc", "BA CÂY", "MẬU BINH", "LIÊNG", "POKER",
        //     "XÌ TỐ", "PHỎM", "XÓC ĐĨA", "BLACK JACK", "TIẾN LÊN ĐẾM LÁ", "TÀI XỈU", "MINI POKER", "KIM CƯƠNG"];
        @property(cc.WebView)
        webView: cc.WebView = null;

        private linkUrl = "https://rule.linksunwin.top/";
        protected start() {
            this.webView.url = this.linkUrl;
            Http.get(Configs.App.API, {"c": 4082}, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                this.linkUrl = res["clientsun"].huongdan.ruller;
                console.log("urrl ", this.linkUrl);
                this.webView.url = this.linkUrl;
            });
            // this.rulerSelected = this.listRuler[0];
            // this.actUpdateFirstRulerHeight();
            // this.actUpdateRulerHeight();
            // this.actUpdateContentHeight();
            // for (let i = 0; i < this.listGame.length; ++i) {
            //     this.listGame[i].on("click", () => {
            //         nodeUtils.setNodeLabel(this.lblGameName, this.listGamesName[i]);
            //         this.rulerSelected = this.listRuler[i];
            //         this.listRuler.forEach(ruler => {
            //             nodeUtils.disableNode(ruler);
            //         })
            //         nodeUtils.activeNode(this.rulerSelected);
            //         this.actUpdateFirstRulerHeight();
            //         this.actUpdateRulerHeight();
            //         this.actUpdateContentHeight();
            //     })
            // }
        }

        // actUpdateFirstRulerHeight() {
        //     let rulerID = nodeUtils.getChildNode(this.rulerSelected, "ruler1");
        //     if (rulerID == null) {
        //         return;
        //     }
        //     rulerID.height = nodeUtils.getChildNode(rulerID, "btn").height
        //         + nodeUtils.getChildNode(rulerID, "ruler").height;
        // }
        //
        // actHideAllRuler() {
        //     this.rulerSelected.children.forEach(ruler => {
        //         cc.tween(ruler)
        //             .to(0.5, {height: 60})
        //             .delay(1)
        //             .start()
        //         ruler.height = 60;
        //     })
        //     this.rulerSelected.height = this.rulerSelected.childrenCount * 60;
        // }
        //
        // actShowRuler(id) {
        //     let rulerID = nodeUtils.getChildNode(this.rulerSelected, "ruler" + id);
        //     if (rulerID === null) {
        //         return;
        //     }
        //     this.actHideAllRuler();
        //     let height = nodeUtils.getChildNode(rulerID, "btn").height;
        //     let rulerImg = nodeUtils.getChildNode(rulerID, "ruler");
        //     if (rulerID.height == height) {
        //         height += rulerImg.height;
        //     }
        //     cc.tween(rulerID)
        //         .to(0.5, {height: height})
        //         .delay(1)
        //         .start()
        //     rulerID.height = height;
        //     this.actUpdateRulerHeight();
        //     this.actUpdateContentHeight();
        // }
        //
        // actUpdateRulerHeight() {
        //     let height = 0;
        //     this.rulerSelected.children.forEach(item => {
        //         height += item.height;
        //     })
        //     this.rulerSelected.height = height + 50;
        // }
        //
        // actUpdateContentHeight() {
        //     this.content.height = this.baseHeight + this.rulerSelected.height + 50;
        // }
        //
        // actShowGameRuler(event, id) {
        //     this.listRuler.forEach(ruler => {
        //         nodeUtils.disableNode(ruler);
        //     })
        //     nodeUtils.activeNode(this.rulerSelected);
        //     this.actUpdateContentHeight();
        //     this.actShowRuler(id);
        // }
    }
}
export default Lobby.PopupRulerGame;