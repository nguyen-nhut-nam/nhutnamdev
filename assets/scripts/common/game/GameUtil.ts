import {common} from "../Utils";
import Utils = common.Utils;
import StringUtils from "./StringUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUtil extends cc.Component {

    public static runAnimationMoneyWithColom(label, oldValueMoney, newValueMoney, delayTime = .6) {
        let interval = 0.06;
        if(label.node.active) {
            var delta = (newValueMoney - oldValueMoney) / delayTime;
            label.unscheduleAllCallbacks();
            if(delta != 0) {
                let functionRun = function(n) {
                    oldValueMoney += delta * n;
                    if(Math.abs(oldValueMoney - newValueMoney) < Math.abs(delta * n * 2)) {
                        oldValueMoney = newValueMoney;
                        label.string = StringUtils.formatMoneyNumberWithColom(oldValueMoney);
                        label.unschedule(functionRun);
                    } else {
                        label.string = StringUtils.formatMoneyNumberWithColom(oldValueMoney);
                    }
                };
                label.schedule(functionRun, interval);
            } else {
                label.string = StringUtils.formatMoneyNumberWithColom(newValueMoney);
            }
        }
    }
}
