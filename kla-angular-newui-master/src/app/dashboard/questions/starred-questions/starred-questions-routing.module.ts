import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StarredfolderComponent } from "./starredfolder/starredfolder.component";
import { StarredQuestionsComponent } from './starred-questions.component';
const routes: Routes = [
    {
        path: "",
        component: StarredQuestionsComponent
    },
    {
        path: ":folder",
        component: StarredfolderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StarredQuestionsRoutingModule { }