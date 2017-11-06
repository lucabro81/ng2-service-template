import {RequestVO} from "../../../vo/RequestVO";
import {AbsListener} from "../Listener/AbsListener";
import any = jasmine.any;
export enum StorageMethod {
    LOCALHOST = 0,
    FILE = 1,
    SECURESTORAGE = 2,
}

export enum Platform {
    IOS = 0,
    ANDROID = 1,
    WEB = 2,
}

interface IHandleTokenDecoratorArgs {
    [platform_name:number]: { // non può essere di tipo Platform... che sono comunque interi... vabbè, solo string o number... grazie typescript
        method:StorageMethod
    }
}

interface IHandleDataDecoratorArgs {
    [prop_name:string]: Array<{
        platform:Platform,
        method:StorageMethod
    }>
}


export function MemTokens(args:Array<IHandleTokenDecoratorArgs> = null) {

}