// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "./App";
import utils from "./Utils";
import Configs from "./Configs";
import GameHelper from "../../Script/GameHelper";

const { ccclass, property } = cc._decorator;

export namespace common {
    export class Utils {
        static Rad2Deg: number = 57.2957795;
        static Deg2Rad: number = 0.0174532925;

        static numFormatter(num: number, fractionDigits = 0) {
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(fractionDigits) + 'B'; // convert to B for number from > 1Bilion
            } else if (num > 999 && num < 1000000) {
                return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(fractionDigits) + 'M'; // convert to M for number from > 1 million
            } else if (num <= 900) {
                return num; // if value < 1000, nothing to do
            }
        }

        static NFormatter(t, e = 2) {
            for (var i = [{
                value: 1e18,
                symbol: "E"
            }, {
                value: 1e15,
                symbol: "P"
            }, {
                value: 1e12,
                symbol: "T"
            }, {
                value: 1e9,
                symbol: "B"
            }, {
                value: 1e6,
                symbol: "M"
            }, {
                value: 1e3,
                symbol: "K"
            }], o = /\.0+$|(\.[0-9]*[1-9])0+$/, n = 0; n < i.length; n++)
                if (t >= i[n].value)
                    return (t / i[n].value).toFixed(e).replace(o, "$1") + i[n].symbol;
            return t.toFixed(e).replace(o, "$1")
        }

        static numFormatterTofixed0(num: number) {
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(0) + 'B'; // convert to B for number from > 1Bilion
            } else if (num > 999 && num < 1000000) {
                return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
            } else if (num <= 999) {
                return num; // if value < 1000, nothing to do
            }
        }

        static degreesToVec2(degrees: number): cc.Vec2 {
            return Utils.radianToVec2(degrees * Utils.Deg2Rad);
        }

        static radianToVec2(radian: number): cc.Vec2 {
            return cc.v2(Math.cos(radian), Math.sin(radian));
        }

        static numberToEnum<T>(value: number, typeEnum: T): T[keyof T] | undefined {
            return typeEnum[typeEnum[value]];
        }

        static loadSpriteFrameFromBase64(base64: string, callback: (sprFrame: cc.SpriteFrame) => void) {
            //create DOM element
            let img = new Image();
            //define img.onload before assigning src
            img.onload = function () {
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.handleLoadedTexture();
                let sp = new cc.SpriteFrame(texture);
                // console.log(sp);
                //assign the spriteframe to you sprite
                callback(sp);
            }.bind(this);
            img.src = "data:image/png;base64," + base64;
        }

        static formatNumber(n: number): string {
            return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }

        static formatNumber2(number: string): string {
            number = number.replace (/,/g, "");
            return utils.formatNumber(parseInt(number));
        }

        static formatMoney(n: number): string {
            return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }
        
        static formatNumberMin(n: number): string {
            if (n >= 1000000000) {
                n = Math.ceil(n / 1000);
                return this.formatNumber(n) + "B";
            }
            if (n >= 1000000) {
                n = Math.ceil(n / 1000);
                return this.formatNumber(n) + "M";
            }
            if (n >= 1000) {
                n = Math.ceil(n / 1000);
                return this.formatNumber(n) + "K";
            }
            return this.formatNumber(n);
        }

        static stringToInt(s: string): number {
            var n = parseInt(s.replace(/\./g, '').replace(/,/g, ''));
            if (isNaN(n)) n = 0;
          
            return n;
        }

        static validateMoneyRecharge50K(n:number){
            if(n<50000){
                App.instance.alertDialog.showMsg("Số tiền nạp phải lớn hơn hoặc bằng 50 nghìn !");
            }
        }

        static randomRangeInt(min: number, max: number): number {
            //Returns a random number between min (inclusive) and max (inclusive)
            //Math.floor(Math.random() * (max - min + 1)) + min;

            //Returns a random number between min (inclusive) and max (exclusive)
            return Math.floor(Math.random() * (max - min)) + min;
        }

        static randomRange(min: number, max: number): number {
            //Returns a random number between min (inclusive) and max (exclusive)
            return Math.random() * (max - min) + min;
        }

        static v2Distance(v1: cc.Vec2, v2: cc.Vec2): number {
            return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
        }

        static v2Degrees(v1: cc.Vec2, v2: cc.Vec2): number {
            return Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI;
        }

        static dateToYYYYMMdd(date: Date) {
            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();

            return [
                date.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('-');
        }

        static dateToYYYYMM(date: Date) {
            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();

            return [
                date.getFullYear(),
                (mm > 9 ? '' : '0') + mm
            ].join('-');
        }

        static removeDups(array: Array<any>) {
            var unique = {};
            array.forEach(function (i) {
                if (!unique[i]) {
                    unique[i] = true;
                }
            });
            return Object.keys(unique);
        }
        static copyTextToClipboard(t) {
            let fallbackCopyTextToClipboard = function(t) {
                var e = document.createElement("textarea");
                if (e.value = t,
                    document.body.appendChild(e),
                cc.sys.platform === cc.sys.MOBILE_BROWSER && cc.sys.os == cc.sys.OS_IOS) {
                    var i = document.createRange();
                    i.selectNodeContents(e);
                    var n = window.getSelection();
                    n.removeAllRanges(),
                        n.addRange(i),
                        e.setSelectionRange(0, 999999)
                } else
                    e.focus(),
                        e.select();
                try {
                    var o = document.execCommand("copy") ? "successful" : "unsuccessful";
                    console.log("Fallback: Copying text command was " + o)
                } catch (t) {
                    console.error("Fallback: Oops, unable to copy", t)
                }
                document.body.removeChild(e)
            }

            var e = this;
            if (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER)
                if (cc.sys.platform === cc.sys.MOBILE_BROWSER && cc.sys.os == cc.sys.OS_IOS)
                    fallbackCopyTextToClipboard(t);
                else
                    try {
                        window.navigator.clipboard.writeText(t).then(function() {}, function() {
                            fallbackCopyTextToClipboard(t)
                        })
                    } catch (e) {
                        fallbackCopyTextToClipboard(t)
                    }
            else
                { // @ts-ignore
                    cc.sys.isNative && void 0 != jsb && jsb.copyTextToClipboard(t)
                }
        }
        static ChangeLocalCaseUpdated(newAppHotUpdateUrl : string){
            if(cc.sys.isNative){
                if (jsb.fileUtils.isFileExist(GameHelper.getStoragePath()+'/project.manifest')) {
                    console.log("read manifest file");
                    let storagePath = GameHelper.getStoragePath();
                    console.log("StoragePath for remote asset : ", storagePath);
                    let loadManifest = jsb.fileUtils.getStringFromFile(storagePath + '/project.manifest');
                    let manifestObject = JSON.parse(loadManifest);
                    manifestObject.packageUrl = newAppHotUpdateUrl;
                    manifestObject.remoteManifestUrl = manifestObject.packageUrl + 'project.manifest';
                    manifestObject.remoteVersionUrl = manifestObject.packageUrl + 'version.manifest';
                   
                    let afterString = JSON.stringify(manifestObject);
                     jsb.fileUtils.writeStringToFile(afterString, storagePath + '/project.manifest');
                     console.log(' doi domain ')
                
                 
            }
            }
    
    }
        static isSafari() {
            if(cc.sys.isNative) {
                return false;
            }
            let userAgentString =
                navigator.userAgent;
            let chromeAgent =
                userAgentString.indexOf("Chrome") > -1;
            // Detect Safari
            let safariAgent =
                userAgentString.indexOf("Safari") > -1;

            // Discard Safari since it also matches Chrome
            if ((chromeAgent) && (safariAgent))
                safariAgent = false;
            return safariAgent;
        }
        static async checkHealth(url) {
            return new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            try {
                                resolve(JSON.parse(request.responseText));
                            } catch (e) {
                                resolve(JSON.parse("{}"));
                            }
                        } else {
                            resolve(undefined)
                        }
                    }
                };
                request.onerror= function(){
                    resolve(undefined);
                }
                request.open('GET', url, true);
                request.send();
            });
        }
        static mapMaDaiLy(madaily: string) {
            if (Configs.App.MAP_DAILY == null) {
                return madaily;
            }
            for (let i = 0; i < Configs.App.MAP_DAILY.length; i++) {
                let list_ma = Configs.App.MAP_DAILY[i].map.split(',');
                if(list_ma.indexOf(madaily) != -1) {
                    return Configs.App.MAP_DAILY[i].realcode;
                }
            }
            return madaily;
        }

        static convertTimeStampToDate(timeStamp) {
            return new Date(timeStamp).toLocaleDateString("en-GB");
        }

        static getPlatform() {
            if(cc.sys.isBrowser) {
                return "web";
            }
            if(cc.sys.os == cc.sys.OS_ANDROID) {
                return "ad";
            } else if(cc.sys.os == cc.sys.OS_IOS) {
                return "ios";
            }
        }

        static checkNumberEven(number) {
            return number % 2 === 0;
        }
    }
    
}
export default common.Utils;
