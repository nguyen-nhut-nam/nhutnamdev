export default class VersionConfig {
    static readonly CP_NAME_F69 = "F69";
    static readonly ENV_DEV = "dev";
    static readonly ENV_PROD = "prod";
    static readonly ENV_LOCAL = "local";
    // static readonly DOMAIN_DEV = "ace88.live";
    static readonly DOMAIN_LOCAL = "45.76.178.154";
    static DOMAIN_PRO = "suonxaochuangot.pro";
    static DOMAIN_DEV = "suonxaochuangot.pro";
    // static readonly DOMAIN_PRO = "ace88.live";

    static DOMAINHOTUPDATE(){
        if(cc.sys.localStorage.getItem("url_update")){
            return cc.sys.localStorage.getItem("url_update");

        }

        return "honghunghoi.net"
    }
    static VersionName = "";
    static CPName = "";
    static ENV = VersionConfig.ENV_PROD;
}
 
if (cc.sys.isNative) {
    let versionConfig = cc.sys.localStorage.getItem("VersionConfig");
    if (versionConfig != null) {
        versionConfig = JSON.parse(versionConfig);
        VersionConfig.VersionName = versionConfig["VersionName"];
        VersionConfig.CPName = versionConfig["CPName"];
    }else{
        VersionConfig.VersionName = "1.0.0";
        VersionConfig.CPName = VersionConfig.CP_NAME_F69;
    }
} else {
    VersionConfig.VersionName = "1.0.0";
    VersionConfig.CPName = VersionConfig.CP_NAME_F69;
}