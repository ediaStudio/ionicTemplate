import {Injectable} from '@angular/core';
import {getFunctions, httpsCallable} from "firebase/functions";
import {firebaseApp} from "@app/app.module";

@Injectable({
    providedIn: 'root'
})
export class OpenaiService {

    functions = getFunctions(firebaseApp);

    constructor() {
    }

    async openaiApi(input: string) {
        const callRequest = httpsCallable(this.functions, 'openai-openaiApi');
        return callRequest({query: input});
    }

    async webSearchQuery() {
        const callRequest = httpsCallable(this.functions, 'openai-webSearchQuery');
        return callRequest();
    }

    async webSearchQueryFormatted() {
        const callRequest = httpsCallable(this.functions, 'openai-webSearchQueryFormatted');
        return callRequest();
    }
}
