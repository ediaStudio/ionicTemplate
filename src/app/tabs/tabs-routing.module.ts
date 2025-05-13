import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {Tab3Page} from "../tab3/tab3.page";
import {ProfileComponent} from "../profile/profile.component";

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'tab1',
                component: Tab1Page
            },
            {
                path: 'tab2',
                component: Tab2Page
            },
            {
                path: 'tab3',
                component: Tab3Page
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: '', // Si l'url est vide on redirige vers tab1
                redirectTo: 'tab1',
                pathMatch: 'full'
            },
            {
                path: '**', // Ca veut dire que si la route n'existe pas alors on redirige vers tab1
                redirectTo: 'tab1'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {
}
