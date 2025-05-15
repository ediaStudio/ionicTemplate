import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {OnboardingComponent} from "@app/onboarding/onboarding.component";
// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {indexedDBLocalPersistence, initializeAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAGsWAnG_U0f7hgRavZyBgE7Zlz5FVNAFo",
    authDomain: "templateionic-9f231.firebaseapp.com",
    projectId: "templateionic-9f231",
    storageBucket: "templateionic-9f231.firebasestorage.app",
    messagingSenderId: "281363942320",
    appId: "1:281363942320:web:96613d5c0d1a1639276475",
    measurementId: "G-5X9P61Q2QQ"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// https://stackoverflow.com/questions/72143208/getauth-onauthstatechanged-not-called-async-not-resolving-in-capacitor
// Fix bug on ios or onAuthStateChanged never fire
//@ts-ignore
if (Capacitor.isNativePlatform()) {
    initializeAuth(firebaseApp, {
        persistence: indexedDBLocalPersistence
    });
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent,
        OnboardingComponent
    ],
    imports: [BrowserModule, IonicModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule],
    providers: [{
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
    }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {
}
