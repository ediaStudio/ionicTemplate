import {Injectable} from '@angular/core';
import {getFunctions, httpsCallable} from "firebase/functions";
import {firebaseApp} from "@app/app.module";

@Injectable({
    providedIn: 'root'
})
export class FootballService {

    functions = getFunctions(firebaseApp);

    constructor() {
    }

    async getMatchApi() {
        const callRequest = httpsCallable(this.functions, 'football-getMatchApi');
        return callRequest({});
    }

}
