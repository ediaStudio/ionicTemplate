import {Component} from '@angular/core';
import {Platform} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {Preferences} from "@capacitor/preferences";
import {ELang, langStorage} from "../../functions/src/models/language";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false,
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private translate: TranslateService) {
        this.initializeApp();
    }

    private initializeApp() {
        this.platform.ready().then(async () => {
            await this.initTranslation();
        });
    }

    private async initTranslation() {
        try {
            // this language will be used as a fallback when a translation isn't found in the current language
            this.translate.setDefaultLang(ELang.en);
            let lang = this.translate.getBrowserLang() || ELang.en;
            let {value} = await Preferences.get({key: langStorage});
            if (value) {
                lang = value as ELang;
            }
            // the lang to use, if the lang isn't available, it will use the current loader to get them
            this.translate.use(lang);
        } catch (e: any) {
            console.error(e);
        }
    }

}
