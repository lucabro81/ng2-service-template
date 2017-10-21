import {Injectable} from "@angular/core";
import {RequestManager} from "../system/RequestManager";
import {AbsBaseService} from "../system/Abs/AbsBaseService";
import {EndPoints} from "../../utils/EndPoints";
import {ResponseVO} from "../../vo/ResponseVO";
import { Http } from "@angular/http";
import {AlertController, LoadingController} from "ionic-angular";
import {OnTestServiceMethodListener} from "./decorators/OnTestServiceMethodListener";
import {TestServiceMethodSignalContainer} from "./decorators/TestServiceMethodSignalContainer";
import {IService} from "../system/IService";
import {ServiceMethodDecorator} from "../system/Decorators/ServiceMethodDecorator";

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
    @ServiceMethodDecorator<ResponseVO<any>, OnTestServiceMethodListener>({
        endpoint: EndPoints.USERS_ME,
        config: {}
    })
    private _testSrv(params:any):any {
        return {
            success_handler:
                (response: ResponseVO<any>) => {
                    this.testSrv.signals.onTestServiceSuccess.dispatch();
                    this.fireEvent(params.request_manager, "eventOne", response);
                    this.testSrv.signals.onTestServiceEventOne.dispatch();

                },

            error_handler:
                (error) => {
                    this.testSrv.signals.onTestServiceError.dispatch();
                    this.fireEvent(params.request_manager, "eventTwo", error);
                    this.testSrv.signals.onTestServiceEventOne.dispatch();
                }
        }
    }

}