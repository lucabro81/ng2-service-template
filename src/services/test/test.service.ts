import {Injectable, Type} from "@angular/core";
import {EndPoints} from "../../utils/EndPoints";
import {ResponseVO} from "../../vo/ResponseVO";
import { Http } from "@angular/http";
import {AlertController, LoadingController} from "ionic-angular";
import {OnTestServiceMethodListener} from "./decorators/OnTestServiceMethodListener";
import {TestServiceMethodSignalContainer} from "./decorators/TestServiceMethodSignalContainer";
import {AbsBaseService} from "../../IonicAppModule/services/Abs/AbsBaseService";
import {IService} from "../../IonicAppModule/services/System/IService";
import {Get} from "../../IonicAppModule/services/Decorators/ServiceMethodRequestDecorators";

class testSrvProperties {
    prop1:string;
    prop2:number;
}

@Injectable()
export class TestService extends AbsBaseService {

    // @setLocalStorage("properties.prop1", "properties.prop2")
    public testSrv:IService<any, OnTestServiceMethodListener, TestServiceMethodSignalContainer, testSrvProperties>;

    constructor(protected http:Http,
                protected alertCtrl:AlertController,
                protected loadingCtrl:LoadingController) {
        super(http, alertCtrl, loadingCtrl);

        ////////////////////////////////////////////////////////

        this.testSrv = this.setServiceObj(TestServiceMethodSignalContainer, "testSrv", testSrvProperties);
    }

    /**
     *
     * @param params
     * @returns {RequestManager<ResponseVO<ResponseVO<any>>, onTestServiceMethodListener>}
     */
    @Get<ResponseVO<any>, OnTestServiceMethodListener>({
            endpoint: EndPoints.USERS_ME,
            config: {}
        })
    private _testSrv(params:any):any {
        return {
            success_handler:
                (response: ResponseVO<any>) => {
                    this.testSrv.properties.prop2 = Math.random();
                    this.testSrv.properties.prop1 = "" + Math.random();
                    this.testSrv.signals.onTestServiceSuccess.dispatch(this.testSrv, ["asdadasd"]);
                    this.fireEvent(params.request_manager, "eventOne", response);
                    this.testSrv.signals.onTestServiceEventOne.dispatch(this.testSrv, ["asdadasd1"]);
                },

            error_handler:
                (error) => {
                    this.testSrv.signals.onTestServiceError.dispatch();
                    this.fireEvent(params.request_manager, "eventTwo", error);
                    this.testSrv.signals.onTestServiceEventOne.dispatch(this.testSrv, ["asdadasd2"]);
                }
        }
    }

}