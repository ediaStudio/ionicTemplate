import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSlides, ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

export interface IOnboardSlide {
    image: string;          // The path to the image
    displayBtn?: boolean;    // Indicates if the button should be displayed
    title: string;          // The title of the slide
    description: string;    // The description text of the slide
}

@Component({
    selector: 'app-onboarding',
    standalone: false,
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

    @ViewChild('swiper', {static: true})
    swiper?: any

    swiperModules = [IonicSlides];

    slides: IOnboardSlide[] = [
        {
            image: 'assets/img/angular.png',
            title: this.translate.instant('slides.slide1.title'),
            description: this.translate.instant('slides.slide1.description'),
        },
        {
            image: 'assets/img/angular.png',
            title: this.translate.instant('slides.slide2.title'),
            description: this.translate.instant('slides.slide2.description'),
        },
        {
            image: 'assets/img/angular.png',
            displayBtn: true,
            title: this.translate.instant('slides.slide3.title'),
            description: this.translate.instant('slides.slide3.description'),
        }
    ];

    constructor(
        private translate: TranslateService,
        private modalController: ModalController) {
    }

    ngOnInit() {
    }

    async close(data?: any) {
        this.modalController.dismiss(data);
    }

    nextSlide(): void {
        console.log(this.swiper);
        if (this.swiper?.nativeElement?.swiper) {
            this.swiper.nativeElement.swiper.slideNext();
        }
    }
}
