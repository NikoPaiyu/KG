import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandDraftScheduleComponent } from './demand-draft-schedule.component';
import { DDSListComponent } from './dds-list/dds-list.component';
import { DdsCreateComponent } from './dds-create/dds-create.component';
import { SdgDdsCreateCreateComponent } from './sdg-dds-create/sdg-dds-create.component';
import { DdsSuggetionComponent } from './dds-suggetion/dds-suggetion.component';
import { DdsHeadsGulletinComponent } from './dds-heads-gulletin/dds-heads-gulletin.component';
import { DdsVersionComponent } from './dds-version/dds-version.component';


const routes: Routes = [
  {
    path: "",
    component: DemandDraftScheduleComponent,
    children: [
      {
        path: "",
        redirectTo: "dds/list",
      },
      {
        path: "dds/list",
        component: DDSListComponent
      },
      {
        path: "sdgeg/dds/list",
        component: DDSListComponent
      },
      {
        path: "dds/submitted",
        component: DDSListComponent
      },
      {
        path: "sdgeg/dds/submitted",
        component: DDSListComponent
      },
      {
        path: "dds/create",
        component: DdsCreateComponent
      },
      {
        path: "sdgeg/dds/create",
        component: SdgDdsCreateCreateComponent
      },
      {
        path: "dds/view/:id",
        component: DdsCreateComponent
      },
      {
        path: "sdgeg/dds/view/:id",
        component: SdgDdsCreateCreateComponent
      },
      {
        path: "dds/suggetion/:id",
        component: DdsSuggetionComponent
      },
      {
        path: "sdgeg/dds/suggetion/:id",
        component: DdsSuggetionComponent
      },
      {
        path: "dds/heads/gulletin",
        component: DdsHeadsGulletinComponent
      },
      {
        path: "dds/version/:ol/:section",
        component: DdsVersionComponent
      },
      {
        path: "sdgeg/dds/version/:ol/:section",
        component: DdsVersionComponent
      }
    ],
  }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandDraftScheduleRoutingModule { }
