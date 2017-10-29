import {RequestVO} from "../../../vo/RequestVO";
import {AbsListener} from "../Listener/AbsListener";
import any = jasmine.any;
export enum MemMethod {
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
        method:MemMethod
    }
}

interface IHandleDataDecoratorArgs {
    [prop_name:string]: Array<{
        platform:Platform,
        method:MemMethod
    }>
}


export function MemTokens(args:Array<IHandleTokenDecoratorArgs> = null) {

}

export function MemProps(args:Array<IHandleDataDecoratorArgs> = null):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => any> {

    // TODO: perchè si possono non passare parametri?
    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => any> => {

        console.log({
            target: target,
            key: key,
            descriptor: descriptor
        });

        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;

        descriptor.value = function () {

            let args = [];
            for (let i = 0; i < arguments.length; i++) {
                args[i] = arguments[i];
            }

            // before /* START */
            // before /* FINISH */

            let result = originalMethod.apply(this, args);

            // after /* START */
            // after /* FINISH */

            return result;
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}