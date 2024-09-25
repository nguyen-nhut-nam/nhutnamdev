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
            Utils.checkHealth(Configs.App.CONFIG_HOST_URL).then((data) => {
                let DOMAIN_GAME_PROD = data["domainProd"];
                let DOMAIN_GAME_DEV = data['domainDev'];
                let MINIGAME_CONTEXT = data["minigame"];
                let SLOT_CONTEXT = data["slotmachine"];
                let TLMN_CONTEXT = data["tlmn"];
                let SHOOT_FISH_CONTEXT = data["banca"];
                let SAM_CONTEXT = data["sam"];
                let XOCDIA_CONTEXT = data["xocdia"];
                let BACAY_CONTEXT = data["bacay"];
                let BAICAO_CONTEXT = data["baicao"];
                let POKER_CONTEXT = data["poker"];
                let BINH_CONTEXT = data["binh"];
                let TAIXIU_CONTEXT = data["taixiu"];
                let TAIXIUMD5_CONTEXT = data["taixiumd5"];
                let BAUCUA_CONTEXT = data['baucua'];
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
            });

        } catch (e){

        }
    }
}
