import {AbsListener} from "../../../../IonicAppModule/services/Listener/AbsListener";

export abstract class OnTestServiceMethodListener extends AbsListener {

    constructor() {
        super();
    }

    public init(decorated_listener:IListener) {
        super.init(decorated_listener);
    }

    public onError(evt:any) {
        console.log("OnTestServiceMethodListener.onError");
        this.decorated_listener.onError(evt);
    }

    public onSuccess(evt:any) {
        console.log("OnTestServiceMethodListener.onSuccess");
        this.decorated_listener.onSuccess(evt);
    }

    public destroy() {
        this.decorated_listener.destroy();
    }

    public eventOne(evt?:any):void {

    }

    public eventTwo(evt?:any):void {

    }

}