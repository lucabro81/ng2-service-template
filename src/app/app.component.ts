import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {TestService} from "../services/test/test.service";
import {StorageService} from "../IonicAppModule/services/StorageService";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any = HomePage;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public test_service:TestService,
                public storage_service:StorageService) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            // this.test_service
            //     .getRequest("ziocan")
            //     .setListener(new class extends OnTestServiceMethodListener {
            //
            //         public onSuccess(evt):void {
            //             super.onSuccess(evt);
            //             console.log("porcocazzo anonym.onSuccess");
            //         }
            //
            //         public onError(error):void {
            //             super.onError(error);
            //             console.log("porcocazzo anonym.onError");
            //         }
            //
            //         public eventOne():void {
            //             super.eventOne();
            //             console.log("porcocazzo eventOne");
            //         }
            //
            //         public eventTwo():void {
            //             super.eventTwo();
            //             console.log("porcocazzo eventTwo");
            //         }
            //
            //         public destroy():void {
            //             super.destroy();
            //             console.log("porcocazzo destroy");
            //         }
            //     });

            // todo: se si passa nul come listener si spacca, cheffacciolascio?

            // console.log("dasdd",this.test_service
            //     .testServiceObj
            //     .signals);

            // this.test_service
            //     .testSrv
            //     .signals
            //     .onTestServiceSuccess.add((scope:any, params:Array<any>) => {
            //         console.log("signal onTestServiceSuccess", scope, params);
            //         console.log("this.test_service.testSrv.properties.prop1", scope.properties.prop1);
            //     }, this)
            //     .onTestServiceError.add((scope:any, params:Array<any>) => {
            //         // console.log("signal onTestServiceError");
            //     }, this);
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
                // .synchronize()
                // .setRequestId("ziocan")
                // .setListener(new class extends OnTestServiceMethodListener {
                //
                //     public onSuccess(evt):void {
                //         super.onSuccess(evt);
                //         console.log("anonym.onSuccess");
                //     }
                //
                //     public onError(error):void {
                //         super.onError(error);
                //         console.log("anonym.onError");
                //     }
                //
                //     public eventOne():void {
                //         super.eventOne();
                //         console.log("eventOne");
                //     }
                //
                //     public eventTwo():void {
                //         super.eventTwo();
                //         console.log("eventTwo");
                //     }
                //
                //     public destroy():void {
                //         super.destroy();
                //         console.log("destroy");
                //     }
                // })
                // .run();

            this.test_service
                .testSrv
                .request({some_data:"data", other_data:"more_data"})
                .synchronize()
                .run();

            console.log("this.storage_service.has(\"asd\"): ", this.storage_service.has("asd"));

            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
            //
            // this.test_service
            //     .testSrv
            //     .request({some_data:"data", other_data:"more_data"})
            //     .synchronize()
            //     .run();
        });
    }
}

