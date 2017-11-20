import {Injectable} from "@angular/core";
import {AbsMainService} from "../../IonicAppModule/services/Abs/AbsMainService";
import {Platform} from "ionic-angular";

@Injectable()
export class MainService extends AbsMainService {

    constructor(public plt:Platform) {
        super(plt);
    }
}