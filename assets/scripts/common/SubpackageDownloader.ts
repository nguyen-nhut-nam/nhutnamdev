import Configs from "./Configs";

const { ccclass, property } = cc._decorator;

namespace common {
    @ccclass
    export class SubpackageDownloader {

        private static instance: SubpackageDownloader = null;

        private isDownloading = false;
        private _storagePath: string = "";
        private _am: any;
        private failCount = 0;

        constructor() {
        }

        static getInstance(): SubpackageDownloader {
            if (this.instance == null) this.instance = new SubpackageDownloader();
            return this.instance;
        }

        private _downloadSubpackage(name: string, callbacks: (err: string, progress: number) => void) {
            if (this.isDownloading) return;
            console.log("CC_JSB: " + CC_JSB);
            console.log("CC_DEBUG: " + CC_DEBUG);
            console.log("CC_DEV: " + CC_DEV);
            console.log("CC_EDITOR: " + CC_EDITOR);
            console.log("CC_PREVIEW: " + CC_PREVIEW);
            console.log("CC_TEST: " + CC_TEST);
            console.log("CC_BUILD: " + CC_BUILD);
            //ignore down sub package
            if (CC_BUILD) {
                cc.loader.downloader.loadSubpackage(name, (err: Error) => {
                    if (err) {
                        console.log(err.stack);
                        callbacks(err.stack, 0);
                    } else {
                        callbacks(null, 0);
                    }
                });
            } else {
                callbacks(null, 0);
            }
        }

        static downloadSubpackage(name: string, callbacks: (err: string, progress: number) => void) {
            this.getInstance()._downloadSubpackage(name, callbacks);
        }
    }
}

export default common.SubpackageDownloader;
