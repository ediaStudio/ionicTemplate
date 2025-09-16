import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {
  AdLoadInfo,
  AdMob,
  AdmobConsentStatus,
  AdMobRewardItem,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  InterstitialAdPluginEvents,
  RewardAdOptions,
  RewardAdPluginEvents
} from "@capacitor-community/admob";
import {AdMobError} from "@capacitor-community/admob/dist/esm/shared";
import {Capacitor} from "@capacitor/core";
import {ModalService} from "@services/modal.service";

// DO NOT CHANGE
// PROVIDED BY GOOGLE FOR TESTING
// https://developers.google.com/admob/android/test-ads
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  reward: 'ca-app-pub-3940256099942544/5224354917',
};

// IDs utilisés en production pour Android et iOS
// https://admob.google.com/home/
// TODO remplacez par vos Ids de pub AdMob
const PROD_IDS = {
  android: {
    banner: 'ca-app-pub-5672455571394042/7432990582',
    interstitial: 'ca-app-pub-5672455571394042/5920883777',
    reward: 'ca-app-pub-5672455571394042/6438638967'
  },
  ios: {
    banner: 'ca-app-pub-5672455571394042/8327269852',
    interstitial: 'ca-app-pub-5672455571394042/5701106517',
    reward: 'ca-app-pub-5672455571394042/9297856158',
  }
};

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  // Activer le mode test (désactiver en prod)
  isTesting = true;

  bannerId = "";
  interstitialId = "";
  rewardId = "";

  private bannerVisible = false; // pour suivre si la bannière est affichée
  private timeout = 60000; // délai en ms pour recharger une pub après échec
  private rewardReady = new BehaviorSubject<boolean>(false); // état des rewards (prêtes ou non)
  private bannerVisible_ = new BehaviorSubject<boolean>(false); // pour les composants Angular

  constructor(public platform: Platform,
              private modalService: ModalService) {
    console.log('AdMobProvider constructor');
    if (Capacitor.getPlatform() !== "web") {
      this.init(); // initialisation seulement sur plateforme native
    }
  }

  // Affiche une bannière pub si non déjà visible
  async showBanner() {
    const options: BannerAdOptions = {
      adId: this.bannerId,
      adSize: BannerAdSize.BANNER, // Par défault la bannière fera 50px de haut
      position: BannerAdPosition.TOP_CENTER, // On choisit d'afficher la bannière en haut de l'écran
      margin: 0,
      isTesting: this.isTesting
    };

    try {
      await AdMob.showBanner(options);
      this.setBannerVisible(true);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Supprime complètement la bannière
  async removeBanner() {
    try {
      await AdMob.removeBanner();
      this.setBannerVisible(false);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Cache la bannière (sans la détruire)
  async hideBanner() {
    try {
      await AdMob.hideBanner();
      this.setBannerVisible(false);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Ré-affiche une bannière déjà cachée
  async resumeBanner() {
    try {
      await AdMob.resumeBanner();
      this.setBannerVisible(true);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Affiche une pub interstitielle déjà préparée
  async showInterstitial() {
    try {
      await AdMob.showInterstitial();
    } catch (e: any) {
      console.error(e);
    }
  }

  // Affiche une pub reward vidéo déjà préparée
  async showRewardVideoAd() {
    try {
      const rewardItem = await AdMob.showRewardVideoAd();
      console.log(rewardItem); // log la récompense donnée à l'utilisateur
    } catch (e: any) {
      console.error('rewardVideoAd', e);
    }
  }

  // Observable pour suivre si la pub reward est prête
  getRewardReady() {
    return this.rewardReady.asObservable();
  }

  // Définir l'état "ready" de la pub reward
  setRewardReady(rewardReady: boolean) {
    this.rewardReady.next(rewardReady);
  }

  // Observable pour suivre si une bannière est affichée
  getBannerVisible() {
    return this.bannerVisible_.asObservable();
  }

  // Met à jour l’état interne de la bannière (affichée ou non)
  setBannerVisible(visible: boolean) {
    this.bannerVisible = visible;
    this.modalService.addModalPadding = visible; // on set addModalPadding à true ou false selon que la bannière soit visible
    this.bannerVisible_.next(visible);
  }

  // Initialisation complète des pubs (selon la plateforme)
  private init() {
    this.platform.ready().then(async () => {
      try {
        await this.initializeAdmob();

        const platform = Capacitor.getPlatform();
        const ids = this.isTesting
          ? TEST_IDS
          : platform === "ios"
            ? PROD_IDS.ios
            : PROD_IDS.android;

        this.bannerId = ids.banner;
        this.interstitialId = ids.interstitial;
        this.rewardId = ids.reward;

        this.initListeners(); // Ajout des écouteurs d’événements AdMob

        // Préparer les pubs
        this.prepareInterstitial();
        this.prepareReward();
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  // Préparer une pub interstitielle à l’avance
  private async prepareInterstitial() {
    const options: AdOptions = {
      adId: this.interstitialId,
      isTesting: this.isTesting
    };
    try {
      await AdMob.prepareInterstitial(options);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Préparer une pub reward à l’avance
  private async prepareReward() {
    const options: RewardAdOptions = {
      adId: this.rewardId,
      isTesting: this.isTesting
    };
    try {
      await AdMob.prepareRewardVideoAd(options);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Initialisation de base d’AdMob + tracking + consentement
  private async initializeAdmob(): Promise<void> {
    await AdMob.initialize();

    setTimeout(async () => {
      const [trackingInfo, consentInfo] = await Promise.all([
        AdMob.trackingAuthorizationStatus(),
        AdMob.requestConsentInfo(),
      ]);

      if (trackingInfo.status === 'notDetermined') {
        // Ici tu peux afficher un modal personnalisé avant le dialogue iOS
        await AdMob.requestTrackingAuthorization();
      }

      const authorizationStatus = await AdMob.trackingAuthorizationStatus();
      if (
        authorizationStatus.status === 'authorized' &&
        consentInfo?.isConsentFormAvailable &&
        consentInfo?.status === AdmobConsentStatus.REQUIRED
      ) {
        await AdMob.showConsentForm();
      }
    }, 3000);
  }

  // Ajoute tous les listeners nécessaires aux pubs
  private initListeners() {
    // INTERSTITIEL
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log(info);
    });

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      this.prepareInterstitial(); // Re-prépare l’interstitiel quand il est fermé
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error: AdMobError) => {
      console.error(error);
      setTimeout(() => this.prepareInterstitial(), this.timeout); // Retry après délai
    });

    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error: AdMobError) => {
      console.error(error);
      setTimeout(() => this.prepareInterstitial(), this.timeout);
    });

    // REWARD
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log(info);
      this.setRewardReady(true); // Reward prête
    });

    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      this.setRewardReady(false);
      this.prepareReward(); // Re-prépare dès que c’est fermé
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
      console.error('RewardAdPluginEvents.FailedToLoad', error);
      this.setRewardReady(false);
      setTimeout(() => this.prepareReward(), this.timeout);
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: AdMobError) => {
      console.error(error);
      this.setRewardReady(false);
      setTimeout(() => this.prepareReward(), this.timeout);
    });

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
      console.log('RewardAdPluginEvents.Rewarded', rewardItem); // Donne la récompense ici
    });
  }
}
