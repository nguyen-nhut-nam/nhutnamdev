

const { ccclass, property } = cc._decorator;



let setChildrenColor = function (node, color) {
    for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if(child.name == 'load' && color != 1) return;
        child.color = color;
        setChildrenColor(child, color);
    }
};

@ccclass
export class ColorChild extends cc.Component {
    private _colorFill: any;
    private _darken: number;

    @property(cc.Float)
    Pressed = 0.7;

    start() {
        let self = this;
        function onTouchDown (event) {
            self.setDarken(self.Pressed);
        }
        function onTouchUp (event) {
            self.setDarken(1);
        }

        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }

    getColor() {
        return this.node.color;
    }

    setColor(color) {
        this.node.color = color;
        setChildrenColor(this.node, color);
    }

    getDarken() {
        return this._darken || 1.0;
    }

    setDarken(_value) {
        if (_value > 1)
            _value = 1;
        this._darken = _value;
        var color = this.node.color;
        // @ts-ignore
        color = cc.color(255 * _value, 255 * _value, 255 * _value, color.a);
        this.node.color = color;
        setChildrenColor(this.node, color);
    }

}
