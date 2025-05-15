import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {getAuth, GoogleAuthProvider, indexedDBLocalPersistence, setPersistence, signInWithPopup} from "firebase/auth";

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(
        private modalController: ModalController) {
    }

    ngOnInit() {
    }

    close() {
        this.modalController.dismiss();
    }

    async connectWithProvider() {
        let provider = new GoogleAuthProvider();

        provider.setCustomParameters({prompt: 'select_account'});

        await this.setLocalPersistence();

        const auth = getAuth();
        try {
            // https://firebase.google.com/docs/auth/web/google-signin
            const result = await signInWithPopup(auth, provider);
            // const result = await signInWithPopup(this.auth, provider);
            let credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential);
            this.close();
            // const token = credential?.accessToken;
            // // The signed-in user info.
            // console.log(credential);
        } catch (error: any) {
            console.error(error);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            // const email = error.customData.email;
            let credential = GoogleAuthProvider.credentialFromError(error);
            console.error(credential);
        }
    }

    // https://firebase.google.com/docs/auth/web/auth-state-persistence
    private async setLocalPersistence() {
        const auth = getAuth();
        try {
            await setPersistence(auth, indexedDBLocalPersistence);
        } catch (e) {
            console.error(e);
        }
    }

}
