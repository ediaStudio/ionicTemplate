import {NgModule} from '@angular/core';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {Tab3Page} from "../tab3/tab3.page";
import {SharedModule} from "../shared/shared.module";
import {ProfileComponent} from "../profile/profile.component";

@NgModule({
    imports: [
        SharedModule,
        TabsPageRoutingModule
    ],
    declarations: [TabsPage,
        Tab1Page, // on rajoute ca
        Tab2Page, // on rajoute ca
        Tab3Page, // on rajoute ca
        ProfileComponent // On rajoute le ProfileComponent
    ]
})
export class TabsPageModule {
}
