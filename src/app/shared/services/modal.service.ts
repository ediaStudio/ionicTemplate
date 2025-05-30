import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    addModalPadding = false;
    private modalOpened = new Subject<boolean>();

    constructor() {
    }

    getModalState() {
        return this.modalOpened.asObservable();
    }

    openingModal() {
        this.modalOpened.next(true);
        setTimeout(() => {
            this.modalOpened.next(false);
        }, 100)
    }

}
