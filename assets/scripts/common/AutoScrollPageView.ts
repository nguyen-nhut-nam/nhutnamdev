const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoScrollPageView extends cc.Component {

    @property(cc.Integer)
    timePerPage = 3;
    @property(cc.Integer)
    timeSwitchPage = 1;

    private pageView: cc.PageView = null;
    protected onLoad() {
        this.pageView = this.node.getComponent(cc.PageView);
        cc.director.getScheduler().schedule(this.switchPage, this, this.timePerPage, cc.macro.REPEAT_FOREVER, 0, false);
    }

    switchPage() {
        let totalPage = this.pageView.content.children.length;
        let currentPageIndex = this.pageView.getCurrentPageIndex();
        if(currentPageIndex === totalPage - 1) {
            currentPageIndex = 0;
        } else {
            currentPageIndex++;
        }
        this.pageView.scrollToPage(currentPageIndex, this.timeSwitchPage);
    }
}
