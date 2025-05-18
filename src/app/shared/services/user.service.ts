import {Injectable} from '@angular/core';
import {getFunctions, httpsCallable} from "firebase/functions";
import {firebaseApp} from "@app/app.module";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    functions = getFunctions(firebaseApp);
    private user = new BehaviorSubject<any>(undefined);

    constructor() {
    }

    getUser() {
        return this.user.asObservable();
    }

    setUser(user?: any) {
        this.user.next(user);
    }

    async setUserCall(payload: any) {
        const callRequest = httpsCallable(this.functions, 'users-setUserApi');
        return callRequest(payload);
    }
}
