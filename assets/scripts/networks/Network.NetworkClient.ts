import NetworkListener from "./Network.NetworkListener";
import Configs from "../common/Configs";

export default class NetworkClient {
    ws: WebSocket = null;
    host: string = "";
    port: number = 0;
    isForceClose = false;
    isUseWSS: boolean = false;
    isAutoReconnect: boolean = true;

    _onOpenes: Array<NetworkListener> = [];
    _onCloses: Array<NetworkListener> = [];

     connect(host: string, port: number) {
        // console.log("start connect: " + host + ":" + port);
        this.isForceClose = false;
        this.host = host;
        this.port = port;
        if (this.ws == null) {
            // this.ws = new WebSocket("wss://" + host + ":" + port + "/websocket");
            if (this.isUseWSS) {
                if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                    let cacert = cc.url.raw('resources/raw/cacert.pem');
                    if (cc.loader.md5Pipe) {
                        cacert = cc.loader.md5Pipe.transformURL(cacert)
                    }
                    // @ts-ignore
                    this.ws = new WebSocket(`wss://${Configs.App.DOMAIN}/socket-client/${host}`, null, cacert);
                } else {
                    this.ws = new WebSocket(`wss://${Configs.App.DOMAIN}/socket-client/${host}`);
                }
            } else {
                this.ws = new WebSocket(`ws://${Configs.App.DOMAIN}/socket-client/${host}`);

            }
            this.ws.binaryType = "arraybuffer";
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            
        } else {
            if (this.ws.readyState !== WebSocket.OPEN) {
                this.ws.close();
                this.ws = null;
                this.connect(host, port);
            }
        }
    }

    protected onOpen(ev: Event) {
        console.log("onOpen");
        for (var i = 0; i < this._onOpenes.length; i++) {
            var listener = this._onOpenes[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onOpenes.splice(i, 1);
                i--;
            }
        }
    }

    protected onMessage(ev: MessageEvent) {
        // console.log("onmessage: " + ev.data);
    }

    protected onError(ev: Event) {
        console.log("onError");
    }

    protected onClose(ev: Event) {
        console.log("onClose");
        for (var i = 0; i < this._onCloses.length; i++) {
            var listener = this._onCloses[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onCloses.splice(i, 1);
                i--;
            }
        }
        if (this.isAutoReconnect && !this.isForceClose) {
            setTimeout(() => {
                if (!this.isForceClose) this.connect(this.host, this.port);
            }, 2000);
        }
    }

    addOnOpen(callback: () => void, target: cc.Component) {
        this._onOpenes.push(new NetworkListener(target, callback));
    }

    addOnClose(callback: () => void, target: cc.Component) {
        this._onCloses.push(new NetworkListener(target, callback));
    }

    close() {
        this.isForceClose = true;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected() {
        if (this.ws) {
            return this.ws.readyState == WebSocket.OPEN;
        }
        return false;
    }
}