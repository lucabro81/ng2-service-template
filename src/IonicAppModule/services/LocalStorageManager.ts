export enum TypeToStore {
    STRING = 0,
    NUMBER = 1,
    BOOLEAN = 2,
    OBJECT = 3,
}

export class LocalStorageManager {

    private storage:any; // contiene il service opportuno
    private key:string;
    private value:any;
    private type:TypeToStore;

    /**
     *
     * @param localstorage
     */
    constructor(public localstorage:Storage) {}

    /**
     *
     * @param key
     * @returns {LocalStorageManager}
     */
    public storeToLocalWithKey(key:string):LocalStorageManager {
        this.storage = localStorage;
        this.key = key;
        return this;
    }

    /**
     *
     * @param value
     * @returns {LocalStorageManager}
     */
    public andValue(value:any):LocalStorageManager {
        this.value = value;
        return this;
    }

    /**
     *
     * @param type
     */
    public asType(type:TypeToStore):LocalStorageManager {
        this.type = type;
        return this;
    }

    /**
     *
     */
    public save():any|Promise<any> {
        switch (this.type) {
            case TypeToStore.STRING:

                break;
            case TypeToStore.NUMBER:

                break;
            case TypeToStore.BOOLEAN:

                break;
            case TypeToStore.OBJECT:
            default:

                break;
        }
    }

}