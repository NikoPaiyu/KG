import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateDigitisationComponent } from "./create-digitisation/create-digitisation.component";
import { DigitisationComponent } from "./digitisation.component";
import { ListDigitisationComponent } from "./list-digitisation/list-digitisation.component";
const routes: Routes = [
    {
        path: '',
        component: DigitisationComponent,
        children: [{
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
        },
        {
            path: 'list',
            component: ListDigitisationComponent
        },
        {
            path: 'create',
            component: CreateDigitisationComponent
        },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DigitisationRoutingModule { }