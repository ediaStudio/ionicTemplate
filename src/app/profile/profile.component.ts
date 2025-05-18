import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsComponent} from "@shared/components/settings/settings.component";
import {ModalController} from "@ionic/angular";
import {ModalService} from "@services/modal.service";
import {LoginComponent} from "@app/login/login.component";
import {UserService} from "@services/user.service";
import {Subject, takeUntil} from "rxjs";
import {getAuth} from "firebase/auth";

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

    private getCurrentUser() {
        this.userService.getUser().pipe(takeUntil(this.subscription)).subscribe(async data => {
            this.currentUser = data;
            this.firstName = data?.name || "John Doe";
        });
    }

}
