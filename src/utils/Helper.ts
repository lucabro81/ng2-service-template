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

}