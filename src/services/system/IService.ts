import {ResponseVO} from "../../vo/ResponseVO";
import {RequestManager} from "./RequestManager";
import {AbsListener} from "./Listener/AbsListener";

export interface IService<R, L extends AbsListener, S, P> {
    request:(params:any, scope?:any) => RequestManager<ResponseVO<R>, L>;
    properties:P,
    signals:S;
}


export class Cazzimm<R, L extends AbsListener, S, P> {
    request:(params:any, scope?:any) => RequestManager<ResponseVO<R>, L>;
    properties:P;
    signals:S;
}