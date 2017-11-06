export class LocalStorageHelper {

    constructor() {}

    /**
     *
     * @param key
     * @returns {boolean}
     */
    public static has(key:string):boolean {
        return !!(window.localStorage.getItem(key));
    }

    /**
     *
     * @param key
     * @returns {any}
     */
    public static typeOf(key:string):string {
        let value = window.localStorage.getItem(key);
        if (value) {
            return typeof(window.localStorage.getItem(key));
        }
        return null

    }

    /**
     *
     * @param key
     * @param data
     */
    public static setItemString(key:string, data:string) {
        window.localStorage.setItem(key, data);
    }

    /**
     *
     * @param key
     * @param data
     */
    public static setItemInteger(key:string, data:number) {
        window.localStorage.setItem(key, data.toString());
    }

    /**
     *
     * @param key
     * @param data
     */
    public static setItemFloat(key:string, data:number) {
        window.localStorage.setItem(key, data.toString());
    }

    /**
     *
     * @param key
     * @param data
     */
    public static setItemBoolean(key:string, data:boolean) {
        if (data) {
            window.localStorage.setItem(key, "true");
        }
        else {
            window.localStorage.setItem(key, "false");
        }

        window.localStorage.setItem(key, (data) ? "true" : "false")
    }

    /**
     *
     * @param key
     * @param data
     */
    public static setObj(key:string, data:any) {
        console.log("data", data);
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     *
     * @param key
     */
    public static getItemString(key:string):string {
        var value = window.localStorage.getItem(key);
        return value;
    }

    /**
     *
     * @param key
     */
    public static getItemInteger(key:string):number {
        var value = window.localStorage.getItem(key);
        return parseInt(value);
    }

    /**
     *
     * @param key
     */
    public static getItemFloat(key:string):number {
        var value = window.localStorage.getItem(key);
        return parseFloat(value);
    }

    /**
     *
     * @param key
     */
    public static getItemBoolean(key:string):boolean|null {
        var value = window.localStorage.getItem(key);

        if (value === "false" || value === "0") {
            return false;
        }
        else if (value === "true" || value === "1") {
            return true;
        }

        return null;
    }

    /**
     *
     * @param key
     */
    public static getObj(key:string):any {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    /**
     *
     * @param key
     */
    public static remove(key:string):void {
        var value = window.localStorage.getItem(key);
        if (value) {
            window.localStorage.removeItem(key);
        }
    }
}