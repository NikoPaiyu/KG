import { AodListComponent } from './aod-list/aod-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AodComponent } from './aod.component';
import { AodViewComponent } from './aod-view/aod-view.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { AodMinistergroupComponent } from './aod-ministergroup/aod-ministergroup.component';
import { FileTrackingMinistergroupComponent } from './file-tracking-ministergroup/file-tracking-ministergroup.component';
import { MinistergroupListComponent } from './ministergroup-list/ministergroup-list.component';
import { ApprovedAodComponent } from './approved-aod/approved-aod.component';

const routes: Routes = [
  {
    path: '',
    component: AodComponent,
    children: [
      { path: '', redirectTo: 'aod-view' },
      { path: 'aod-create', component: AodViewComponent },
      { path: 'aod-create/:detail', component: AodViewComponent },
      { path: 'aod-file', component: FileTrackingComponent },
      { path: 'aod-ministergroup', component: AodMinistergroupComponent },
      { path: 'aod-ministergroup/:url', component: AodMinistergroupComponent },
      { path: 'aod-list/:assemblyId/:sessionId', component: AodListComponent },
      { path: 'aod-list', component: AodListComponent },
      { path: 'aod-file/:id', component: FileTrackingComponent },
      { path: 'aod-file/:id/:assemblyId/:sessionId', component: FileTrackingComponent },
      { path: 'aod-view', component: AodViewComponent },
      { path: 'aod-ministergroup-file', component: FileTrackingMinistergroupComponent},
      { path: 'ministergroup-list', component: MinistergroupListComponent},
      { path: 'approved-aod', component: ApprovedAodComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AodRoutingModule {}
