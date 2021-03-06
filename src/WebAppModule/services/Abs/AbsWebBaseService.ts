import {ResponseVO} from "../../../vo/ResponseVO";
import {RequestVO} from "../../../vo/RequestVO";
import {AbsListener} from "../Listener/AbsListener";
import {WarningLevel} from "../../../utils/Emun";
import {RequestManager} from "../System/RequestManager";

export class AbsWebBaseService {

    protected static is_loading_active:boolean = false;
    protected static is_loading_enabled:boolean = false;

    /**
     *
     */
    constructor() {}

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
                    if (!AbsWebBaseService.is_loading_active && (RequestManager.request_counter > 0)) {
                        this.presentLoadingDefault();
                    }
                }
            },
            (request:RequestManager<ResponseVO<any>, AbsListener>) => {
                if (AbsWebBaseService.is_loading_active && (RequestManager.request_counter == 0)) {
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
        AbsWebBaseService.is_loading_active = true;
        console.log("presentLoadingDefault");
    }

    /**
     *
     */
    protected dismissLoadingDefault() {
        AbsWebBaseService.is_loading_active = false;
        console.log("dismissLoadingDefault");
    }
}