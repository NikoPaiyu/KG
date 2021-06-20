import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SelectNoticeTypeComponent } from "./select-notice-type/select-notice-type.component";
import { CreateNoticeComponent } from "./create-notice/create-notice.component";
import { ListNoticeComponent } from "./list-notice/list-notice.component";
import { ConsentsNotieComponent } from "./consents-notice/consents-notice.component";
import { ReferenceNoticesComponent } from "./reference-notices/reference-notices.component";

const routes: Routes = [
  {
    path: "",
    component: SelectNoticeTypeComponent,
  },
  {
    path: "create",
    component: CreateNoticeComponent,
  },
  {
    path: "create/:id/:noticeId",
    component: CreateNoticeComponent,
  },
  {
    path: "list",
    component: ListNoticeComponent,
  },
  {
    path: "list/:status",
    component: ListNoticeComponent,
  },
  {
    path: "consents",
    component: ConsentsNotieComponent,
  },
  {
    path: 'minister',
    loadChildren: () => import('./minister/minister.module').then( x => x.MinisterModule)
  },
  {
    path: 'reference/minister',
    component: ReferenceNoticesComponent
  },
  {
    path: 'reference/table',
    component: ReferenceNoticesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeRoutingModule {}
