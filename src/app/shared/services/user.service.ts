import {Injectable} from '@angular/core';
import {getFunctions, httpsCallable} from "firebase/functions";
import {firebaseApp} from "@app/app.module";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    functions = getFunctions(firebaseApp);

    constructor() {
    }

    async setUserCall(payload: any) {
        const callRequest = httpsCallable(this.functions, 'users-setUserApi');
        return callRequest(payload);
    }
}
