import { SecureStorage } from '@ionic-native/secure-storage';

export class SecureStorageHelper {

    private static instance: SecureStorageHelper;

    private secure_storage_provider: SecureStorage;

    private constructor() {
        if (SecureStorageHelper.instance) {
            throw new Error("Istanza di SecureStorageHelper già presente");
        }
        this.secure_storage_provider = new SecureStorage();
    }

    public static getInstance(): SecureStorageHelper {
        if (!SecureStorageHelper.instance) {
            SecureStorageHelper.instance = new SecureStorageHelper;
            return SecureStorageHelper.instance;
        }
        return SecureStorageHelper.instance;
    }
}