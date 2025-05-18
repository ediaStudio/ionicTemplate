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

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

    firstName = "John Doe";
    currentUser?: any;
    private subscription = new Subject<void>();

    constructor(private modalController: ModalController,
                private userService: UserService,
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
            cssClass: "",
            componentProps: {}
        });
        await modal.present();
        this.modalService.openingModal();
    }

    async openLoginModal() {
        const modal = await this.modalController.create({
            component: LoginComponent as any,
            cssClass: '',
            backdropDismiss: false,
            componentProps: {}
        });
        await modal.present();
    }

    async logout() {
        try {
            await getAuth().signOut();
        } catch (err) {
            console.error(err);
        }
    }

    async showShareOptions() {

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
    }

    private getCurrentUser() {
        this.userService.getUser().pipe(takeUntil(this.subscription)).subscribe(async data => {
            this.currentUser = data;
            this.firstName = data?.name || "John Doe";
        });
    }

}
