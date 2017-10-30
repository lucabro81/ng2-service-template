// ref. https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {RequestManager} from "../RequestManager";
import {AbsListener} from "../Listener/AbsListener";
import {RequestVO} from "../../../vo/RequestVO";

///////////////////////////////////////////////////////////
//////////////////// INTERFACES / ENUM ////////////////////
///////////////////////////////////////////////////////////

export enum Platform {
    IOS = 0,
    ANDROID = 1,
    WEB = 2,
}

interface IHandleDataDecoratorArgs {
    [prop_name:string]: Array<{
        platform:Platform,
        method:MemMethod
    }>
}

export enum MemMethod {
    LOCALHOST = 0,
    FILE = 1,
    SECURESTORAGE = 2,
}

///////////////////////////////////////////////
//////////////////// UTILS ////////////////////
///////////////////////////////////////////////

/**
 *
 * @param target
 * @param key
 * @param descriptor
 */
function originalMethodGen(target: Object,
                           key: string,
                           descriptor: any) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    return descriptor.value;
}

/**
 *
 * @param scope
 * @param originalMethod
 * @returns {{originalMethod, args: Array}}
 */
function before<R, L extends AbsListener>(scope, originalMethod) {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
    }

    console.log("before args", arguments);

    let request_manager: RequestManager<R, L> =
        new RequestManager<R, L>();
    args[0]["request_manager"] = request_manager;

    return { originalMethod: originalMethod.apply(scope, args), args:args};
}

/**
 *
 * @param scope
 * @param originalMethod
 * @returns {{originalMethod, args: Array}}
 */
function before1<R, L extends AbsListener>(originalMethod, diocane) {

    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
    }

    console.log("before args", arguments);

    let request_manager: RequestManager<R, L> =
        new RequestManager<R, L>();
    args[0]["request_manager"] = request_manager;

    return { originalMethod: originalMethod.apply(diocane, args), args:args};
}

/**
 *
 * @param endpoint
 * @param result
 * @param method
 * @returns {RequestManager<R, L>}
 */
function after<R, L extends AbsListener>(endpoint:RequestVO, result, method:string) {
    endpoint["data"] = result.args[0];
    // FIXME: se uso questa ottengo: Untyped function calls may not accept type arguments
    // return this.setRequestGet<R, L>
    return <RequestManager<R, L>>this["setRequest" + method](
        result.args[0]["request_manager"],
        endpoint,
        result.originalMethod["success_handler"],
        result.originalMethod["error_handler"]
    );
}

/**
 *
 * @param endpoint
 * @param result
 * @param method
 * @returns {RequestManager<R, L>}
 */
function after1<R, L extends AbsListener>(endpoint:RequestVO, result, args, method:string, diocane) {
    console.log("result", result);
    endpoint["data"] = args[0];
    // FIXME: se uso questa ottengo: Untyped function calls may not accept type arguments
    // return this.setRequestGet<R, L>
    return <RequestManager<R, L>>diocane["setRequest" + method](
        args[0]["request_manager"],
        endpoint,
        result["success_handler"],
        result["error_handler"]
    );
}

/**
 *
 * @param originalMethod
 * @param endpoint
 * @param method
 * @returns {RequestManager<R, L>}
 */
function newDescriptor<R, L extends AbsListener>(originalMethod, endpoint:RequestVO, method:string, scope:any) {
    let result = before<R, L>(scope, originalMethod);
    return after(endpoint, result, method);

}

////////////////////////////////////////////////////
//////////////////// DECORATORS ////////////////////
////////////////////////////////////////////////////

/**
 *
 * @param endpoint
 * @returns {(target:Object, key:string, descriptor:any)=>TypedPropertyDescriptor<(params:any)=>RequestManager<R, L>>}
 * @constructor
 */
export function Post<R, L extends AbsListener>(endpoint:RequestVO):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> {

    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

        let originalMethod = originalMethodGen(target, key, descriptor);
        descriptor.value = newDescriptor<R, L>(originalMethod, endpoint, "POST", this);

        return descriptor;
    }
}

/**
 *
 * @param endpoint
 * @returns {(target:Object, key:string, descriptor:any)=>TypedPropertyDescriptor<(params:any)=>RequestManager<R, L>>}
 * @constructor
 */
export function Get<R, L extends AbsListener>(endpoint:RequestVO):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> {

    // return (
    //     target: Object,
    //     key: string,
    //     descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {
    //
    //     let originalMethod = originalMethodGen(target, key, descriptor);
    //     descriptor.value = newDescriptor<R, L>(originalMethod, endpoint, "GET", descriptor.value);
    //
    //     return descriptor;
    // }

    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

        // if (descriptor === undefined) {
        //     descriptor = Object.getOwnPropertyDescriptor(target, key);
        // }
        // let originalMethod = descriptor.value;
        let originalMethod = originalMethodGen(target, key, descriptor);

        descriptor.value = function () {

            // let args = [];
            // for (let i = 0; i < arguments.length; i++) {
            //     args[i] = arguments[i];
            // }
            //
            // // before /* START */
            // let request_manager: RequestManager<R, L> =
            //     new RequestManager<R, L>();
            // args[0]["request_manager"] = request_manager;
            // // before /* FINISH */
            //
            // console.log("scope!!!!!", this, descriptor.value);
            //
            // let result = originalMethod.apply(this, args);

            let result = before1(originalMethod, this);

            // // after /* START */
            // endpoint["data"] = args[0];
            // // let scope = args[1];
            //
            // // console.log("scope GET",scope);
            // // FIXME: se uso questa ottengo: Untyped function calls may not accept type arguments
            // // return this.setRequestGet<R, L>
            // return <RequestManager<R, L>>this["setRequestGET"](
            //     args[0]["request_manager"],
            //     endpoint,
            //     result["success_handler"],
            //     result["error_handler"]
            // );

            return after1<R, L>(endpoint, result.originalMethod, result.args, "GET", this);
            // after /* FINISH */
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}

/**
 *
 * @param args
 * @returns {(target:Object, key:string, descriptor:any)=>TypedPropertyDescriptor<(params:any)=>any>}
 * @constructor
 */
export function SetStorage(args:Array<IHandleDataDecoratorArgs> = null):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => any> {

    // TODO: perchè si possono non passare parametri?
    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => any> => {

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
            console.log("this!!!!", this);
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
