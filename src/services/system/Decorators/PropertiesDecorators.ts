import {LocalStorageHelper} from "../../../utils/LocalStorageHelper";

/**
 *
 * @returns {(target:any, key:string)=>undefined}
 */
export function setLocalStorage() {
    return (target: any, key: string) => {

        let _val = target[key];

        // property getter
        let getter = function () {

            if (LocalStorageHelper.has(key)) {
                if (typeof(_val) == "boolean") {
                    console.log("get boolean");
                    return LocalStorageHelper.getItemBoolean(key);
                }
                else if (typeof(_val) == "number") {
                    console.log("get number");
                    return LocalStorageHelper.getItemFloat(key);
                }
                else if (typeof(_val) == "string") {
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

            if (typeof newVal == "boolean") {
                console.log("set boolean");
                LocalStorageHelper.setItemBoolean(key, newVal);
            }
            else if (typeof newVal == "number") {
                console.log("set number");
                LocalStorageHelper.setItemFloat(key, newVal);
            }
            else if (typeof newVal == "string") {
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

        }
    }
}

/**
 *
 * @returns {(target:any, key:string)=>undefined}
 */
export function setSecureStorage() {
    return (target: any, key: string) => {

        let _val = target[key];

    }
}

/**
 *
 * @returns {(target:any, key:string)=>undefined}
 */
export function setFileStorage() {
    return (target: any, key: string) => {

        let _val = target[key];

    }
}