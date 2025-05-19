import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {ELang, LANGUAGES} from "@models/language";

@Injectable({
    providedIn: 'root'
})
export class MiscService {

    loading: any;
    toast: any;

    constructor(private loadingCtrl: LoadingController,
                private alertController: AlertController,
                private toastController: ToastController,
                private translate: TranslateService) {
    }

    async showLoading(message: string = 'pleaseWait') {
        this.dismissLoading();
        this.loading = await this.loadingCtrl.create({
            spinner: "bubbles",
            duration: 30000,
            mode: "ios",
            message: this.translate.instant(message),
            translucent: false,
            showBackdrop: true,
            cssClass: ""
        });
        return await this.loading.present();
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
        }
    }

    async presentToastWithOptions(header: any, isError = false) {
        if (this.toast) {
            this.toast.dismiss();
        }
        header = header?.message || header;
        header = header ? header : isError ? 'error' : 'unknown';
        this.toast = await this.toastController.create({
            header: this.translate.instant(header),
            message: "",
            position: "middle",
            animated: true,
            mode: "ios",
            cssClass: "",
            color: isError ? "danger" : "primary",
            duration: 1800,
            keyboardClose: false,
            translucent: false
        });
        this.toast.present();
    }

    displayError(error?: any) {
        const message = error?.message || JSON.stringify(error) || 'error';
        if (!error) {
            return;
        }
        this.presentToastWithOptions(message, true);
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
