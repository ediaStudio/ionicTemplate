import {Component, OnInit} from '@angular/core';
import {SettingsComponent} from "@shared/components/settings/settings.component";
import {ModalController} from "@ionic/angular";
import {ModalService} from "@services/modal.service";

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    firstName = "John Doe";

    constructor(private modalController: ModalController,
                private modalService: ModalService) {
    }

    ngOnInit() {
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

}
