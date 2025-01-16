import SPUtils from "./SPUtils";
import Http from "./Http";
import VersionConfig from "./VersionConfig";

namespace Configs {
    export class Login {
        static UserId: number = 0;
        static Username: string = "";
        static Password: string = "";
        static Nickname: string = "";
        static Avatar: string = "";
        static Coin: number = 0;
        static IsLogin: boolean = false;
        static AccessToken: string = "";
        static SessionKey: string = "";
        static LuckyWheel: number = 0;
        static CreateTime: string = "";
        static Birthday: string = "";
        static IpAddress: string = "";
        static VipPoint: number = 0;
        static VipPointSave: number = 0;
        static MobileSecured: boolean = false;
        static AppSecured: boolean = false;
        static BanTransfer: boolean = false;

        static CoinFish: number = 0;
        static UserIdFish: number = 0;
        static UsernameFish: string = "";
        static PasswordFish: string = "";
        static FishConfigs: any = null;
        static BitcoinToken: string = "";

        static clear() {
            this.UserId = 0;
            this.Nickname = "";
            this.Avatar = "";
            this.Coin = 0;
            this.IsLogin = false;
            this.AccessToken = "";
            this.SessionKey = "";
            this.CreateTime = "";
            this.Birthday = "";
            this.IpAddress = "";
            this.VipPoint = 0;
            this.VipPointSave = 0;
            this.CoinFish = 0;
            this.UserIdFish = 0;
            this.UsernameFish = "";
            this.PasswordFish = "";
            this.BitcoinToken = "";
        }

        static readonly VipPoints = [80, 800, 4500, 8600, 12000, 50000, 1000000, 2000000];
        static readonly VipPointsName = ["Đá", "Đồng", "Bạc", "Vàng", "BK1", "BK2", "KC1", "KC2", "KC3"];
        static getVipPointName(): string {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    return this.VipPointsName[i + 1];
                }
            }
            return this.VipPointsName[0];
        }
        static getVipPointNextLevel(): number {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    if (i == this.VipPoints.length - 1) {
                        return this.VipPoints[i];
                    }
                    return this.VipPoints[i + 1];
                }
            }
            return this.VipPoints[0];
        }
        static getVipPointIndex(): number {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    return i;
                }
            }
            return 0;
        }
    }

    export class App {
        static CONFIG_URL = `https://raw.githubusercontent.com/chaunhuanphat/dev-tito/master/production.json?v=${Date.now()}`;
        static HOT_UPDATE_URL = "https://raw.githubusercontent.com/chaunhuanphat/dev-tito/master/";
        static BUNDLE_URL = "bon5.win/remote-assets";
        static DOMAIN: string = "https://demo.eloras.icu";
        static API: string = "https://eloras.icu/api";
        static MONEY_TYPE = 1;
        static LINK_DOWNLOAD = "https://eloras.icu/download";
        static LINK_EVENT = "https://eloras.icu/event";
        static LINK_SUPPORT = "https://eloras.icu";
        static USE_WSS = true;
        //static LINK_GROUP = "https://www.facebook.com/groups/bao99.vip";
        static LINK_GROUP = "";
        static BANCA = "https://banca.honghunghoi.net";
        static SICBO = "https://sicbo.honghunghoi.net";
        static XENG777 = "https://xeng777.honghunghoi.net";
        static LINK_BOT_OTP = "https://t.me/sunsunotp_bot";
        static MAP_DAILY = [];
        static BUNDLE_CONFIG = {
            bundleVers: '',
            jsList: []
        }

        static  HOST_MINIGAME = {
            
            host: "wmini.eloras.icu",
            port: 443
        };
        static  HOST_BAU_CUA_TO2 = {
            
            host: "wbaucuato2.eloras.icu",
            port: 443
        };
        static  HOST_TAIXIU = {
            host: "wbaucuato2.eloras.icu",
            port: 443
        };
        static  HOST_TAI_XIU_MINI2 = {
            
            host: "overunder.eloras.icu",
            port: 443
        };
        static  HOST_SLOT = {
           
            host: "wslot.eloras.icu",
            port: 443
        };
        static  HOST_TLMN = {
            
            host: "wltmn.eloras.icu",
            port: 443
        };
        static  HOST_SHOOT_FISH = {
            
            host: "wbanca.eloras.icu",
            port: 443
        };
        static  HOST_SAM = {
            host: "wsam.eloras.icu",
            
            port: 443
        };
        static  HOST_XOCDIA = {
            host: "wxocdia.eloras.icu",
            port: 443
        };
        static  HOST_BACAY = {
            host: "wbacay.eloras.icu",
            port: 443
        };
        static  HOST_BAICAO = {
            host: "wbaicao.eloras.icu",
            port: 443
        }
        static  HOST_POKER = {
            host: "wpoker.eloras.icu",
            port: 443
        };
        static  HOST_XIDACH = {
            host: "wpoker.eloras.icu",
            port: 443
        };
        static  HOST_BINH = {
            host: "wpoker.eloras.icu",
            port: 443
        };
        static  HOST_LIENG = {
            host: "wpoker.eloras.icu",
            port: 443
        };
        static  HOST_TAIXIU_MD5 = {
            host: "wbaucuato2.eloras.icu",
            port: 12044
        };
        static  HOST_TAIXIU_LIVE_KUBET = {
            host: "wbaucuato2.eloras.icu",
            port: 12044
        };
        static  HOST_XOCDIA_LIVE_KUBET = {
            host: "wbaucuato2.eloras.icu",
            port: 12044
        };

        static readonly SERVER_CONFIG = {
            ratioNapTheVTT: 1,
            ratioNapTheVNP: 1,
            ratioNapTheVMS: 1,
            ratioNapMomo: 1.2,
            ratioTransfer: 0.98,
            ratioTransferDL: 1,
            listTenNhaMang: ["Viettel", "Vinaphone", "Mobifone", "Vietnamobile"],
            listIdNhaMang: [0, 1, 2, 3],
            listMenhGiaNapThe: [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000],
            ratioRutThe: 1.2
        };
        static readonly CASHOUT_CARD_CONFIG = {
            listTenNhaMang: ["Viettel", "Vinaphone", "Mobifone"],
            listIdNhaMang: ["VT", "VN", "MB"],
            listMenhGiaNapThe: [10000, 20000, 30000, 50000, 100000, 200000, 500000],
            listQuantity: ["1", "2","3"]
        }
        static  BILLING_CONF : any;
        //static HOST_MAUBINH: any;

        static  listmember=[];

        static getRoomMember(){
            // Http.get(Configs.App.API, { "c": 4006 }, (err, res) => {
            //     // console.log(res);
            //     Configs.App.listmember=[];
            //         for (let i = 0; i < res["listTable"].length; i++) {
            //             let itemData = res["listTable"][i]["num"];
            //             Configs.App.listmember.push(itemData);
            //         }
            // });
        }
        static getServerConfig() {
            Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                if (err == null) {
                    // console.log(res);
                    App.SERVER_CONFIG.ratioNapTheVTT = res.ratio_nap_the_vt;
                    App.SERVER_CONFIG.ratioNapTheVNP = res.ratio_nap_the_vn;
                    App.SERVER_CONFIG.ratioNapTheVMS = res.ratio_nap_the_mb;
                    App.SERVER_CONFIG.ratioTransfer = res.ratio_chuyen;
                    App.SERVER_CONFIG.ratioTransferDL = res.ratio_transfer_dl_1;
                    App.SERVER_CONFIG.ratioRutThe = res.ratio_mua_the;
                    App.BILLING_CONF = res;
                }
            });
        }

        static getPlatformName() {
            // if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) return "android";
            // if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) return "ios";
            // return "web";
            return "FISH";
        }

        static getLinkFanpage() {
            switch (VersionConfig.CPName) {
                default:
                    return "https://www.facebook.com/sunwinclub";
                    // return "https://www.facebook.com/bao99club";
            }
        }

        static getLinkGrFacebook() {
            switch (VersionConfig.CPName) {
                default:
                    return "https://www.facebook.com/sunwinclub";
                    // return "https://www.facebook.com/bao99club";
            }
        }

        static getLinkTelegram() {
            switch (VersionConfig.CPName) {
                default:
                    return "https://t.me/CSKH_sun9.club";
                    //return "cskhbao99";
            }
        }

        static getLinkTelegramGroup() {
            switch (VersionConfig.CPName) {
                default:
                    return "@cskhyou88";
                    //return "cskhbao99";
            }
        }

        static secretCode="111111";
        static setSecretCode(code){
            Configs.App.secretCode = code;
        }
        static getDomain(name : string){

            return cc.sys.localStorage.getItem(name)
        }

        static init() {
            switch (VersionConfig.ENV) {
                case VersionConfig.ENV_LOCAL:
                    this.USE_WSS = false;
                    this.DOMAIN = ""+VersionConfig.DOMAIN_LOCAL+"/";
                    this.API = "http://"+VersionConfig.DOMAIN_LOCAL+":8081/api";
                    this.MONEY_TYPE = 1;
                    this.LINK_DOWNLOAD = "http://"+VersionConfig.DOMAIN_LOCAL+"/landing";
                    this.LINK_EVENT = "http://"+VersionConfig.DOMAIN_LOCAL+"event";
                    this.LINK_SUPPORT = ""+VersionConfig.DOMAIN_LOCAL+"";

                    this.HOST_MINIGAME.host =""+ VersionConfig.DOMAIN_LOCAL;
                    this.HOST_MINIGAME.port = 1644;
                    this.HOST_TAI_XIU_MINI2.host = "overunder."+VersionConfig.DOMAIN_LOCAL;
                    this.HOST_SLOT.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_SLOT.port = 1844;
                    this.HOST_TLMN.host = ""+VersionConfig.DOMAIN_LOCAL;
                    this.HOST_TLMN.port = 2144;
                    this.HOST_SAM.host = ""+VersionConfig.DOMAIN_LOCAL;
                    this.HOST_SAM.port = 1944;
                    this.HOST_XOCDIA.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_XOCDIA.port = 2344;
                    this.HOST_BACAY.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_BACAY.port = 1044;
                    this.HOST_BAICAO.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_BAICAO.port = 1144;
                    this.HOST_POKER.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_POKER.port = 1744;
                    this.HOST_XIDACH.host = "wxizach."+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_XIDACH.port = 443;
                    this.HOST_BINH.host = VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_BINH.port = 1244;
                    this.HOST_LIENG.host = "wlieng."+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_LIENG.port = 443;
                   // this.HOST_SHOOT_FISH.host = "wbanca."+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_SHOOT_FISH.host = "45.76.178.154";
                    this.HOST_SHOOT_FISH.port = 2083;
                    this.HOST_BAU_CUA_TO2.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_BAU_CUA_TO2.port = 3644;
                    this.HOST_TAIXIU.host = ""+VersionConfig.DOMAIN_LOCAL+"";
                    this.HOST_TAIXIU.port = 2044;

                    this.HOST_TAIXIU_MD5.host = `${VersionConfig.DOMAIN_LOCAL}`;
                    this.HOST_TAIXIU_MD5.port = 12044;
                    break;
                case VersionConfig.ENV_DEV:
                    this.USE_WSS = true;
                    this.MONEY_TYPE = 1;

                    if(cc.sys.localStorage.getItem("MINIGAME_CONTEXT")){
                        VersionConfig.DOMAIN_DEV = this.getDomain("DOMAIN_GAME_DEV") ;
                        this.HOST_MINIGAME.host = this.getDomain("MINIGAME_CONTEXT");
                        this.HOST_TAI_XIU_MINI2.host = this.getDomain("HOST_TAI_XIU_MINI2");
                        this.HOST_SLOT.host = this.getDomain("SLOT_CONTEXT");
                        this.HOST_TLMN.host = this.getDomain("TLMN_CONTEXT");
                        this.HOST_SHOOT_FISH.host = this.getDomain("SHOOT_FISH_CONTEXT");
                        this.HOST_SAM.host = this.getDomain("SAM_CONTEXT");
                        this.HOST_XOCDIA.host = this.getDomain("XOCDIA_CONTEXT");
                        this.HOST_BACAY.host = this.getDomain("BACAY_CONTEXT");
                        this.HOST_BAICAO.host = this.getDomain("BAICAO_CONTEXT");
                        this.HOST_POKER.host = this.getDomain("POKER_CONTEXT");
                        this.HOST_BINH.host = this.getDomain("BINH_CONTEXT");
                        this.HOST_BAU_CUA_TO2.host = this.getDomain("BAU_CUA_TO2_CONTEXT");
                        this.HOST_TAIXIU.host = this.getDomain("TAIXIU_CONTEXT");
                        this.HOST_TAIXIU_MD5.host = this.getDomain("TAIXIUMD5_CONTEXT");
                        this.API = `https://${VersionConfig.DOMAIN_DEV}/api-portal`;
                        break;
                    }
                    break;
                case VersionConfig.ENV_PROD:
                    this.USE_WSS = true;
                    this.DOMAIN = `${this.getDomain("DOMAIN_GAME_PROD")}`;
                    this.MONEY_TYPE = 1;
                    this.HOST_MINIGAME.host = this.getDomain("MINIGAME_CONTEXT");
                    this.HOST_TAI_XIU_MINI2.host = this.getDomain("HOST_TAI_XIU_MINI2");
                    this.HOST_SLOT.host = this.getDomain("SLOT_CONTEXT");
                    this.HOST_TLMN.host = this.getDomain("TLMN_CONTEXT");
                    this.HOST_SHOOT_FISH.host = this.getDomain("SHOOT_FISH_CONTEXT");
                    this.HOST_SAM.host = this.getDomain("SAM_CONTEXT");
                    this.HOST_XOCDIA.host = this.getDomain("XOCDIA_CONTEXT");
                    this.HOST_BACAY.host = this.getDomain("BACAY_CONTEXT");
                    this.HOST_BAICAO.host = this.getDomain("BAICAO_CONTEXT");
                    this.HOST_POKER.host = this.getDomain("POKER_CONTEXT");
                    this.HOST_BINH.host = this.getDomain("BINH_CONTEXT");
                    this.HOST_BAU_CUA_TO2.host = this.getDomain("BAUCUA_CONTEXT");
                    this.HOST_TAIXIU.host = this.getDomain("TAIXIU_CONTEXT");
                    this.HOST_TAIXIU_MD5.host = this.getDomain("TAIXIUMD5_CONTEXT");
                    this.HOST_TAIXIU_LIVE_KUBET.host = 'taixiu-kubet';
                    this.HOST_XOCDIA_LIVE_KUBET.host = 'xocdiakubet'
                    this.API = `https://${this.DOMAIN}/api-portal`;
                    break;
                default:
                    this.USE_WSS = true;
                    this.DOMAIN = "https://"+VersionConfig.DOMAIN_DEV+"/";
                    this.API = "https://"+VersionConfig.DOMAIN_DEV+"/api";
                    this.MONEY_TYPE = 1;
                    this.LINK_DOWNLOAD = "https://"+VersionConfig.DOMAIN_DEV+"";
                    this.LINK_EVENT = "https://"+VersionConfig.DOMAIN_DEV+"/event";
                    this.LINK_SUPPORT = "https://www.comm100.com/";

                    this.HOST_MINIGAME.host = "wmini."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_TAI_XIU_MINI2.host = "overunder."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_SLOT.host = "gomsu."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_TLMN.host = "wtlmn."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_SHOOT_FISH.host = "wbanca."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_SAM.host = "wsam."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_XOCDIA.host = "quanly."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_BACAY.host = "wbacay."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_BAICAO.host = "wbaicao."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_POKER.host = "wpoker."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_XIDACH.host = "wxizach."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_BINH.host = "wbinh."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_LIENG.host = "wlieng."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_BAU_CUA_TO2.host = "wbaucuato2."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_TAIXIU.host = "taixiu."+VersionConfig.DOMAIN_DEV+"";
                    this.HOST_TAIXIU_MD5.host = `batrang.${VersionConfig.DOMAIN_DEV}`;
                    this.LINK_GROUP = "https://www.facebook.com/groups/bao99.vip";
                    break;
            }
        }
    }
    export class GameId {
        static readonly MiniPoker = 1;
        static readonly TaiXiu = 2;
        static readonly BauCua = 3;
        static readonly CaoThap = 4;
        static readonly Slot3x3 = 5;
        static readonly VQMM = 7;
        static readonly Sam = 8;
        static readonly BaCay = 9;
        static readonly MauBinh = 10;
        static readonly TLMN = 11;
        static readonly TaLa = 12;
        static readonly Lieng = 13;
        static readonly XiTo = 14;
        static readonly XocXoc = 15;
        static readonly BaiCao = 16;
        static readonly Poker = 17;
        static readonly Bentley = 19;
        static readonly RangeRover = 20;
        static readonly MayBach = 21;
        static readonly RollsRoyce = 22;
        static readonly BauCuaTo2 = 23;
        static readonly TaiXiuMD5 = 2000;
        static readonly CowBoy = 170;
        static readonly FastAndFurious = 180;
        static readonly LadyNight = 120;
        static readonly BongLaiCac = 200;
        static readonly SexyDance = 230;
        static readonly LienMinh = 110;
        static readonly BigCityBoy = 190;
        static readonly Halloween = 210;
        static readonly MACAO = 220;

        static getGameName(gameId: number): string {
            switch (gameId) {
                case this.MiniPoker:
                    return "MiniPoker";
                case this.TaiXiu:
                    return "Tài Xỉu";
                case this.BauCua:
                    return "Bầu Cua";
                case this.CaoThap:
                    return "Trên Dưới";
                case this.Slot3x3:
                    return "Rượu Whisky";
                case this.VQMM:
                    return "VQMM";
                case this.Sam:
                    return "Sâm";
                case this.MauBinh:
                    return "Mậu Binh";
                case this.TLMN:
                    return "TLMN";
                case this.TaLa:
                    return "Tá Lả";
                case this.Lieng:
                    return "Liêng";
                case this.XiTo:
                    return "Xì Tố";
                case this.XocXoc:
                    return "Xóc Đĩa";
                case this.BaiCao:
                    return "Bài Cào";
                case this.Poker:
                    return "Poker";
                case this.Bentley:
                    return "Thần Tài";
                case this.RangeRover:
                    return "Avengers";
                case this.RollsRoyce:
                    return "Rolls Royce";
                case this.BauCuaTo2:
                    return "Bầu Cua";
                case this.TaiXiuMD5:
                    return "Tài Xỉu MD5";
                case this.CowBoy:
                    return "Cao Bồi";
                case this.FastAndFurious:
                    return 'Fast And Furious';
                case this.LadyNight:
                    return 'Lady Night';
                case this.BongLaiCac:
                    return 'Bồng Lai Các';
                case this.SexyDance:
                    return 'Sexy Dance';
                case this.LienMinh:
                    return 'Liên Minh Huyền Thoại';
                case this.BigCityBoy:
                    return 'Big City Boy';
                case this.MACAO:
                    return 'Thần Bài MaCao';
                case this.Halloween:
                    return 'Halloween';
            }
            return "Thần Tài";
        }
    }
}
export default Configs;
