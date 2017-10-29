import {Injectable, Type} from "@angular/core";
import {RequestManager} from "../system/RequestManager";
import {AbsBaseService} from "../system/Abs/AbsBaseService";
import {EndPoints} from "../../utils/EndPoints";
import {ResponseVO} from "../../vo/ResponseVO";
import { Http } from "@angular/http";
import {AlertController, LoadingController} from "ionic-angular";
import {OnTestServiceMethodListener} from "./decorators/OnTestServiceMethodListener";
import {TestServiceMethodSignalContainer} from "./decorators/TestServiceMethodSignalContainer";
import {IService} from "../system/IService";
import {Get} from "../system/Decorators/ServiceMethodRequestDecorator";
import {MemMethod, MemProps, Platform} from "../system/Decorators/HandleTokenDecorator";
import {saasasasasa} from "../system/Decorators/ServiceClassDecorator";
// import {ServiceClassDecorator} from "../system/Decorators/ServiceClassDecorator";

@Injectable()
// @ServiceClassDecorator()
export class TestService extends AbsBaseService {

    // 1 - define an object of type IService<Response type, Listener decorator, Signal container>
    // @saasasasasa({signal_container:TestServiceMethodSignalContainer})
    public testSrv:IService<any,
        OnTestServiceMethodListener,
        TestServiceMethodSignalContainer,
        {
            prop1:number,
            prop2:string
        }>;

    constructor(protected http:Http,
                protected alertCtrl:AlertController,
                protected loadingCtrl:LoadingController) {
        super(http, alertCtrl, loadingCtrl);
        // 2 - initialize the object passing the Signal container class and the name
        this.testSrv =
            this.setServiceObj<any,
                OnTestServiceMethodListener,
                TestServiceMethodSignalContainer,
                {
                    prop1:number,
                    prop2:string
                }>
            (TestServiceMethodSignalContainer, "testSrv");
        // this.testSrv.properties = <{
        //     prop1:number,
        //     prop2:string
        // }>{};

        console.log("adsdsdasdassdasadas");

    }

    /**
     *
     * @param params
     * @returns {RequestManager<ResponseVO<ResponseVO<any>>, onTestServiceMethodListener>}
     */
    // 3 - set a service method with name "_" + service name
    @Get<ResponseVO<any>, OnTestServiceMethodListener>({
            endpoint: EndPoints.USERS_ME,
            config: {}
        })
    @MemProps([
        {
            "prop1": [{
                platform:Platform.ANDROID,
                method:MemMethod.LOCALHOST
            }, {
                platform:Platform.IOS,
                method:MemMethod.SECURESTORAGE
            }]
        },
        {
            "prop2": [{
                platform:Platform.ANDROID,
                method:MemMethod.LOCALHOST
            }, {
                platform:Platform.IOS,
                method:MemMethod.SECURESTORAGE
            }]
        }
    ])
    // private static _testSrv(params:any, scope:TestService):any {
    //     return {
    //         success_handler:
    //             (response: ResponseVO<any>) => {
    //                 scope.testSrv.properties.prop1 = Math.random();
    //                 scope.testSrv.properties.prop2 = "" + Math.random();
    //                 scope.testSrv.signals.onTestServiceSuccess.dispatch();
    //                 scope.fireEvent(params.request_manager, "eventOne", response);
    //                 scope.testSrv.signals.onTestServiceEventOne.dispatch();
    //             },
    //
    //         error_handler:
    //             (error) => {
    //                 scope.testSrv.signals.onTestServiceError.dispatch();
    //                 scope.fireEvent(params.request_manager, "eventTwo", error);
    //                 scope.testSrv.signals.onTestServiceEventOne.dispatch();
    //             }
    //     }
    // }
    private _testSrv(params:any):any {
        return {
            success_handler:
                (response: ResponseVO<any>) => {
                    this.testSrv.properties.prop1 = Math.random();
                    this.testSrv.properties.prop2 = "" + Math.random();
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