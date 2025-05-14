import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ELang, langStorage, LANGUAGES} from "@models/language";
import {MiscService} from "@services/misc.service";
import {Preferences} from "@capacitor/preferences";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-settings',
    standalone: false,
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

    currentLang: ELang = ELang.en;

    constructor(
        private modalController: ModalController,
        private translate: TranslateService,
        private miscService: MiscService,
    ) {
    }

    async ngOnInit() {
        this.currentLang = this.translate.currentLang as ELang || ELang.en;
    }

    close(event?: any) {
        event?.stopPropagation();
        this.modalController.dismiss();
    }

    getLangLabel(): string {
        let label = LANGUAGES.find(l => l.value === this.currentLang)?.label;
        return label || this.currentLang;
    }

    async openLanguage() {

        try {
            const languageCode = await this.miscService.presentAlertLanguage();

            if (!languageCode) {
                return;
            }
            console.log(languageCode);
            try {
                this.translate.use(languageCode);
                await Preferences.set({
                    key: langStorage,
                    value: languageCode,
                });
            } catch (e: any) {
                console.error(e);
            }

        } catch (e: any) {
            console.error(e);
        }
    }

}

