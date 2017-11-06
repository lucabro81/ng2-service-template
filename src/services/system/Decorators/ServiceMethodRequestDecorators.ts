// ref. https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {RequestManager} from "../RequestManager";
import {AbsListener} from "../Listener/AbsListener";
import {RequestVO} from "../../../vo/RequestVO";
import {ResponseVO} from "../../../vo/ResponseVO";
import {LocalStorageHelper} from "../../../utils/LocalStorageHelper";

///////////////////////////////////////////////////////////
//////////////////// INTERFACES / ENUM ////////////////////
///////////////////////////////////////////////////////////

export enum Platform {
    IOS = 0,
    ANDROID = 1,
    WEB = 2,
}

interface IStorageDataArgs {
    platform:Platform,
    method:MemMethod
}


interface IHandleDataDecoratorArgs {
    [prop_name:string]: Array<IStorageDataArgs>
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
function before<R, L extends AbsListener>(originalMethod, scope) {

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
 * @param endpoint
 * @param result
 * @param method
 * @returns {RequestManager<R, L>}
 */
function after<R, L extends AbsListener>(endpoint:RequestVO, result, args, method:string, diocane) {
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
 * @param item
 * @param data
 * @param scope
 */
function storeData(item, data, scope) {
    console.log("storeData", {
        item: item,
        data: data,
        scope: scope
    });
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

        descriptor.value = function () {
            let result = before(originalMethod, this);
            return after<R, L>(endpoint, result.originalMethod, result.args, "POST", this);
        };

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

    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

        let originalMethod = originalMethodGen(target, key, descriptor);

        descriptor.value = function () {
            let result = before(originalMethod, this);
            return after<R, L>(endpoint, result.originalMethod, result.args, "GET", this);
        };

        return descriptor;
    }
}

/**
 *
 * @param args
 * @returns {(target:Object, key:string, descriptor:any)=>TypedPropertyDescriptor<(params:any)=>any>}
 * @constructor
 */
export function SetStorage(args:any = null):(
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

            let result_decorated:any = {
                success_handles:(response: ResponseVO<any>) => {

                    console.log("adsfasdfafafadf 1");

                    result["success_handler"](response);

                    // let l:number = args.length;
                    // let item:Array<IStorageDataArgs> = null;
                    //
                    // for (let name in args) {
                    //     if (args[name]) {
                    //         item = args[name];
                    //         storeData(item, this[key.slice(1)].properties[key], this);
                    //     }
                    // }
                },
                error_handler:(error) => {
                    result["error_handler"](error);

                    console.log("adsfasdfafafadf");

                    let l:number = args.length;
                    let item:Array<IStorageDataArgs> = null;

                    for (let name in args) {
                        if (args[name]) {
                            item = args[name];
                            storeData(item, this[key.slice(1)].properties[key], this);
                        }
                    }
                }
            };

            // after /* FINISH */

            return result_decorated;
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}

var i:number = 0;

/**
 *
 * @param args
 * @returns {(qwe:any, rty:any, uio:any)=>undefined}
 */
export function setLocalStorage(...args:Array<string>) {
    return (target: any, key: string) => {

        let _val = target[key];

        // property getter
        let getter = function () {

            if (LocalStorageHelper.has(key)) {
                if (typeof(_val) == "boolean") {
                    console.log("get boolean");
                    return LocalStorageHelper.getItemBoolean(key);
                }
                else if (typeof(_val)  == "number") {
                    console.log("get number");
                    return LocalStorageHelper.getItemFloat(key);
                }
                else if (typeof(_val)  == "string") {
                    console.log("get string");
                    return LocalStorageHelper.getItemString(key);
                }
                else {
                    console.log("get obj");
                    return LocalStorageHelper.getObj(key);
                }
            }

            return _val;
        };

        // property setter
        let setter = function (newVal) {

            if (typeof newVal  == "boolean") {
                console.log("set boolean");
                LocalStorageHelper.setItemBoolean(key, newVal);
            }
            else if (typeof newVal  == "number") {
                console.log("set number");
                LocalStorageHelper.setItemFloat(key, newVal);
            }
            else if (typeof newVal  == "string") {
                console.log("set string");
                LocalStorageHelper.setItemString(key, newVal);
            }
            else {
                console.log("set obj");
                LocalStorageHelper.setObj(key, newVal);
            }

            console.log(newVal + " Stored in local storage");
            _val = newVal;
        };

        // // Delete property.
        if (delete target[key]) {

            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });

            // se si devono decorare proprietà più profonde
            // setTimeout(() => {
            //
            //     // let path:Array<Array<string>> = [];
            //     //
            //     // for (let i = 0; i < args.length; i++) {
            //     //     path.push(args[i].split('.'));
            //     // }
            //     //
            //     // var path_handlers:Array<any> = [];
            //     // for (let i = 0; i < path.length; i++) {
            //     //     path_handlers.push({
            //     //         getter: () => {
            //     //
            //     //         },
            //     //         setter: (newVal) => {
            //     //
            //     //         },
            //     //
            //     //     })
            //     // }
            //
            //     var _val1 = target[key]["properties"]["prop1"];
            //
            //     // // property getter
            //     let getter1 = function () {
            //         return _val1;
            //     };
            //
            //     // property setter
            //     let setter1 = function (newVal) {
            //         console.log(newVal + " Stored in local storage");
            //         _val1 = newVal;
            //     };
            //
            //     Object.defineProperty(target[key]["properties"], "prop1", {
            //         get: getter1,
            //         set: setter1,
            //         enumerable: true,
            //         configurable: true
            //     });
            // }, 0);

        }
    }
}
