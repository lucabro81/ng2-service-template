import {Http, Response, Headers} from "@angular/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ObservableInput } from "rxjs/Observable";
import { WarningLevel } from "../../../utils/Emun";
import { Signal } from "signals";
import { RequestVO } from "../../../vo/RequestVO";
import { AlertController, Loading, LoadingController } from "ionic-angular";
import { OverrideRequestDataVO } from "../../../vo/OverrideRequestDataVO";
// import { EndPointVO } from "../../../vo/EndPointVO";
import {RequestManager} from "../RequestManager";
import {ResponseVO} from "../../../vo/ResponseVO";
import {AbsListener} from "../Listener/AbsListener";

export class AbsBaseService {

    public static is_loading_active:boolean = false;
    public static is_loading_enabled:boolean = false;
    public static is_connection_enabled:boolean = true;

    private static loading:Loading;
    private static stop_loading:number;

    /**
     *
     * @param http
     * @param alertCtrl
     * @param localStorage
     * @param loadingCtrl
     * @param secureStorage
     */
    constructor(public http:Http,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {

    }

////////////////////////////
////////// PUBLIC //////////
////////////////////////////

    /**
     * Gestisce una richiesta http GET, di default gestisce anche la fine della richiesta
     *
     * @param options                   oggetto che descrive la richiesta
     * @returns {Observable<Response>}
     */
    public requestGet<T extends Response>(options:RequestVO):Observable<T> {

        console.log("inizio richiesta");

        options.config.headers = this.setHeaders(options);
        //
        let url:string = this.setSegmentedUrl(options.endpoint.url, options.data);
        let override_data:OverrideRequestDataVO = this.overrideRequestData(options);

        let response:Observable<T> = this.http.get(url, options.config);

        return this.setResponse<T>(options, url, override_data, response);

    }

    /**
     *
     * @param options
     * @returns {Observable<R>}
     */
    public requestPost<T extends Response>(options:RequestVO):Observable<T> {

        options.config.headers = this.setHeaders(options);

        let url:string;
        let data:any;
        if (options.data && options.data.segments) {
            url = this.setSegmentedUrl(options.endpoint.url, options.data);
            data = null;
        }
        else{
            url = options.endpoint.url;
            data = options.data;
        }

        let override_data:OverrideRequestDataVO = this.overrideRequestData(options);
        let response:Observable<T> = this.http.post(url, data, options.config);

        return this.setResponse<T>(options, url, override_data, response);
    }

    /**
     *
     * @param options
     * @returns {Observable<Response>}
     */
    public post(options:RequestVO):Observable<Response> {

        options.config.headers = this.setHeaders(options);

        let url:string;
        if (options.data && options.data.segments) {
            url = this.setSegmentedUrl(options.endpoint.url, options.data);
            return this.http.post(url, null, options.config);
        }

        url = options.endpoint.url;
        return this.http.post(url, options.data, options.config);
    }

    /**
     *
     * @param options
     * @returns {Observable<R>}
     */
    public requestPut<T extends Response>(options:RequestVO):Observable<T> {

        options.config.headers = this.setHeaders(options);

        let url:string = options.endpoint.url;
        let override_data:OverrideRequestDataVO = this.overrideRequestData(options);
        let response:Observable<T> = this.http.put(url, options.data, options.config);

        return this.setResponse<T>(options, url, override_data, response);
    }

    /**
     *
     * @param options
     * @returns {Observable<Response>}
     */
    public put(options:RequestVO):Observable<Response> {

        let url:string = this.setSegmentedUrl(options.endpoint.url, options.data);

        options.config.headers = this.setHeaders(options);

        return this.http.put(url, options.data, options.config);
    }

    /**
     *
     * @param options
     * @returns {Observable<R>}
     */
    public requestDelete<T extends Response>(options:RequestVO):Observable<T> {

        options.config.headers = this.setHeaders(options);

        let url:string = this.setSegmentedUrl(options.endpoint.url, options.data);
        let override_data:OverrideRequestDataVO = this.overrideRequestData(options);
        let response:Observable<T> = this.http.delete(url, options.config);

        return this.setResponse<T>(options, url, override_data, response);
    }

    /**
     *
     * @param options
     * @returns {Observable<Response>}
     */
    public delete(options:RequestVO):Observable<Response> {

        let url:string = this.setSegmentedUrl(options.endpoint.url, options.data);

        options.config.headers = this.setHeaders(options);

        return this.http.delete(url, options.config);
    }

    /**
     *
     * @param message_obj
     */
    public showAlert(message_obj:DefaultAlertStructureVO):void {
        let alert = this.alertCtrl.create({
            title: message_obj.title,
            subTitle: message_obj.body,
            buttons: message_obj.btn_arr
        });
        alert.present();
    }

    /**
     * Callbak da eseguire in caso di richiesta andata a buon fine
     *
     * @param response
     * @param url
     * @returns {{}}
     */
    public onSuccess(response:Response, url:string):Promise<any> {
        // console.log("response", response);

        console.log("onSuccess fine richiesta");

        this.nextRequest();

        if (AbsBaseService.is_loading_active) {
            AbsBaseService.stop_loading = window.setTimeout(() => {
                this.dismissLoadingDefault();
            }, 300);
        }

        let body = response.json();

        return new Promise((resolve) => {
            // console.log("nessun nodo jwt presente");
            resolve(body || {});
        });

    }

    /**
     * Palo nel c... uore
     *
     * @param error
     * @param error_signals
     * @param error_intercept
     * @param error_callback
     * @param warning_level
     * @returns {any}
     */
    public onError(error:Response,
                   error_signals:Array<Signal>,
                   error_intercept:boolean,
                   error_callback:() => void,
                   warning_level:WarningLevel, options:any):ObservableInput<Response> {

        console.log("onError fine richiesta", error, options);

        this.nextRequest();

        this.dispatchSignals(error_signals, error.json());

        if (error_intercept) {
            if (AbsBaseService.is_loading_active) {
                AbsBaseService.stop_loading = window.setTimeout(() => {
                    this.dismissLoadingDefault();
                }, 300);
            }
            this.manageError(error.json(), error_callback, warning_level);
        }

        var error_json;
        try {
            error_json = error.json();
        }
        catch (e) {
            return Observable.throw('Server error');
        }

        return Observable.throw(error_json || 'Server error');
    }

    public presentLoadingDefault() {

        // if (AbsBaseService.is_loading_enabled) {
            AbsBaseService.is_loading_active = true;

            AbsBaseService.loading = this.loadingCtrl.create({
                content: 'Caricamento'
            });

            AbsBaseService.loading.present();
        // }
    }

    public dismissLoadingDefault() {

        // console.log("this.loading, AbsBaseService.is_loading_enabled",
        //     this.loading, AbsBaseService.is_loading_enabled);

        // if (AbsBaseService.loading && AbsBaseService.is_loading_enabled) {
        // if (AbsBaseService.is_loading_active) {
            AbsBaseService.is_loading_active = false;
            AbsBaseService.loading.dismiss()
                .then((sdf) => {})
                .catch((errore) => {});
        // }
    }

/////////////////////////////
////////// PRIVATE //////////
/////////////////////////////

    /**
     * Setta gli headers delle richieste, attaccando, quando richiesto, anche il token opportuno
     *
     * @param end_point
     * @returns {Headers}
     */
    // private setHeaders(end_point:EndPointVO) {
    private setHeaders(options:RequestVO) {

        // let end_point:EndPointVO = options.endpoint;

        let headers: any = {};

        if (options.config.headers) {
            headers = options.config.headers;
        }
        else {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'app'
            };
        }

        return new Headers(headers);
    }

    /**
     *
     * @param options
     * @param url
     * @param override_data
     * @param response
     * @returns {Observable<R>}
     */
    private setResponse<T extends Response>(options:RequestVO,
                                            url:string,
                                            override_data:OverrideRequestDataVO,
                                            response:Observable<Response>):Observable<T> {
        if (override_data.retry > 0) {
            response = response.retry(override_data.retry);
        }

        if (override_data.debounce > 0) {
            response = response.debounceTime(override_data.debounce).distinctUntilChanged();
        }

        if (override_data.warning_level !== WarningLevel.SILENT) {
            if (!AbsBaseService.is_loading_active) {
                this.presentLoadingDefault();
            }
            else {
                clearTimeout(AbsBaseService.stop_loading);
            }
        }

        return response
            .flatMap((response:T) => {
                return this.onSuccess(response, url)
            })
            .catch((response:any) => this.onError(response, options.error_signals, options.error_intercept,
                options.error_callback, override_data.warning_level, options));
    }

    /**
     *
     * @param options
     * @returns {OverrideRequestDataVO}
     */
    private overrideRequestData(options:RequestVO):OverrideRequestDataVO {
        let override_data:OverrideRequestDataVO = <OverrideRequestDataVO>{};

        override_data.retry = options.retry_override || options.endpoint.retry || 0;
        override_data.warning_level = options.warning_level_override || options.endpoint.warning_level;
        override_data.debounce = options.debounce_override || options.endpoint.debounce || 0;

        return override_data;
    }

    /**
     *
     * @param url
     * @param data
     * @returns {string}
     */
    private setSegmentedUrl(url:string, data:any) {

        if (data && data.segments) {
            let segments:Array<any> = data.segments;
            let l:number = segments.length;

            for (let i = 0; i < l; i++) {
                url += "/" + segments[i];
            }
        }

        return url;
    }

    /**
     * In caso di errore dispaccia i signals contenuti in signals
     *
     * @param signals
     * @param error
     */
    private dispatchSignals(signals:Array<Signal>, error:any):void {
        if (signals) {
            let l:number = signals.length;
            for (let i = 0; i < l; i++) {
                // console.log("signals[" + i + "]", signals[i]);
                signals[i].dispatch(error);
            }
        }
    }


    /**
     * Gestione automatica dell'errore in base a warning level
     *
     * @param risp
     * @param user_callback
     * @param warning_level
     */
    private manageError(risp:any, user_callback:() => void, warning_level:WarningLevel):void {

        // console.log("risp", risp);

        let body:string = risp.message;
        let title:string = "Errore";
        // let final_callback:() => void;
        let msg:DefaultAlertStructureVO;

        switch (warning_level) {
            case WarningLevel.SILENT:
                // nessuna notifica se la chiamata fallisce, nessuna callback di logout o reset app verrà eseguita
                if (user_callback) user_callback();
                break;
            case WarningLevel.LOW:
                // notifiche di errore visualizzate, nessuna callback di logout o reset app verrà eseguita
                msg = {
                    title: title,
                    body: body,
                    btn_arr: [
                        {text: "OK", handler: user_callback}
                    ]
                };
                this.showAlert(msg);
                break;
        }
    }

    private nextRequest() {

        if (RequestManager.request_queue_list.length() > 1) {
            RequestManager.request_queue_list.shiftLeft();
            RequestManager.request_queue_list.start.data.subscribe();
        }
        else {
            RequestManager.request_queue_list.destroy();
        }

    }

    /**
     *
     * @param request_manager
     * @param options
     * @param success_handler
     * @param error_handler
     * @returns {RequestManager<ResponseVO<R>, ResponseVO<any>>}
     */
    protected setRequestGet<T, R extends AbsListener>(request_manager:RequestManager<ResponseVO<T>, R>,
                                                      options:RequestVO,
                                                      success_handler: (response: ResponseVO<any>) => void,
                                                      error_handler: (error) => void):RequestManager<ResponseVO<T>, R> {
        let request:Observable<ResponseVO<any>> = this.requestGet<ResponseVO<any>>(options);
        return request_manager.init(request, success_handler, error_handler);
    }
}
