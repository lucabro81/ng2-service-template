// ref. https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {RequestManager} from "../RequestManager";
import {AbsListener} from "../Listener/AbsListener";
import {RequestVO} from "../../../vo/RequestVO";

//////////////////// UTILS

function originalMethodGen(target: Object,
                           key: string,
                           descriptor: any) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    return descriptor.value;
}

function before<R, L extends AbsListener>(scope, originalMethod) {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
    }

    let request_manager: RequestManager<R, L> =
        new RequestManager<R, L>();
    args[0]["request_manager"] = request_manager;

    return { originalMethod: originalMethod.apply(scope, args), args:args};
}

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

function newDescriptor<R, L extends AbsListener>(originalMethod, endpoint:RequestVO, method:string) {
    let result = before<R, L>(this, originalMethod);
    return after<R, L>(endpoint, result, method);

}

//////////////////// DECORATORS

export function Post<R, L extends AbsListener>(endpoint:RequestVO):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> {

    // TODO: scoprire perchè si possono non passare parametri?
    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

        let originalMethod = originalMethodGen(target, key, descriptor);
        descriptor.value = newDescriptor<R, L>(originalMethod, endpoint, "POST");

        return descriptor;
    }
}

export function Get<R, L extends AbsListener>(endpoint:RequestVO):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> {

    // TODO: perchè si possono non passare parametri?
    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

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
            let request_manager: RequestManager<R, L> =
                new RequestManager<R, L>();
            args[0]["request_manager"] = request_manager;
            // before /* FINISH */

            let result = originalMethod.apply(this, args);

            // after /* START */
            endpoint["data"] = args[0];
            // let scope = args[1];

            // console.log("scope GET",scope);
            // FIXME: se uso questa ottengo: Untyped function calls may not accept type arguments
            // return this.setRequestGet<R, L>
            return <RequestManager<R, L>>this["setRequestGET"](
                args[0]["request_manager"],
                endpoint,
                result["success_handler"],
                result["error_handler"]
            );
            // after /* FINISH */
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}
