import { File } from '@ionic-native/file';

export class Helper {

    private static instance:Helper;

    private file_provider:File;

    private constructor() {
        this.file_provider = new File();
    }

    public static getInstance():Helper {
        if (!Helper.instance) {
            Helper.instance = new Helper;
            return Helper.instance;
        }
        return Helper.instance;
    }

    public store<T>(key:string, value:T, behaviour:any):void {

    }

    public read<T>(key:string, default_value:T, behaviour:any):T {

    }

    public readFile<T>(key:string, default_value:T, behaviour:any):T {

    }

    public storeFile<T>(key:string, value:T, behaviour:any):void {

    }

    public readFile<T>(key:string, default_value:T, behaviour:any):T {

    }

    public storeSecureStorage<T>(key:string, value:T, behaviour:any):void {

    }

    public readSecureStorage<T>(key:string, default_value:T, behaviour:any):T {

    }
}