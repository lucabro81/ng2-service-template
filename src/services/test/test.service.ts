import {Injectable} from "@angular/core";
import {RequestManager} from "../system/RequestManager";
import {AbsBaseService} from "../system/Abs/AbsBaseService";
import {RequestVO} from "../../vo/RequestVO";
import {EndPoints} from "../../utils/EndPoints";
import {ResponseVO} from "../../vo/ResponseVO";
import { Http } from "@angular/http";
import {AlertController, LoadingController} from "ionic-angular";
import {OnTestServiceMethodListener} from "./decorators/OnTestServiceMethodListener";
import {TestServiceMethodSignalContainer} from "./decorators/TestServiceMethodSignalContainer";
import {AbsListener} from "../system/Listener/AbsListener";

@Injectable()
export class TestService extends AbsBaseService {

    // @ServicePropDecorator({
    //     method_listener_class: OnTestServiceMethodListener,
    //     signals_container: TestServiceMethodSignalContainer,
    // })
    // public testService:IService<any>;
    public testService:IService<any, OnTestServiceMethodListener, TestServiceMethodSignalContainer>;

    private _scope:any; // lo metto solo per motivi di interfaccia

    public constructor(public http:Http,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {
        super(http, alertCtrl, loadingCtrl);

        this.testService = <IService<any, OnTestServiceMethodListener, TestServiceMethodSignalContainer>>{};
        this.testService._scope = this;
        this.testService.request = this.testServiceMethod;
        this.testService.signals = new TestServiceMethodSignalContainer();

    }

    /**
     *
     * @param id_request
     * @returns {Array<T>}
     */
    public getListeners<T>(id_request:string):Array<T> {
        return RequestManager.getListeners<T>(id_request);
    }

    /**
     *
     * @param id_request
     * @returns {RequestManager<R, L>}
     */
    public getRequest(id_request:string):RequestManager<any, any> {
        return RequestManager.getRequest(id_request);
    }

    /**
     *
     * @param params
     * @returns {RequestManager<ResponseVO<ResponseVO<any>>, onTestServiceMethodListener>}
     */
    // @ServiceMethodDecorator({
    //     method_listener_class: OnTestServiceMethodListener,
    //     signals_container: TestServiceMethodSignalContainer,
    // })
    private testServiceMethod(params:any):RequestManager<ResponseVO<any>, OnTestServiceMethodListener> {

        let scope:TestService = this._scope;
        let request_manager:RequestManager<ResponseVO<any>, OnTestServiceMethodListener> =
            new RequestManager<ResponseVO<any>, OnTestServiceMethodListener>();

        ////////////////////////////////////////////////////////

        let options:RequestVO = {
            endpoint: EndPoints.USERS_ME,
            config: {},
            data: params
        };

        let success_handler:(response: ResponseVO<any>) => void = (response: ResponseVO<any>) => {
            // console.log("success_handler");
            scope.testService.signals.onTestServiceSuccess.dispatch();

            let l:number = RequestManager.listener_decorator.length;

            for (let i = 0; i < l; i++) {
                if (RequestManager.listener_decorator[i].id === request_manager.id_request &&
                    RequestManager.listener_decorator[i].listener.eventOne) {
                    RequestManager.listener_decorator[i].listener.eventOne(response);
                }
            }

            scope.testService.signals.onTestServiceEventOne.dispatch();

        };

        let error_handler:(error) => void = (error) => {
            // console.log("error_handler");
            scope.testService.signals.onTestServiceError.dispatch();

            let l:number = RequestManager.listener_decorator.length;

            for (let i = 0; i < l; i++) {
                if (RequestManager.listener_decorator[i].id === request_manager.id_request &&
                    RequestManager.listener_decorator[i].listener.eventTwo) {
                    RequestManager.listener_decorator[i].listener.eventTwo(error);
                }
            }

            scope.testService.signals.onTestServiceEventOne.dispatch();

        };

        ////////////////////////////////////////////////////////

        // console.log("this", this);

        return scope.setRequestGet<ResponseVO<any>, OnTestServiceMethodListener>(
            request_manager,
            options,
            success_handler,
            error_handler
        );
    }
}

interface IService<R, L extends AbsListener, S> {
    request:(params:any) => RequestManager<ResponseVO<R>, L>;
    signals:S;
    _scope:any
}