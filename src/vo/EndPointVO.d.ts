import {WarningLevel} from "../utils/Emun";

interface EndPointVO {
    url:string,
    warning_level:WarningLevel,
    access:boolean,
    refresh:boolean,
    retry?:number,
    debounce?:number
}