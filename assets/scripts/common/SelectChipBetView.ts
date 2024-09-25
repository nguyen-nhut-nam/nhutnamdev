const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectChipBetView extends cc.Component {

    @property(cc.Button)
    btnPrev = null;
    @property(cc.Button)
    btnNext = null;
    @property(cc.Float)
    zoomScale = 0.95;
    @property(cc.Float)
    normalScale = 0.8;
    @property(cc.Integer)
    visibleItem = 4;
    @property([cc.Integer])
    itemMoney = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];

    private _betMoney = this.itemMoney[0];
    private _currentCoinSelected = 0;
    private _totalStep = 0;
    private _currStep = 0;
    private _scrollTouchBegin = false;
    private _offsetChip = [];

    protected onLoad() {

        this._totalStep = this.itemMoney.length - this.visibleItem;
        let scrollView = this.node.getComponent(cc.ScrollView);
        let step = scrollView.getMaxScrollOffset().x / this.visibleItem;
        for(let i = 0; i < this._totalStep;  i++) {
            this._offsetChip[i] = step * i;
        }
        scrollView.scrollToLeft(0);
        this.selectBetCoin(0);
    }

    private selectBetCoin(index) {
        if(this.btnPrev)
            this.btnPrev.interactable = index != 0;
        if(this.btnNext)
            this.btnNext.interactable = index != this.itemMoney.length;

        this._betMoney = this.itemMoney[index];
        let _chips = this.node.getChildByName("content");
        _chips.children[index].getComponent(cc.Toggle).isChecked = true;
        for(let i = 0 ; i < _chips.children.length; i++) {
            if(_chips.children[i].getComponent(cc.Toggle).isChecked) {
                this._currentCoinSelected = i;
                _chips.children[i].scale = this.zoomScale;
            } else {
                _chips.children[i].scale = this.normalScale;
            }
        }
    }

    private checkScrollOffsetNext() {
        let scrollView = this.node.getComponent(cc.ScrollView);
        if(this._currentCoinSelected + this._currStep > this._totalStep - 1) {
            let next = (scrollView.getScrollOffset().x * -1) + scrollView.getMaxScrollOffset().x / this.visibleItem;
            scrollView.scrollToOffset(cc.v2(next, 0), 0.2);
        }
    }

    private checkScrollOffsetPrev() {
        let scrollView = this.node.getComponent(cc.ScrollView);
        if(this._currentCoinSelected < this._currStep) {
            let prev = (scrollView.getScrollOffset().x * -1) - scrollView.getMaxScrollOffset().x / this.visibleItem;
            scrollView.scrollToOffset(cc.v2(prev, 0), 0.2);
        }
    }

    onScrollChip(scrollView, event) {
        if(event == cc.ScrollView.EventType.SCROLL_BEGAN) {
            this._scrollTouchBegin = true;
        } else if(event == cc.ScrollView.EventType.SCROLL_ENDED) {
            let offset = (scrollView.getScrollOffset().x * -1);
            let closest = this._offsetChip.reduce(function(prev, curr) {
               return (Math.abs(curr-offset) < Math.abs(prev - offset) ? curr : prev);
            });

            this._currStep = this._offsetChip.indexOf(closest);
            if(this._currentCoinSelected < this._currStep) {
                this.selectBetCoin(this._currStep);
            } else {
                this.selectBetCoin(this._currStep + this._totalStep - 1);
            }

            if(!this._scrollTouchBegin)return;
            scrollView.scrollToOffset(cc.v2(closest, 0), 0.2);
            this._scrollTouchBegin = false;
        }
    }

    onTogglePress(_sender: any, _eventData: any) {
        _sender.currentTarget = _sender.node;
        this.onBtnPress(_sender, _eventData);
    }

    onBtnPress(_sender: any, _eventData: any) {
        if(_sender.currentTarget.name.includes('btn_chip')) {
            let indexBet = parseInt(_eventData);
            this.selectBetCoin(indexBet);
            return;
        }

        switch (_sender.currentTarget.name) {
            case "btnPrev":
                this._currentCoinSelected--;
                if(this._currentCoinSelected < 0) {
                    this._currentCoinSelected = 0;
                }
                this.selectBetCoin(this._currentCoinSelected);
                this.checkScrollOffsetPrev();
                break;
            case "btnNext":
                this._currentCoinSelected++;
                if(this._currentCoinSelected > this.itemMoney.length - 1) {
                    this._currentCoinSelected = this.itemMoney.length - 1;
                }
                this.selectBetCoin(this._currentCoinSelected);
                this.checkScrollOffsetNext();
                break;
        }
    }
}
