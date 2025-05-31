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
import {UserService} from "@services/user.service";
import {environment} from "@environments/environment";
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";
import {doc, getFirestore, onSnapshot, Unsubscribe} from "firebase/firestore";
import {MiscService} from "@services/misc.service";

// C'est ce qui permet d'initializer le swiper qui est utilisé dans le onboarding
register();

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false,
})
export class AppComponent {

    userSnapshotListener!: Unsubscribe;

    constructor(
        private platform: Platform,
        private userService: UserService,
        private miscService: MiscService,
        private modalController: ModalController,
        private translate: TranslateService,
        private modalService: ModalService) {
        this.initializeApp();
    }

    private async initializeDarkPalette() {
        try {
            let {value} = await Preferences.get({key: darkStorage});
            console.log(value);
            document.documentElement.classList.toggle('ion-palette-dark', !!value);
        } catch (e: any) {
            console.error(e);
        }
    }

    private async setUserCall(payload?: any) {
        await this.miscService.showLoading();
        try {
            await this.userService.setUserCall(payload);
            const uid = getAuth()?.currentUser?.uid;
            this.getUserLive(uid);
        } catch (e: any) {
            console.error(e);
            this.miscService.presentToastWithOptions(e, true);
        }
        this.miscService.dismissLoading();
    }

    private initializeApp() {
        this.platform.ready().then(async () => {
            const currentURL = window.location.href;
            const isLocalhost = currentURL?.includes('localhost') && !environment.production;
            if (isLocalhost) {
                connectFunctionsEmulator(getFunctions(firebaseApp), "localhost", 5001);
            }
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
                    // si une bannière est visible alors ajoute k-la classe modal-ads
                    cssClass: this.modalService.addModalPadding ? "modal-ads" : "",
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
                    this.setUserCall()
                } else {
                    // L'utilisateur n'est pas connecté
                    this.userService.setUser(undefined);
                }
            } catch (error) {
                console.error("Error in onAuthStateChanged:", error);
            }
        });
    }

    private async getUserLive(id?: string) {
        // Si le listener existe déjà, on le supprime
        if (this.userSnapshotListener) {
            await this.userSnapshotListener();
        }
        if (!id) {
            return;
        }
        console.log(id);
        const db = getFirestore(firebaseApp);
        // https://firebase.google.com/docs/firestore/query-data/listen
        const referralQuery = doc(db,
            "users", id);

        this.userSnapshotListener = onSnapshot(referralQuery, async (d) => {
                console.log(d);
                let user;
                if (d?.exists()) {
                    user = d.data();
                    console.log(user);
                }
                this.userService.setUser(user);
            },
            (error: any) => {
                console.error(error);
            }
        )
    }


}
