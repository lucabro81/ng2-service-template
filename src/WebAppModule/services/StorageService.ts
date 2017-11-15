import {Injectable} from "@angular/core";

export enum StorageType {
    LOCALSTORAGE = 0,
    FILESTORAGE = 1,
    SECURESTORAGE = 2,
}

@Injectable()
export class StorageService {

    private local_storage:Storage;

    constructor() {
        this.local_storage = window.localStorage;

    }

////////////////////////////
////////// PUBLIC //////////
////////////////////////////

    public has(key:string):boolean {
        return true;
    }

    public where(key:string):StorageType {
        return null
    }

    public store<T>(key:string, value:T, behaviour:any):void {

    }

    public read<T>(key:string, default_value:T, behaviour:any):T {
        return null
    }

/////////////////////////////
////////// PRIVATE //////////
/////////////////////////////

    /**
     *
     * @param key
     * @param data
     */
    private storeLocalStorageString(key:string, data:string):void {
        this.local_storage.setItem(key, data);
    }

    /**
     *
     * @param key
     * @param data
     */
    private storeLocalStorageNumber(key:string, data:number):void {
        this.local_storage.setItem(key, data.toString());
    }

    /**
     *
     * @param key
     * @param data
     */
    private storeLocalStorageBoolean(key:string, data:boolean):void {
        if (data) {
            this.local_storage.setItem(key, "true");
        }
        else {
            this.local_storage.setItem(key, "false");
        }

        this.local_storage.setItem(key, (data) ? "true" : "false")
    }

    /**
     *
     * @param key
     * @param data
     */
    private storeLocalStorageObj(key:string, data:any) {
        this.local_storage.setItem(key, JSON.stringify(data));
    }

    /**
     *
     * @param key
     * @param default_value
     * @returns {string}
     */
    private readLocalStorageString(key:string, default_value:string):string {
        let value = this.local_storage.getItem(key);
        if (!value) {
            return default_value;
        }
        return value;
    }

    /**
     *
     * @param key
     * @param default_value
     * @returns {number}
     */
    private readLocalStorageNumber(key:string, default_value:number):number {
        let value:number = parseFloat(this.local_storage.getItem(key));
        if (!value) {
            return default_value;
        }
        return value;
    }

    /**
     *
     * @param key
     * @param default_value
     * @returns {boolean}
     */
    private readLocalStorageBoolean(key:string, default_value:boolean):boolean {
        let value = this.local_storage.getItem(key);

        if (value === "false" || value === "0") {
            return false;
        }
        else if (value === "true" || value === "1") {
            return true;
        }

        return default_value;
    }

    /**
     *
     * @param key
     * @param default_value
     * @returns {any}
     */
    private readLocalStorageObj(key:string, default_value:any):any {
        let value = this.local_storage.getItem(key);
        if (!value) {
            return default_value;
        }
        return JSON.parse(value);
    }

    /**
     *
     * @param key
     */
    private localStorageremove(key:string):void {
        let value = this.local_storage.getItem(key);
        if (value) {
            this.local_storage.removeItem(key);
        }
    }

}