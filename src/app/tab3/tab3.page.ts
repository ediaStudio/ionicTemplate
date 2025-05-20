import {Component} from '@angular/core';
import {OpenaiService} from "@services/openai.service";
import {MiscService} from "@services/misc.service";
import {IMatch} from "@models/football";

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: false,
})
export class Tab3Page {

    prompt: string = "";
    responses: any[] = [];
    notFormattedGames = "";
    lastGames: IMatch[] = [];

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
            const data = response?.data || "";
            this.responses.push(data);
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }

    async webSearchQuery() {

        await this.miscService.showLoading();
        try {
            // ne pas oublier le as any à la fin sinon le lint ne va pas passer
            const response = await this.openaiService.webSearchQuery() as any;
            console.log(response);
            this.notFormattedGames = response?.data || "";
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }

    async webSearchQueryFormatted() {

        await this.miscService.showLoading();
        try {
            // ne pas oublier le as any à la fin sinon le lint ne va pas passer
            const response = await this.openaiService.webSearchQueryFormatted() as any;
            console.log(response);
            this.lastGames = response?.data?.games || [];
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }
}
