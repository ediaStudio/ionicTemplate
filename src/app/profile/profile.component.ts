import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsComponent} from "@shared/components/settings/settings.component";
import {ModalController} from "@ionic/angular";
import {ModalService} from "@services/modal.service";
import {LoginComponent} from "@app/login/login.component";
import {UserService} from "@services/user.service";
import {Subject, takeUntil} from "rxjs";
import {getAuth} from "firebase/auth";
import {Share} from "@capacitor/share";
import {APPINFO} from "@models/appInfos";
import {TranslateService} from "@ngx-translate/core";
import {Capacitor} from "@capacitor/core";
import {NativeMarket} from "@capacitor-community/native-market";
import {MiscService} from "@services/misc.service";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  environment = environment;
  firstName = "John Doe";
  currentUser?: any;
  private subscription = new Subject<void>();

  constructor(private modalController: ModalController,
              private userService: UserService,
              private miscService: MiscService,
              private translate: TranslateService,
              private modalService: ModalService) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.subscription.next();
    this.subscription.complete();
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent as any,
      backdropDismiss: false,
      // si une bannière est visible alors ajoute k-la classe modal-ads
      cssClass: this.modalService.addModalPadding ? "modal-ads" : "",
      componentProps: {}
    });
    await modal.present();
    this.modalService.openingModal();
  }

  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginComponent as any,
      // si une bannière est visible alors ajoute k-la classe modal-ads
      cssClass: this.modalService.addModalPadding ? "modal-ads" : "",
      backdropDismiss: false,
      componentProps: {}
    });
    await modal.present();
  }

  async logout() {
    await this.miscService.showLoading();
    try {
      await getAuth().signOut();
    } catch (err: any) {
      console.error(err);
      this.miscService.presentToastWithOptions(err, true);
    }
    this.miscService.dismissLoading();
  }

  async showShareOptions() {

    try {
      const res = await Share.canShare();
      const canShare = !!res?.value;

      if (!canShare) {
        return;
      }

      const subject = this.translate.instant("shareSubject");
      let message = this.translate.instant("shareMessage");
      message += ` \niOS ➡️ ${APPINFO.iosUrl}\nAndroid ➡️ ${APPINFO.url}`;

      let files: any[] = [];
      await Share.share({
        title: subject,
        text: message,
        dialogTitle: subject,
        files: files
      });
    } catch (error: any) {
      console.error(error);
      this.miscService.presentToastWithOptions(error, true);
    }
  }

  async rateUs() {
    try {
      let packageName = APPINFO.iosId;
      if (Capacitor.getPlatform() === "android") {
        packageName = APPINFO.package;
      }
      await NativeMarket.openStoreListing({
        appId: packageName,
      });
    } catch (error: any) {
      console.error(error);
      this.miscService.presentToastWithOptions(error, true);
    }
  }

  async sendEmail() {
    const userId = this.currentUser?.userId || "";
    const email = `votreEmail@email.com`;
    const subject = "Nom de votre app";
    const body = encodeURIComponent(`\n\n\n**DO NOT DELETE**
        Version: ${environment.version}
        UserId: ${userId}`);
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;


    window.location.href = mailto;
    console.log(mailto);
  }


  private getCurrentUser() {
    this.userService.getUser().pipe(takeUntil(this.subscription)).subscribe(async data => {
      this.currentUser = data;
      this.firstName = data?.name || "John Doe";
    });
  }

}
