import {Injectable, Input} from "@angular/core";
import {RequestManager} from "../system/RequestManager";
import {AbsBaseService} from "../system/Abs/AbsBaseService";
import {RequestVO} from "../../vo/RequestVO";
import {EndPoints} from "../../utils/EndPoints";
import {ResponseVO} from "../../vo/ResponseVO";
import { Http } from "@angular/http";
import {AlertController, LoadingController} from "ionic-angular";
import {OnTestServiceMethodListener} from "./decorators/OnTestServiceMethodListener";
import {TestServiceMethodSignalContainer} from "./decorators/TestServiceMethodSignalContainer";
import {IService} from "../system/IService";

@Injectable()
export class TestService extends AbsBaseService {

    // 1 - define an object of type IService<Response type, Listener decorator, Signal container>
    public testSrv:IService<any, OnTestServiceMethodListener, TestServiceMethodSignalContainer>;

    constructor(protected http:Http,
                protected alertCtrl:AlertController,
                protected loadingCtrl:LoadingController) {
        super(http, alertCtrl, loadingCtrl);
        // 2 - initialize the object passing the Signal container class and the name
        this.testSrv =
            this.setServiceObj<any, OnTestServiceMethodListener, TestServiceMethodSignalContainer>
            (TestServiceMethodSignalContainer, "testSrv");
    }

    /**
     *
     * @param params
     * @returns {RequestManager<ResponseVO<ResponseVO<any>>, onTestServiceMethodListener>}
     */
    // 3 - set a service method with name "_" + service name
    private _testSrv(params:any):RequestManager<ResponseVO<any>, OnTestServiceMethodListener> {

        console.log("this", this);

        let request_manager:RequestManager<ResponseVO<any>, OnTestServiceMethodListener> =
            new RequestManager<ResponseVO<any>, OnTestServiceMethodListener>();

        ////////////////////////////////////////////////////////

        let success_handler:(
                response: ResponseVO<any>,
                //req_manager:RequestManager<ResponseVO<any>, OnTestServiceMethodListener>
            ) => void =
            (
                response: ResponseVO<any>,
                // req_manager:RequestManager<ResponseVO<any>, OnTestServiceMethodListener>
            ) => {
                this.testSrv.signals.onTestServiceSuccess.dispatch();
                this.fireEvent(request_manager, "eventOne", response);
                this.testSrv.signals.onTestServiceEventOne.dispatch();

            };

        let error_handler:(
                error,
                // req_manager:any
        ) => void =
        (error) => {
            this.testSrv.signals.onTestServiceError.dispatch();
            this.fireEvent(request_manager, "eventTwo", error);
            this.testSrv.signals.onTestServiceEventOne.dispatch();
        };

        ////////////////////////////////////////////////////////


        let options:RequestVO = {
            endpoint: EndPoints.USERS_ME,
            config: {},
            data: params
        };

        return this.setRequestGet<ResponseVO<any>, OnTestServiceMethodListener>(
            request_manager,
            options,
            success_handler,
            error_handler
        );
    }

}