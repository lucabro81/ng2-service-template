// ref. https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {RequestManager} from "../RequestManager";
import {AbsListener} from "../Listener/AbsListener";
import {RequestVO} from "../../../vo/RequestVO";

export function ServiceMethodDecorator<R, L extends AbsListener>(endpoint:RequestVO, method:string):(
    target: Object,
    key: string,
    descriptor: any)=> TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> {

    // TODO: perchè si possono non passare parametri?
    return (
        target: Object,
        key: string,
        descriptor: any): TypedPropertyDescriptor<(params:any) => RequestManager<R, L>> => {

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
                let request_manager: RequestManager<R, L> =
                    new RequestManager<R, L>();
                args[0]["request_manager"] = request_manager;
            // before /* FINISH */

            let result = originalMethod.apply(this, args);

            // after /* START */
                endpoint["data"] = args[0];
                // FIXME: se uso questa ottengo: Untyped function calls may not accept type arguments
                // return this.setRequestGet<R, L>
                return <RequestManager<R, L>>this["setRequest"+method.toUpperCase()](
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
