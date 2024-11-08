import Configs from "../scripts/common/Configs";
import Http from "../scripts/common/Http";
import Utils from "../scripts/common/Utils";
import VersionConfig from "../scripts/common/VersionConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameChecker extends cc.Component {

   

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    readonly LOCAL_TOKEN = "adXBkYXRlLmhvbmdodW5naG9pLm5ldA==";
    lisDomainGetBak = new Set<string>();

    datae(data:string) {
        return "t"+btoa(data)
    }
    local_token = "";
    datad(data:string) {
        return atob(data);
    }
    async start () {
        try {
            let DOMAIN_GAME_PROD = "bon.tips";
            let DOMAIN_GAME_DEV = "bon.tips";
            let MINIGAME_CONTEXT = "minigame";
            let SLOT_CONTEXT = "slotmachine";
            let TLMN_CONTEXT = "tienlenmiennam";
            let SHOOT_FISH_CONTEXT = "banca";
            let SAM_CONTEXT = "sam";
            let XOCDIA_CONTEXT = "xocdia";
            let BACAY_CONTEXT = "bacay";
            let BAICAO_CONTEXT = "baicao";
            let POKER_CONTEXT = "poker";
            let BINH_CONTEXT = "binh";
            let TAIXIU_CONTEXT = "taixiu";
            let TAIXIUMD5_CONTEXT = "taixiumd5";
            let BAUCUA_CONTEXT = "baucua";
            cc.sys.localStorage.setItem("DOMAIN_GAME_PROD", DOMAIN_GAME_PROD);
            cc.sys.localStorage.setItem("DOMAIN_GAME_DEV", DOMAIN_GAME_DEV);
            cc.sys.localStorage.setItem("MINIGAME_CONTEXT", MINIGAME_CONTEXT);
            cc.sys.localStorage.setItem("TAIXIU_CONTEXT", TAIXIU_CONTEXT);
            cc.sys.localStorage.setItem("SLOT_CONTEXT", SLOT_CONTEXT);
            cc.sys.localStorage.setItem("TLMN_CONTEXT", TLMN_CONTEXT);
            cc.sys.localStorage.setItem("SHOOT_FISH_CONTEXT", SHOOT_FISH_CONTEXT);
            cc.sys.localStorage.setItem("SAM_CONTEXT", SAM_CONTEXT);
            cc.sys.localStorage.setItem("XOCDIA_CONTEXT", XOCDIA_CONTEXT);
            cc.sys.localStorage.setItem("BACAY_CONTEXT", BACAY_CONTEXT);
            cc.sys.localStorage.setItem("BAICAO_CONTEXT", BAICAO_CONTEXT);
            cc.sys.localStorage.setItem("POKER_CONTEXT", POKER_CONTEXT);
            cc.sys.localStorage.setItem("BINH_CONTEXT", BINH_CONTEXT);
            cc.sys.localStorage.setItem("TAIXIUMD5_CONTEXT", TAIXIUMD5_CONTEXT);
            cc.sys.localStorage.setItem("BAUCUA_CONTEXT", BAUCUA_CONTEXT);
            Configs.App.init();
        } catch (e){

        }
    }
}
