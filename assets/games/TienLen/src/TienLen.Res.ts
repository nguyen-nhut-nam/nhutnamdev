import BundleControl from "../../../scripts/common/BundleControl";

export default class Res {
    static instance: Res;
    cards = [];
    cardItem = null;

    public static getInstance(): Res {
        if (this.instance == null)
            this.instance = new Res();
        return this.instance;
    }

    constructor() {
        BundleControl.loadBundle('TienLen').then(bundle => {
            bundle.loadDir("res/sprites/cards", cc.SpriteFrame, (err, sprs, urls) => {
                this.cards = sprs;
            });
            bundle.load("res/prefabs/TienLenCard", cc.Prefab, (err, prefab) => {
                this.cardItem = prefab;
            });
        });
    }

    getCardFace(index) {
        if (index < 10) index = "0" + index;
        return this.cards.filter(card => card.name == ("labai_" + index))[0];
    }

    getCardItem() {
        return this.cardItem;
    }
}
