import {Platform} from "ionic-angular";
import {Const} from "../../utils/Const";

export class AbsMainService {

    /**
     *
     * @param plt
     */
    constructor(public plt:Platform) {

        this.plt.ready().then(() => {

            Const.HAS_CORDOVA = this.plt.is(Const.PLT.CORDOVA);

            if (Const.HAS_CORDOVA) {
                Const.HAS_ANDROID = this.plt.is(Const.PLT.ANDROID);
                Const.HAS_IOS = this.plt.is(Const.PLT.IOS);

                this.cordovaDetected();
            }

        });

    }

    protected cordovaDetected() {
        console.log("cordovaDetected");
    }
}