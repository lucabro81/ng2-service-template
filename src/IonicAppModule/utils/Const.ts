export class Const {

    public static readonly IS_DEBUG: boolean = true;

    public static readonly METHOD_GET:string = "GET";
    public static readonly METHOD_POST:string = "POST";
    public static readonly METHOD_PUT:string = "PUT";

    public static readonly PLT:any = {
        CORDOVA: "cordova",
        ANDROID: "android",
        IOS: "ios",
    };

    public static HAS_CORDOVA:boolean;
    public static HAS_ANDROID:boolean;
    public static HAS_IOS:boolean;

}