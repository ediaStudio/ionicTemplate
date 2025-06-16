import {Component, OnInit} from '@angular/core';
import {FootballService} from "@services/football.service";
import {MiscService} from "@services/misc.service";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    standalone: false,
})
export class Tab1Page implements OnInit {

    lastGame: any;

    constructor(
        private footballService: FootballService,
        private miscService: MiscService
    ) {
    }

    ngOnInit() {
        this.getMatchApi();
    }

    async getMatchApi() {

        await this.miscService.showLoading();
        try {
            // ne pas oublier le as any à la fin sinon le lint ne va pas passer
            const response = await this.footballService.getMatchApi() as any;
            console.log(response);
            this.lastGame = response?.data?.games || [];
        } catch (e: any) {
            console.error(e);
            this.miscService.displayError(e);
        }
        this.miscService.dismissLoading();
    }

}
