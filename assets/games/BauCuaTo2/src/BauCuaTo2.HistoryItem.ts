const {ccclass, property} = cc._decorator;

@ccclass
export default class BauCuaTo2HistoryItem extends cc.Component {

    initHistoryItem(historyItem) {
        console.log(historyItem);
    }
}
