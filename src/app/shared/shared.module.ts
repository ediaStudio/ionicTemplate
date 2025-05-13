import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SettingsComponent} from "./components/settings/settings.component";


@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule,
        SettingsComponent
    ],
})
export class SharedModule {
}
