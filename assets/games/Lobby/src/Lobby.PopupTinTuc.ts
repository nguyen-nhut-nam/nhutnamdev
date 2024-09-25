import Dialog from "../../../scripts/common/Dialog";
import InPacket from "../../../scripts/networks/Network.InPacket";
import MiniGameNetworkClient from "../../../scripts/networks/MiniGameNetworkClient";
import App from "../../../scripts/common/App";
import Http from "../../../scripts/common/Http";
import Configs from "../../../scripts/common/Configs";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupTinTuc.TabTinTuc")
export class TabTinTuc {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    @property(cc.Label)
    lbTimeThongBao: cc.Label = null;
    @property(cc.Label)
    lbThongTinChiTiet: cc.Label = null;

    start() {
        //console.log("TabTinTuc");
        this.loadData();
    }

    private getItem(): cc.Node {
        let item = null;
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            let node = this.itemTemplate.parent.children[i];
            if (node != this.itemTemplate && !node.active) {
                item = node;
                break;
            }
        }
        if (item == null) {
            item = cc.instantiate(this.itemTemplate);
            item.parent = this.itemTemplate.parent;
        }
        item.active = true;
        return item;
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 4082 }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            for (let i = 0; i < res["clientsun"].TinTuc.length; i++) {
                let itemData = res["clientsun"].TinTuc[i];
                let time = itemData["time"];
                let title = itemData["title"];
                let item = this.getItem();
                item.getChildByName("lbtime").getComponent(cc.Label).string = time;
                item.getChildByName("lbtitle").getComponent(cc.Label).string = title;
                item.off("click");
                item.on("click", () => {
                    //console.log(itemData["content"]);
                    this.lbThongTinChiTiet.string = itemData["content"];
                    this.lbTimeThongBao.string = "Lúc: " + time;
                });
            }

        });
    }

}


@ccclass("Lobby.PopupTinTuc.TabHomThu")
export class TabHomThu {
    @property(cc.Label)
    lblHomThu: cc.Label = null;
    start() {
        //console.log("TabHomThu");
    }
}


@ccclass
export default class PopupTinTuc extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(cc.Node)
    nodeTap: cc.Node = null;
    @property(cc.Node)
    listTinTuc: cc.Node = null;
    @property(cc.Node)
    tinChiTiet: cc.Node = null;

    @property(TabTinTuc)
    tabTinTuc: TabTinTuc = null;
    @property(TabHomThu)
    TabHomThu: TabHomThu = null;



    private tabSelectedIdx = 0;

    start() {

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {


            }
        }, this);


        this.tabTinTuc.start();
        this.TabHomThu.start();
    }

    actNext() {
        console.log(self);
        this.nodeTap.active = false;
        this.listTinTuc.active = false;
        this.tinChiTiet.active = true;
    }
    actBack() {
        this.nodeTap.active = true;
        this.listTinTuc.active = true;
        this.tinChiTiet.active = false;
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            //this.tabs.toggleItems[j].node.opacity = j == this.tabSelectedIdx ? 255 : 150;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                //console.log("Tin nóng");
                break;
            case 1:
                //console.log("Hòm thử");
                break;
        }
    }


    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }
    
}
