import {RequestManager} from "../RequestManager";
import {ResponseVO} from "../../../vo/ResponseVO";
import {RequestVO} from "../../../vo/RequestVO";
import {AbsListener} from "../Listener/AbsListener";
import {WarningLevel} from "../../../utils/Emun";
import {Loading, LoadingController} from "ionic-angular";

export class AbsAppIonicBaseService {

    protected static is_loading_active:boolean = false;
    protected static is_loading_enabled:boolean = false;

    private static loading:Loading;

    /**
     *
     * @param loadingCtrl
     */
    constructor(protected loadingCtrl:LoadingController) {}

    /**
     *
     * @param request_manager
     * @param options
     */
    protected setHandlers(request_manager:RequestManager<ResponseVO<any>, AbsListener> ,options:RequestVO):void {
        request_manager.setStartAndFinishReqHandlers(options,
            (request:RequestManager<ResponseVO<any>, AbsListener>) => {

                let warning_level:WarningLevel;

                if (request.options.warning_level_override) {
                    warning_level = request.options.warning_level_override;
                }
                else {
                    warning_level = request.options.endpoint.warning_level
                }

                if (warning_level !== WarningLevel.SILENT) {
                    if (!AbsAppIonicBaseService.is_loading_active && (RequestManager.request_counter > 0)) {
                        this.presentLoadingDefault();
                    }
                }
            },
            (request:RequestManager<ResponseVO<any>, AbsListener>) => {
                if (AbsAppIonicBaseService.is_loading_active && (RequestManager.request_counter == 0)) {
                    console.log("dismiss!!");
                    this.dismissLoadingDefault();
                }
            }
        );
    }

    /**
     *
     */
    protected presentLoadingDefault() {
        AbsAppIonicBaseService.is_loading_active = true;
        AbsAppIonicBaseService.loading = this.loadingCtrl.create({
            content: 'Caricamento'
        });
        AbsAppIonicBaseService.loading.present();
    }

    /**
     *
     */
    protected dismissLoadingDefault() {
        AbsAppIonicBaseService.is_loading_active = false;
        AbsAppIonicBaseService.loading.dismiss()
            .then((sdf) => {})
            .catch((errore) => {});
    }

}