// ref. https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {TestServiceMethodSignalContainer} from "../../test/decorators/TestServiceMethodSignalContainer";
import {OnTestServiceMethodListener} from "../../test/decorators/OnTestServiceMethodListener";
import {AbsListener} from "../Listener/AbsListener";
import {IService} from "../IService";
import {RequestManager} from "../RequestManager";
import {ResponseVO} from "../../../vo/ResponseVO";
import {Type} from "@angular/core";

export function ServiceClassDecorator(options: any = null) {
    return (target: any): any => {

        // save a reference to the original constructor
        let original = target;

        // a utility function to generate instances of a class
        function construct(constructor, args) {
            let c : any = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }

        // the new constructor behaviour
        let f : any = function (...args) {

            console.log("original", original, this);

            return construct(original, args);
        };

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    }
}

function setServiceObj<R, L extends AbsListener, S, P>(signal_container:{new(): S; }, obj_name:string, target?):IService<R, L, S, P> {
    let service_obj:IService<R, L, S, P> = <IService<R, L, S, P>>{};

    service_obj.request =
        function(params:any, scope:any) {

            console.log("scopescopescope", target);

            return target.constructor["_" + obj_name](params, scope);
        };

    service_obj.signals = new signal_container();

    service_obj.properties = <P>{};

    console.log(service_obj);

    return service_obj;
}

export function saasasasasa(options: any = {}) {

    return (target: any, key: string): any => {


        target[key] = setServiceObj<any,
                    AbsListener,
            TestServiceMethodSignalContainer,
                    {
                        prop1:number,
                        prop2:string
                    }>(options.signal_container, "testSrv", target);

        // // property value
        // var _val = target[key];
        //
        // console.log({target:target, key:key, options:options, asd:this});
        //
        // // // property getter
        // var getter = function () {
        //     console.log(`Get: ${key} => ${_val}`);
        //     return _val;
        // };
        //
        // // property setter
        // var setter = function (newVal) {
        //     console.log(`Set: ${key} => ${newVal}`);
        //
        //     _val = setServiceObj<any,
        //         OnTestServiceMethodListener,
        //         TestServiceMethodSignalContainer,
        //         {
        //             prop1:number,
        //             prop2:string
        //         }>(TestServiceMethodSignalContainer, "testSrv", target);
        // };
        //
        // // Delete property.
        // if (delete target[key]) {
        //
        //     // Create new property with getter and setter
        //     Object.defineProperty(target, key, {
        //         get: getter,
        //         set: setter,
        //         // value: setServiceObj<any,
        //         //     OnTestServiceMethodListener,
        //         //     TestServiceMethodSignalContainer,
        //         //     {
        //         //         prop1:number,
        //         //         prop2:string
        //         //     }>(TestServiceMethodSignalContainer, "testSrv", target),
        //         enumerable: true,
        //         configurable: true
        //     });
        // }
    }
}