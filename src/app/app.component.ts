import {Component} from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import {Preferences} from "@capacitor/preferences";
import {ELang, langStorage} from "../../functions/src/models/language";
import {ModalService} from "./shared/services/modal.service";
import {Capacitor} from "@capacitor/core";
import {TranslateService} from "@ngx-translate/core";
import {darkStorage, onboardingStorage} from "@models/general";
import {OnboardingComponent} from "@app/onboarding/onboarding.component";
import {register} from 'swiper/element/bundle';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {firebaseApp} from "@app/app.module";

register();

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false,
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private modalController: ModalController,
        private translate: TranslateService,
        private modalService: ModalService) {
        this.initializeApp();
    }

    async initializeDarkPalette() {
        try {
            let {value} = await Preferences.get({key: darkStorage});
            console.log(value);
            document.documentElement.classList.toggle('ion-palette-dark', !!value);
        } catch (e: any) {
            console.error(e);
        }
    }

    private initializeApp() {
        this.platform.ready().then(async () => {
            await this.initTranslation();
            this.initializeDarkPalette();
            this.presentOnboarding();
            this.pressBackButton();
            this.initializeFirebase();
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

    // small fix to allow user to close a modal by clicking on return button on android device
    private pressBackButton() {
        if (Capacitor.getPlatform() === "android") {
            this.platform.backButton.subscribeWithPriority(10, async () => {
                const modal = await this.modalController.getTop();
                if (modal) {
                    modal.dismiss();
                }
            });
        } else if (Capacitor.getPlatform() === "web") {
            window.history.pushState({}, '');
            this.modalService.getModalState().subscribe(isOpen => {
                if (isOpen) {
                    window.history.pushState({}, '');
                }
            });
            // Event listener for popstate
            window.addEventListener('popstate', async (event) => {
                const modal = await this.modalController.getTop();
                if (modal) {
                    modal.dismiss();
                }
            });
        }
    }

    private async presentOnboarding() {
        try {
            const {value} = await Preferences.get({key: onboardingStorage});

            if (!value) {
                const modal = await this.modalController.create({
                    component: OnboardingComponent as any,
                    cssClass: '',
                    backdropDismiss: false,
                    componentProps: {}
                });
                await modal.present();

                modal.onWillDismiss().then(async (res) => {
                    await Preferences.set({
                        key: onboardingStorage,
                        value: "true",
                    });
                })
            }
        } catch (e: any) {
            console.error(e);
        }
    }

    private async initializeFirebase() {
        console.log("initializeFirebase")
        const auth = getAuth(firebaseApp);
        console.log("auth", auth);

        onAuthStateChanged(auth, async user => {
            try {
                console.log("onAuthStateChanged", user);
                if (user?.uid) {
                    // Ca signifie que l'utilisateur est connecté
                }
            } catch (error) {
                console.error("Error in onAuthStateChanged:", error);
            }
        });
    }


}
