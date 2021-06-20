import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SummaryfolderComponent } from './summaryfolder.component';
import { SummarysubfolderComponent } from './summarysubfolder/summarysubfolder.component';

const routes: Routes = [
    {
        path: "",
        component: SummaryfolderComponent
    },
    {
        path: ":folder",
        component: SummarysubfolderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SummaryfolderRoutingModule { }