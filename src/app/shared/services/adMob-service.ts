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

@Injectable({
    providedIn: 'root'
})
export class AdMobService {

    // TODO false in prod
    isTesting = false;

    // TODO change to your banner ID for android
    bannerId = "ca-app-pub-5672455571394042/7608904697";
    // TODO change to your interstitial ID for android
    interstitialId = "ca-app-pub-5672455571394042/8659096637";
    // TODO change to your rewarded ad ID for android
    rewardId = "ca-app-pub-5672455571394042/9110259444";

    private interstitialReady = false;
    private bannerVisible = false;
    private timeout = 60000;
    private rewardReady = new BehaviorSubject<boolean>(false);
    private bannerVisible_ = new BehaviorSubject<boolean>(false);

    constructor(
        public platform: Platform) {

        console.log('AdMobProvider constructor');
        if (Capacitor.getPlatform() !== "web") {
            this.init();
        }
    }

    async showBanner() {
        // Skip if banner is already visible or if running on web
        if (this.bannerVisible || Capacitor.getPlatform() === "web") {
            return;
        }

        const options: BannerAdOptions = {
            adId: this.bannerId,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.TOP_CENTER,
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

    async removeBanner() {
        try {
            await AdMob.removeBanner();
            this.setBannerVisible(false);
        } catch (e: any) {
            console.error(e);
        }
    }

    async hideBanner() {
        try {
            await AdMob.hideBanner();
            this.setBannerVisible(false);
        } catch (e: any) {
            console.error(e);
        }
    }

    async resumeBanner() {
        try {
            await AdMob.resumeBanner();
            this.setBannerVisible(true);
        } catch (e: any) {
            console.error(e);
        }
    }

    async showInterstitial() {
        if (!this.interstitialReady) {
            return;
        }
        try {
            await AdMob.showInterstitial();
        } catch (e: any) {
            console.error(e);
        }
    }

    async showRewardVideoAd() {
        try {
            const rewardItem = await AdMob.showRewardVideoAd();
            console.log(rewardItem);
        } catch (e: any) {
            console.error('rewardVideoAd', e);
        }
    }

    getRewardReady() {
        return this.rewardReady.asObservable();
    }

    setRewardReady(rewardReady: boolean) {
        this.rewardReady.next(rewardReady);
    }

    getBannerVisible() {
        return this.bannerVisible_.asObservable();
    }

    setBannerVisible(visible: boolean) {
        if (Capacitor.getPlatform() === "web") {
            visible = false;
        }
        this.bannerVisible = visible;
        this.bannerVisible_.next(visible);
    }

    private init() {

        this.platform.ready().then(async () => {

            try {
                await this.initializeAdmob();

                if (Capacitor.getPlatform() === "ios") {
                    // TODO change to your banner ID for ios
                    this.bannerId = "ca-app-pub-5672455571394042/4719851628";
                    // TODO change to your interstitial ID for ios
                    this.interstitialId = "ca-app-pub-5672455571394042/3309900750";
                    // TODO change to your rewarded ads ID for ios
                    this.rewardId = "ca-app-pub-5672455571394042/4707980008";
                }


                if (this.isTesting) {
                    // DO NOT CHANGE
                    // PROVIDED BY GOOGLE FOR TESTING
                    // https://developers.google.com/admob/android/test-ads
                    this.bannerId = 'ca-app-pub-3940256099942544/6300978111';
                    this.interstitialId = 'ca-app-pub-3940256099942544/1033173712';
                    this.rewardId = 'ca-app-pub-3940256099942544/5224354917';
                }

                this.initListeners();

                //Prepare Ad to Show
                this.prepareInterstitial();
                //
                //Prepare Ad to Show
                this.prepareReward();
            } catch (e: any) {
                console.error(e);
            }
        });
    }

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

    private async initializeAdmob(): Promise<void> {
        await AdMob.initialize();

        setTimeout(async () => {
            const [trackingInfo, consentInfo] = await Promise.all([
                AdMob.trackingAuthorizationStatus(),
                AdMob.requestConsentInfo(),
            ]);

            if (trackingInfo.status === 'notDetermined') {
                /**
                 * If you want to explain TrackingAuthorization before showing the iOS dialog,
                 * you can show the modal here.
                 * ex)
                 * const modal = await this.modalCtrl.create({
                 *   component: RequestTrackingPage,
                 * });
                 * await modal.present();
                 * await modal.onDidDismiss();  // Wait for close modal
                 **/

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
        }, 3000)
    }

    private initListeners() {

        // INTERSTITIAL
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
            console.log(info);
        });

        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            // Si l'utilisateur ferme l'interstitiel, on le prépare à nouveau
            this.prepareInterstitial();
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error: AdMobError) => {
            console.error(error);
            setTimeout(() => {
                // Si l'interstitiel échoue à charger, on le prépare à nouveau après un délai
                this.prepareInterstitial();
            }, this.timeout);
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error: AdMobError) => {
            console.error(error);
            setTimeout(() => {
                // si l'interstitiel échoue à s'afficher, on le prépare à nouveau après un délai
                this.prepareInterstitial();
            }, this.timeout);
        });

        // REWARDS
        AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
            // Subscribe prepared rewardVideo
            console.log(info);
            this.setRewardReady(true);
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            this.setRewardReady(false);
            // Dès que le reward est fermé, on le prépare à nouveau
            this.prepareReward();
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: AdMobError) => {
            console.error('RewardAdPluginEvents.FailedToLoad', error);
            this.setRewardReady(false);
            setTimeout(() => {
                // Si le reward échoue à charger, on le prépare à nouveau après un délai
                this.prepareReward();
            }, this.timeout);
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: AdMobError) => {
            console.log(error);
            this.setRewardReady(false);
            setTimeout(() => {
                // si le reward échoue à s'afficher, on le prépare à nouveau après un délai
                this.prepareReward();
            }, this.timeout);
        });

        AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
            // Give reward to user here
            console.log('RewardAdPluginEvents.Rewarded', rewardItem);
        });
    }

}
