const {ccclass, property} = cc._decorator;

@ccclass
export default class UIToggleSlider extends cc.Component {

    @property(cc.Node)
    iconChose = null;
    @property(cc.Float)
    moveX = 0;
    @property(cc.Float)
    offset = 0;
    @property(cc.SpriteFrame)
    sprOn = null;
    @property(cc.SpriteFrame)
    sprOff = null;
    @property(cc.Boolean)
    isChangeSpriteOnOff = false;

    public onValueChange: (onSelect) => void = null;
    public _isOnSelect = false;

    isOnChange(isOnSelect) {
        if(this._isOnSelect !== isOnSelect || this.iconChose.getNumberOfRunningActions() === 0) {
            this._isOnSelect = isOnSelect;
            this.iconChose.runAction(
                cc.moveTo(.1, new cc.Vec2(this._isOnSelect ? this.moveX : - this.moveX, this.iconChose.position.y))
            )
            this.onValueChange(this._isOnSelect);
            if(this.isChangeSpriteOnOff && this.sprOn != null && this.sprOff != null) {
                this.iconChose.getComponent(cc.Sprite).spriteFrame = this._isOnSelect ? this.sprOn : this.sprOff;
            }
        }
    }

    initStart(isOnSelect) {
        this.moveX = this.node.width / 2 - this.iconChose.width / 2 - this.offset;
        this._isOnSelect = isOnSelect;
        this.iconChose.position = new cc.Vec2(this._isOnSelect ? this.moveX : -1 * this.moveX, this.iconChose.position.y);
        if(this.isChangeSpriteOnOff && this.sprOn != null && this.sprOff != null) {
            this.iconChose.getComponent(cc.Sprite).spriteFrame = this._isOnSelect ? this.sprOn : this.sprOff;
        }
    }

    onClick() {
        this.isOnChange(!this._isOnSelect);
    }
}
