import {ResponseVO} from "../../vo/ResponseVO";
import {RequestManager} from "./RequestManager";
import {AbsListener} from "./Listener/AbsListener";

export interface IService<R, L extends AbsListener, S> {
    request:(params:any) => RequestManager<ResponseVO<R>, L>;
    signals:S;
}