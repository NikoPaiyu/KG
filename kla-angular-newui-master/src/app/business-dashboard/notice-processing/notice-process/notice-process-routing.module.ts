import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NoticeProcessComponent } from "./notice-process.component";
import { VersionsComponent } from './versions/versions.component';

const routes: Routes = [
  {
    path: ":encodedUrl",
    component: NoticeProcessComponent
  },
  {
    path: "versions/view",
    component: VersionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeProcessRoutingModule {}
