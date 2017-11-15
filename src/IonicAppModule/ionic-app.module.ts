import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";

import {File} from '@ionic-native/file';
import {SecureStorage} from '@ionic-native/secure-storage';
import {StorageService} from "./services/StorageService";

@NgModule({
    declarations: [
    ],
    imports: [
        HttpModule
    ],
    providers: [
        File,
        SecureStorage,

        StorageService
    ]
})
export class IonicAppModule {}