import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubmissionComponent } from "./submission.component";
import { SubFolderComponent } from "./sub-folder/sub-folder.component";

const routes: Routes = [
    {
        path: "",
        component: SubmissionComponent
    },
    {
        path: ":folder",
        component: SubFolderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubmissionRoutingModule { }