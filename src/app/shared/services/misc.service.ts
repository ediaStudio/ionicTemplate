import {Injectable} from '@angular/core';
import {AlertController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {ELang, LANGUAGES} from "@models/language";

@Injectable({
    providedIn: 'root'
})
export class MiscService {

    constructor(private alertController: AlertController,
                private translate: TranslateService) {
    }

    async presentAlertLanguage(): Promise<ELang> {
        //@ts-ignore
        return new Promise(async (resolve, reject) => {

            const alert = await this.alertController.create({
                backdropDismiss: false,
                header: 'Languages',
                subHeader: 'Select a language',
                htmlAttributes: {
                    'aria-label': "Select language",
                    'role': 'alert'
                },
                inputs: LANGUAGES as any,
                buttons: [{
                    text: 'Cancel',
                    role: "cancel",
                    htmlAttributes: {
                        'aria-label': this.translate.instant("declineAction")
                    },
                    handler: () => {
                        reject();
                    }
                }, {
                    text: 'Select',
                    htmlAttributes: {
                        'aria-label': this.translate.instant("confirmAction")
                    },
                    handler: (data) => {
                        resolve(data);
                    }
                }]
            });

            alert.present();
        })
    }

}
