import {EndPointVO} from "./EndPointVO";
import {Signal} from "signals";
import {WarningLevel} from "../utils/Emun";

interface RequestVO {
    endpoint:EndPointVO,
    data?:any,
    config?:any,
    error_signals?:Array<Signal>,
    error_intercept?:boolean,
    error_callback?:() => void,
    warning_level_override?:WarningLevel,
    retry_override?:number,
    debounce_override?:number,
}