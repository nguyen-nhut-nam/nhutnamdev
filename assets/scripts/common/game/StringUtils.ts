
const {ccclass, property} = cc._decorator;

@ccclass
export default class StringUtils extends cc.Component {

    public static formatMoneyNumberWithColom = function(number) {
        let isNegative = false;
        if(number < 0) {
            number *= -1;
            isNegative = true;
        }
        if(number < 1000) {
            let moneyString = Math.floor(number).toString();
            if(isNegative) {
                moneyString = "-" + moneyString;
            }
            return moneyString;
        }
        let n = "";
        let moneyString1 = Math.floor(number).toString();
        for(let i = moneyString1.length ; i >= 0; i -= 3) {
            if(i - 3 <= 0) {
                n = moneyString1.slice(0, i) + n;
                break;
            }
            n = "," + moneyString1.slice(i-3, i) + n;
        }
        if(isNegative) {
            n = "-" + n;
        }
        return n;
    }

    public static isNullOrEmpty(string) {
        return !string && string === "" && string.length === 0;
    }
}
