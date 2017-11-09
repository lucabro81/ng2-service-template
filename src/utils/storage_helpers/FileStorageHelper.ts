import { File } from '@ionic-native/file';

export class FileStorageHelper {

    private static instance: FileStorageHelper;

    private file_provider: File;

    private constructor() {
        if (FileStorageHelper.instance) {
            throw new Error("Istanza di FileStorageHelper già presente");
        }
        this.file_provider = new File();
    }

    public static getInstance(): FileStorageHelper {
        if (!FileStorageHelper.instance) {
            FileStorageHelper.instance = new FileStorageHelper;
            return FileStorageHelper.instance;
        }
        return FileStorageHelper.instance;
    }
}