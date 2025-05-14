import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ELang, langStorage, LANGUAGES} from "@models/language";
import {MiscService} from "@services/misc.service";
import {Preferences} from "@capacitor/preferences";
import {TranslateService} from "@ngx-translate/core";
import {darkStorage} from "@models/general";

@Component({
    selector: 'app-settings',
    standalone: false,
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

    currentLang: ELang = ELang.en;
    paletteToggle = false;

    constructor(
        private modalController: ModalController,
        private translate: TranslateService,
        private miscService: MiscService,
    ) {
    }

    async ngOnInit() {
        this.initializeDarkPalette();
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

    async initializeDarkPalette() {
        try {
            let {value} = await Preferences.get({key: darkStorage});
            console.log(value);
            this.paletteToggle = !!value;
        } catch (e: any) {
            console.error(e);
        }
    }

    // Listen for the toggle check/uncheck to toggle the dark palette
    async toggleChange(event: CustomEvent) {
        const isDark = !!event?.detail?.checked;
        document.documentElement.classList.toggle('ion-palette-dark', isDark);
        if (isDark) {
            await Preferences.set({
                key: darkStorage,
                value: "true",
            });
        } else {
            await Preferences.remove({
                key: darkStorage,
            });
        }
    }


}

