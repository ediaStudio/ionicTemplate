import {Component} from '@angular/core';
import {AdMobService} from "@services/adMob-service";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: false,
})
export class TabsPage {

    bannerVisible = false;

    constructor(private adMobService: AdMobService) {
        // On vient écouter les changements de visibilité de la bannière
        this.adMobService.getBannerVisible().subscribe(bannerVisible => {
            this.bannerVisible = bannerVisible;
        });
    }

}
