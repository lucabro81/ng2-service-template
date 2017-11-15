import {Injectable} from "@angular/core";
import {SecureStorage, SecureStorageObject} from '@ionic-native/secure-storage';
import {File} from '@ionic-native/file';

export enum StorageType {
    LOCALSTORAGE = 0,
    FILESTORAGE = 1,
    SECURESTORAGE = 2,
}

@Injectable()
export class StorageService {

    private local_storage:Storage;
    private secure_storage:SecureStorage;
    private file_storage:File;
    private secure_storage_account:SecureStorage;
    private secure_storage_instance:SecureStorageObject;

    private static ACCOUNT:string = "APP_SECURE_STORAGE_ACCOUNT";

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

        let promise:Promise<boolean> = new Promise<boolean>((resolve, reject) => {

            // check in localStorage
            let value = this.local_storage.getItem(key);
            if (value) {
                return resolve(true);
            }

            var secureDeviceSuccess = (screenlock_value) => {
                if (screenlock_value /* TODO: verificare sto cazzo di valore!*/) {

                }
            };

            var getInstanceSuccess = (storage:SecureStorageObject) => {

                storage.secureDevice()
                    .then(secureDeviceSuccess)
                    .catch();

                storage.keys()
                    .then((keys:Array<string>) => {
                        if (keys.length && keys.indexOf(key) >= 0) {
                            resolve(true);
                        }
                        else {}
                    })
            };

            this.getStoreInstance()
                .then(getInstanceSuccess)
                .catch()
        });

    }

    public where(key:string):StorageType {
        return null
    }

    public whereHas(key:string):{has:boolean, where:StorageType} {
        return null
    }

    public store<T>(key:string, value:T, behaviour:any):void {

    }

    public read<T>(key:string, default_value:T, behaviour:any):T {
        return null
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
                            this.secure_storage_instance.clear();
                            this.secure_storage_instance = null;
                            return reject(error);
                        })
                }
            });

    }

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