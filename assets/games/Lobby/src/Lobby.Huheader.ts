import ItemGame from "./Lobby.ItemGame";
import Utils from "../../../scripts/common/Utils";
import Random from "../../../scripts/common/Random";
import Tween from "../../../scripts/common/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemSlotGame extends ItemGame {
    @property([cc.Label])
    lblJackpots: cc.Label[] = [];
    @property
    fakeJackpot: boolean = false;

    private jackpots: number[] = [0, 0, 0];
    private jackpotMax: number[] = [0, 0, 0];
    private updateNext: number[] = [0, 0, 0];

    start() {
        if (this.fakeJackpot) {
            for (let i = 0; i < 3; i++) {
                let scale = (i === 2) ? 10000 : 1000;
                this.jackpots[i] = Utils.randomRangeInt(5000 * scale, 6000 * scale);

                scale = (i === 2) ? 10000 : 1000;
                this.jackpotMax[i] = this.jackpots[i] + Utils.randomRangeInt(2000 * scale, 4000 * scale);

                if (this.lblJackpots[i]) {
                    this.updateJackpotLabel(i);
                }

                this.updateNext[i] = Utils.randomRangeInt(3, 10);
            }
        }
    }

    update(dt: number) {
        if (this.fakeJackpot) {
            for (let i = 0; i < 3; i++) {
                if (this.updateNext[i] > 0) {
                    this.updateNext[i] -= dt;
                    if (this.updateNext[i] < 0) {
                        this.updateNext[i] = Utils.randomRangeInt(3, 10);
                        this.jackpots[i] += Utils.randomRangeInt(50 * (i === 2 ? 10000 : 1000), 70 * (i === 2 ? 10000 : 1000));

                        if (this.jackpots[i] > this.jackpotMax[i]) {
                            this.jackpots[i] = (i === 2) ? 5000 * 10000 : 5000 * 1000;
                            this.jackpotMax[i] = this.jackpots[i] + Utils.randomRangeInt(2000 * (i === 2 ? 10000 : 1000), 4000 * (i === 2 ? 10000 : 1000));
                        }

                        if (this.lblJackpots[i]) {
                            this.updateJackpotLabel(i);
                        }
                    }
                }
            }
        }
    }

    private updateJackpotLabel(index: number) {
        Tween.numberTo(this.lblJackpots[index], this.jackpots[index], 1);
        this.lblJackpots[index].string = Utils.formatNumber(this.jackpots[index]);
    }
}
