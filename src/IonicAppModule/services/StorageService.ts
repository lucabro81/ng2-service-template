import {Injectable} from "@angular/core";
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage';
import {File} from '@ionic-native/file';
import {Const} from "../utils/Const";

export enum StorageType {
    LOCALSTORAGE = 0,
    FILESTORAGE = 1,
    SECURESTORAGE = 2,
}

interface IWhereHase {
    has:boolean;
    where:StorageType;
}

@Injectable()
export class StorageService {

    public static BEHAVIOUR:any = {};

    private static ACCOUNT:string = "APP_SECURE_STORAGE_ACCOUNT";

    private local_storage:Storage;
    private secure_storage:SecureStorage;
    private file_storage:File;
    private secure_storage_instance:SecureStorageObject;

    constructor(secure_storage:SecureStorage,
                file_storage:File) {
        this.local_storage = window.localStorage;
        this.secure_storage = secure_storage;
        this.file_storage = file_storage;
    }

////////////////////////////
////////// PUBLIC //////////
////////////////////////////

    public has(key:string):Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            // check in localStorage
            let value = this.local_storage.getItem(key);
            if (value) {
                return resolve(true);
            }

            if (Const.HAS_CORDOVA) {
                this.getStoreInstance()
                    .then((storage) => this.getInstanceSuccess(storage, key, resolve, reject))
                    .catch()
            }
            else {
                return resolve(false);
            }
        });

    }

    public where(key:string):StorageType {
        return null
    }

    public whereHas(key:string):Array<IWhereHase> {
        return null
    }

    public store<T>(key:string, value:T, behaviour:any):void {

    }

    public read<T>(key:string, default_value:T, behaviour:any):T {
        return null
    }

    /**
     *
     * @param key
     * @param data
     */
    public storeLocalStorageString(key:string, data:string):void {
        this.local_storage.setItem(key, data);
    }

    /**
     *
     * @param key
     * @param data
     */
    public storeLocalStorageNumber(key:string, data:number):void {
        this.local_storage.setItem(key, data.toString());
    }

    /**
     *
     * @param key
     * @param data
     */
    public storeLocalStorageBoolean(key:string, data:boolean):void {
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
    public storeLocalStorageObj(key:string, data:any) {
        this.local_storage.setItem(key, JSON.stringify(data));
    }

    /**
     *
     * @param key
     * @param default_value
     * @returns {string}
     */
    public readLocalStorageString(key:string, default_value:string):string {
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
    public readLocalStorageNumber(key:string, default_value:number):number {
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
    public readLocalStorageBoolean(key:string, default_value:boolean):boolean {
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
    public readLocalStorageObj(key:string, default_value:any):any {
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
    public localStorageremove(key:string):void {
        let value = this.local_storage.getItem(key);
        if (value) {
            this.local_storage.removeItem(key);
        }
    }

    public storeFile<T>(key:string, value:T, behaviour:any):void {

    }

    public readFile<T>(key:string, default_value:T, behaviour:any):T {
        return null
    }

    public storeSecureStorage<T>(key:string, value:T, behaviour:any):void {

    }

    public readSecureStorage<T>(key:string, default_value:T, behaviour:any):T {
        return null
    }

/////////////////////////////
////////// PRIVATE //////////
/////////////////////////////

    private getStoreInstance():Promise<SecureStorageObject> {

        return new Promise<SecureStorageObject>(
            (resolve, reject) => {
                if (this.secure_storage_instance) {
                    return resolve(this.secure_storage_instance);
                }
                else {
                    this.secure_storage
                        .create(StorageService.ACCOUNT)
                        .then((storage_object:SecureStorageObject) => {
                            this.secure_storage_instance = storage_object;
                            resolve(storage_object);
                        })
                        .catch((error) => {
                            if (this.secure_storage_instance) {
                                this.secure_storage_instance.clear();
                            }
                            this.secure_storage_instance = null;
                            return reject(error);
                        })
                }
            });

    }

    // TODO: tipi dei parametri
    private secureDeviceSuccess(screenlock_value, key:string, resolve, reject):void {

        console.log("StorageService -> secureDeviceSuccess -> screenlock_value: ", screenlock_value);

        // if (screenlock_value /* TODO: verificare sto cazzo di valore! */) {
        //     this.secure_storage_instance.keys()
        //         .then((keys:Array<string>) => {
        //             if (keys.length && keys.indexOf(key) >= 0) {
        //                 return resolve(true);
        //             }
        //             else {
        //                 return resolve(false);
        //             }
        //         })
        // }
    }

    /**
     *
     * @param storage
     * @param key
     * @param resolve
     * @param reject
     */
    private getInstanceSuccess(storage:SecureStorageObject, key:string, resolve, reject):void {
        storage.secureDevice()
            .then((screenlock_value) => this.secureDeviceSuccess(screenlock_value, key, resolve, reject))
            .catch();
    }

}