import {Observable} from "rxjs";
import {AbsListener} from "./Listener/AbsListener";
import {Listener} from "./Listener/Listener";
import {LinkedList} from "lucabro-linked-list/package/LinkedList";
import {ListElement} from "lucabro-linked-list/package/ListElement";

export class RequestManager<R, T extends AbsListener> {

    // public static
    // public static request_queue:Array<() => void> = []; //Todo: may be linked list
    public static request_queue_list:LinkedList<ListElement>;
    public static listener_decorator:Array<{id:string, listener:any}> = [];
    public static request_manager_list:{[id:string]:any} = {};
    public static signals:{[id:string]:any} = {};
    public static is_stop_on_error_active:boolean = false;
    public static stop_on_error_active_callback:(evt:any) => void;

    // public
    public listener:Listener;
    public id_request:string;

    // private static
    private static id_index:number = 0;

    // private
    private is_synchronized:boolean;
    private request:Observable<R>;
    private onSuccess:(evt) => void;
    private onError:(error) => void;
    private scope:RequestManager<R, T>; // only for interface purpose

/////////////////////////////////
////////// CONSTRUCTOR //////////
/////////////////////////////////

    /**
     *
     * @constructor
     */
    public constructor() {
        this.listener = null;
        this.is_synchronized = false;
        this.request = null;
        this.scope = this;

        if (!RequestManager.request_queue_list) {
            RequestManager.request_queue_list = new LinkedList<ListElement>();
            RequestManager.request_queue_list.init(ListElement);
        }
    }

////////////////////////////
////////// PUBLIC //////////
////////////////////////////

    /**
     *
     * @param request
     * @param onSuccess
     * @param onError
     * @param signals
     * @returns {RequestManager}
     */
    public init(request:Observable<R>, onSuccess:(evt) => void, onError:(error) => void):RequestManager<R, T> {
        this.request = request;
        this.onSuccess = onSuccess;
        this.onError = onError;
        return this;
    }

    /**
     *
     * @param id
     * @returns {RequestManager}
     */
    public setRequestId(id:string):RequestManager<R, T> {
        if ((id === null) || (id === "")) {
            this.id_request = "id_" + RequestManager.id_index++;
        }
        else {
            this.id_request = id;
        }

        if (RequestManager.request_manager_list[this.id_request]) {
            RequestManager.request_manager_list[this.id_request].request = this.request;
            RequestManager.request_manager_list[this.id_request].onSuccess = this.onSuccess;
            RequestManager.request_manager_list[this.id_request].onError = this.onError;
        }
        else {
            RequestManager.request_manager_list[this.id_request] = this;
        }

        return this;
    }

    /**
     *
     * @returns {Observable<R>}
     */
    public getObservable():Observable<R> {
        return this.request;
    }

    /**
     *
     * @param listener_decorator
     * @param id
     * @returns {RequestManager}
     */
    public setListener(listener_decorator:T):RequestManager<R, T> {

        if (!this.id_request) {
            this.id_request = "id_" + RequestManager.id_index++;
        }

        RequestManager.listener_decorator.push({id:this.id_request, listener:listener_decorator});
        return this;
    }

    /**
     *
     * @param id
     * @returns {any}
     */
    public static getListeners<ServiceListener>(id:string):Array<ServiceListener> {

        let req_manager:any = RequestManager.request_manager_list[id];
        let l:number = req_manager.listener_decorator.length;
        let listener_arr:Array<ServiceListener> = [];

        for (let i = 0; i < l; i++) {
            listener_arr.push(req_manager.listener_decorator[i].listener);
        }

        return listener_arr;
    }

    /**
     *
     * @param id
     * @returns {any}
     */
    public static getRequest(id:string):RequestManager<any, any> {

        if (RequestManager.request_manager_list[id]) {
            return RequestManager.request_manager_list[id];
        }

        RequestManager.request_manager_list[id] = new RequestManager<any, any>();
        (<RequestManager<any, any>>RequestManager.request_manager_list[id]).id_request = id;

        return RequestManager.request_manager_list[id];

    }

    /**
     *
     * @returns {RequestManager}
     */
    public synchronize():RequestManager<R, T> {
        this.is_synchronized = true;
        return this;
    }

    /**
     *
     * @returns {RequestManager}
     */
    public asynchronize():RequestManager<R, T> {
        this.is_synchronized = false;
        return this;
    }

    /**
     *
     * @returns {RequestManager}
     */
    public stopOnError(active:boolean, callback:(evt:any) => void = null):RequestManager<R, T> {
        RequestManager.is_stop_on_error_active = active;
        RequestManager.stop_on_error_active_callback = callback;
        return this;
    }

    /**
     *
     */
    public run() {

        if (!this.id_request) {
            this.id_request = "id_" + RequestManager.id_index++;
        }

        if (!this.checkListenerIdRequest()) {
            RequestManager.listener_decorator.push(
                {
                    id:this.id_request,
                    listener:new class extends AbsListener {
                        constructor() {
                            super();
                        }

                        public init(decorated_listener:IListener) {
                            super.init(decorated_listener);
                        }

                        public onError(evt:any) {
                            this.decorated_listener.onError(evt);
                        }

                        public onSuccess(evt:any) {
                            this.decorated_listener.onSuccess(evt);
                        }

                        public destroy() {
                            this.decorated_listener.destroy();
                        }
                    }
                });
        }

        let l:number = RequestManager.listener_decorator.length;
        for (let i = 0; i < l; i++) {
            RequestManager.listener_decorator[i].listener.init(new Listener());
        }


        if (this.is_synchronized) {
            //console.log("RequestManager.request_queue_list.length()", RequestManager.request_queue_list);
            RequestManager.request_queue_list.addElem({ subscribe: this.setSubscribe, scope:this});
            //console.log("RequestManager.request_queue_list.length()", RequestManager.request_queue_list);
            if (RequestManager.request_queue_list.length() === 1) {
                //console.log("this.request", this.request);
                //console.log("RequestManager.request_queue_list.start.data", RequestManager.request_queue_list.start.data);
                return RequestManager.request_queue_list.start.data.subscribe();
            }

            // RequestManager.request_queue.push(this.setSubscribe);
            // if (RequestManager.request_queue.length === 1) {
            //     return RequestManager.request_queue[0]();
            // }

        }
        else {
            this.setSubscribe();
        }
    }

/////////////////////////////
////////// PROVATE //////////
/////////////////////////////

    /**
     *
     * @param evt
     */
    private subscribeSuccess(evt:any) {

        let l:number = RequestManager.listener_decorator.length;

        for (let i = 0; i < l; i++) {
            if (RequestManager.listener_decorator[i].id === this.id_request) {
                RequestManager.listener_decorator[i].listener.onSuccess(evt);
            }
        }

        this.onSuccess(evt);

    }

    /**
     *
     * @param evt
     */
    private subscribeError(evt:any):void {
        let l:number = RequestManager.listener_decorator.length;

        for (let i = 0; i < l; i++) {
            if (RequestManager.listener_decorator[i].id === this.id_request) {
                RequestManager.listener_decorator[i].listener.onError(evt);
            }
        }

        if (RequestManager.is_stop_on_error_active) {
            this.listener = null;
            this.destroyListenerCollection();
            RequestManager.stop_on_error_active_callback(evt);
        }

        this.onError(evt);
    }

    /**
     *
     */
    private setSubscribe() {
        console.log("this", this);
        this.scope.request.subscribe(
            (evt) => {
                this.scope.subscribeSuccess(evt);
            },
            (error) => {
                this.scope.subscribeError(error);
            }
        );
    }

    /**
     *
     */
    private destroyListenerCollection() {

        let l:number = RequestManager.listener_decorator.length;

        for (let i = l-1; i >= 0; i--) {
            RequestManager.listener_decorator[i].listener.destroy();
            RequestManager.listener_decorator[i].listener = null;
            RequestManager.listener_decorator[i].id = null;
            RequestManager.listener_decorator.pop();
        }
        RequestManager.listener_decorator = [];
    }

    /**
     *
     * @returns {boolean}
     */
    private checkListenerIdRequest():boolean {

        let l:number = RequestManager.listener_decorator.length;

        for (let i = 0; i < l; i++) {
            if (RequestManager.listener_decorator[i].id === this.id_request) {
                return true;
            }
        }

        return false;
    }

}