import ItemGame, { ItemGameType } from "./Lobby.ItemGame";
import Tween from "../../../scripts/common/Tween";
import ItemSlotGame from "./Lobby.ItemSlotGame";
import nodeUtils from "../../../scripts/common/NodeUtils";
import array = cc.js.array;
import log = cc.log;

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.TabsListGameTab")
export class Tab {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Node)
    bgAnimaiton: cc.Node = null;
    
}

@ccclass
export default class TabsListGame extends cc.Component {

    @property([Tab])
    tabs: Tab[] = [];

    @property([ItemGame])
    itemGames: ItemGame[] = [];

    @property({type: cc.Node})
    Games: cc.Node = null;

    @property({type: cc.Node})
    scrollView: cc.Node = null;

    private seletectIdx = 0;

    start() {
        for (let i = 0; i < this.tabs.length; i++) {
            let tab = this.tabs[i];
            tab.button.node.on(cc.Node.EventType.TOUCH_START, () => {
                console.log("okkk")
                this.seletectIdx = i;
                for (let j = 0; j < this.tabs.length; j++) {
                    let tab = this.tabs[j];
                    if(this.seletectIdx == j){
                        tab.bgAnimaiton.active = true;
                    } else{
                       // tab.bgAnimaiton.getComponent(sp.Skeleton).
                       tab.bgAnimaiton.active  = false;
                    }
                     
                //    tab.bgAnimaiton.active = this.seletectIdx == j ? true: false;
                }
                console.log("click heree");
                try {
                    this.onTabChanged();
                } catch (error) {
                    
                }
                
            });
       //     tab.button.getComponent(Node).getChildByName("Bg")
         //   tab.button.getComponent(cc.Sprite).spriteFrame = this.seletectIdx == i ? tab.sfActive : tab.sfNormal;
        if(this.seletectIdx == i){
           // tab.bgAnimaiton.getComponent(sp.Skeleton).setAnimation(0,"Button_ON",true); 
           tab.bgAnimaiton.active = true;
        } else{
          //  tab.bgAnimaiton.getComponent(sp.Skeleton).setAnimation(0,"Button_OFF",false); 
          tab.bgAnimaiton.active  = false;
        }
        }
        this.onTabChanged();
    }

    private onTabChanged() {
        switch (this.seletectIdx) {
            case 0:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if(this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = true;
                }
                this.actShowAll();
                break;
            case 1:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if(this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = true;
                    //this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.CARD;
                }
                this.actShowMiniGameOnly();
                break;
            case 2:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if(this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = true;
                    //this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.SLOT;
                }
                this.actShowSlotOnly();
                break;
            case 3:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if(this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = true;
                    //this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.OTHER;
                }
                this.actShowGameBaiOnly();
                break;
            case 4:
                    for (let i = 0; i < this.itemGames.length; i++) {
                        if(this.itemGames[i] == null) continue;
                        this.itemGames[i].node.active = true;
                        //this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.SLOT;
                    }
                    this.actShowCasino();
                    break;
            case 5:
                    for (let i = 0; i < this.itemGames.length; i++) {
                        if(this.itemGames[i] == null) continue;
                        this.itemGames[i].node.active = true;
                        //this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.OTHER;
                    }
                    this.actShowListGameBanca();
                    break;
        }
    }

    public getItemGameWithId(id: string): ItemSlotGame {
        for (let i = 0; i < this.itemGames.length; i++) {
            if (this.itemGames[i].id == id) {
                return this.itemGames[i] as ItemSlotGame;
            }
        }
        return null;
    }

    public updateItemJackpots(id: string, j100: number, x2J100: boolean, j1000: number, x2J1000: boolean, j10000: number, x2J10000: boolean) {
       try {
                  let itemGame = this.getItemGameWithId(id);
        if (id != null && itemGame) {
            Tween.numberTo(itemGame.lblJackpots[0], j100, 2);
            Tween.numberTo(itemGame.lblJackpots[1], j1000, 2);
            Tween.numberTo(itemGame.lblJackpots[2], j10000, 2);
        }
       } catch (error) {
           
       }
 
    }

    actShowAll() {
        this.Games.children.forEach(game => {
            nodeUtils.activeNode(game);
        });
        let listAlwaysHidden = ["gaixinh"];
        this.actHideGameOnly(listAlwaysHidden);
    }


    actShowMiniGameOnly() {
        let listMiniGame = ["", "minigame", ""];
        this.actShowListGameOnly(listMiniGame);
    }
    actShowCasino() {
        let listcasino = ["taixiu","sicbo", "XocDia-BauCua"];
        this.actShowListGameOnly(listcasino);
    }
    actShowListGameBanca() {
        let listbanca = ["sieubanca","vuasanca", "sieubanca1"];
        this.actShowListGameOnly(listbanca);
    }

    private actShowSlotOnly() {
        let listSlot = ["advenger", "privateking", "Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Slot6", "Slot7", "Slot8", "Slot9", "Slot10", "Slot11", "Slot12", "FastDau1"];
        this.actShowListGameOnly(listSlot);
    }

    private actShowGameBaiOnly() {
        let listGameBai = ["gamebai",""];
        this.actShowListGameOnly(listGameBai);
    }
    // private actShowCasinoOnly() {
    //     let listcasino = ["gamebai","gamebai-v2"];
    //     this.actShowListGameOnly(listcasino);
    // }
    actHideGameOnly(listAlwaysHide: string[]) {
        this.Games.children.forEach(game => {
            if (listAlwaysHide.indexOf(game.name) !== -1) {
                nodeUtils.disableNode(game);
            }
        });
    }
    private actShowListGameOnly(listGame: string[]) {
        let listAlwaysHidden = ["gaixinh"];
        this.Games.children.forEach(game => {
            if (listGame.indexOf(game.name) === -1) {
                nodeUtils.disableNode(game);
            } else {
                nodeUtils.activeNode(game);
            }
            if (listAlwaysHidden.indexOf(game.name) !== -1) {
                nodeUtils.disableNode(game);
            }
        });
    }
    // update (dt) {}
}
