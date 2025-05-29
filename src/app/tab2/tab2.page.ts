import {Component} from '@angular/core';
import {AdMobService} from "@services/adMob-service";

// Déclare le composant Angular pour la page "Tab2"
@Component({
    selector: 'app-tab2', // Sélecteur du composant
    templateUrl: 'tab2.page.html', // Fichier HTML associé
    styleUrls: ['tab2.page.scss'], // Fichier CSS associé
    standalone: false, // Ce composant n'est pas autonome
})
export class Tab2Page {

    // Indique si la pub récompensée est prête à être affichée
    rewardReady = false;

    // Indique si la bannière est visible
    bannerVisible = false;

    constructor(
        private adMobService: AdMobService // Injection du service AdMob
    ) {
        // Abonnement à l'état de visibilité de la bannière
        this.adMobService.getBannerVisible()
            .subscribe(bannerVisible => {
                this.bannerVisible = !!bannerVisible; // Mise à jour de l'état local
            });

        // Abonnement à l'état de disponibilité de la pub récompensée
        this.adMobService.getRewardReady().subscribe(rewardReady => {
            this.rewardReady = rewardReady; // Mise à jour de l'état local
        });
    }

    // Affiche une bannière publicitaire
    displayBanner() {
        this.adMobService.showBanner();
    }

    // Supprime la bannière publicitaire
    removeBanner() {
        this.adMobService.removeBanner();
    }

    // Affiche une publicité interstitielle
    displayInterstitial() {
        this.adMobService.showInterstitial();
    }

    // Affiche une vidéo publicitaire récompensée
    async watchRewards() {
        try {
            await this.adMobService.showRewardVideoAd(); // Attente de la fin de la vidéo
        } catch (e: any) {
            // Si l'utilisateur annule ou ferme la vidéo
            console.log('user press cancel');
        }
    }

}
