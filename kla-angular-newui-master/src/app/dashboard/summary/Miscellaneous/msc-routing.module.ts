import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MscSummaryComponent } from "./mscsummary.component";
import { MscfolderComponent } from "./mscfolder/mscfolder.component";

const routes: Routes = [
    {
        path: "",
        component: MscSummaryComponent
    },
    {
        path: ":folder",
        component: MscfolderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MscRoutingModule { }