import {EndPointVO} from "../vo/EndPointVO";
import {WarningLevel} from "./Emun";

export class EndPoints {

    static USERS_ME:EndPointVO = {
        url:"https://private-0bee5-testapi3214.apiary-mock.com/json/testi_app_20170502_1505",
        warning_level:WarningLevel.LOW,
        access: false,
        refresh: false,
        retry:0
    };

}
