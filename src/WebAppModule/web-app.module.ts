import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {StorageService} from "./services/StorageService";

@NgModule({
    declarations: [
    ],
    imports: [
        HttpModule
    ],
    providers: [
        StorageService
    ]
})
export class WebAppModule {}