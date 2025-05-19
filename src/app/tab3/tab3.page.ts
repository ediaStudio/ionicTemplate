import {Component} from '@angular/core';
import {OpenaiService} from "@services/openai.service";
import {MiscService} from "@services/misc.service";

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: false,
})
export class Tab3Page {

    prompt: string = "";
    responses: any[] = [];
    protected readonly queueMicrotask = queueMicrotask;

    constructor(
        private miscService: MiscService,
        private openaiService: OpenaiService
    ) {
    }

    async openaiApi() {
        if (!this.prompt) {
            return;
        }
        await this.miscService.showLoading();
        try {
            const response = await this.openaiService.openaiApi(this.prompt);
            console.log(response);
            this.prompt = "";
            const data = response?.data || [];
            this.responses = this.responses.concat(data);
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }

    async webSearchQuery() {

        await this.miscService.showLoading();
        try {
            const response = await this.openaiService.webSearchQuery();
            console.log(response);
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }
}
