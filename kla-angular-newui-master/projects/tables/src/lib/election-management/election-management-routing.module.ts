import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';
import { ElectionManagementComponent } from './election-management.component';
import { PanelChairmanListComponent } from './panel-chairman-list/panel-chairman-list.component';
import { NominationListComponent } from './nomination-list/nomination-list.component';
import { PendingOfficeDocumentsComponent } from './pending-office-documents/pending-office-documents.component';
import { ProtemSpeakerAuthListComponent } from './protem-speaker-auth-list/protem-speaker-auth-list.component';
import { ProtemSpeakerListComponent } from './protem-speaker-list/protem-speaker-list.component';
import { ProtemSpeakerViewComponent } from './protem-speaker-view/protem-speaker-view.component';
import { SpeakerElectionListComponent } from './speaker-election-list/speaker-election-list.component';
import { ViewRegisteredDocumentsComponent } from './view-registered-documents/view-registered-documents.component';
import { PanelListComponent } from './panel-list/panel-list.component';
const routes: Routes = [

  {
    path: 'election', component: ElectionManagementComponent,
    children: [
        {
            path: 'pending-documents',
            component: PendingOfficeDocumentsComponent
        },
        {
            path: 'view-reg-docs/:id',
            component: ViewRegisteredDocumentsComponent
        },
        {
            path: 'protem-speaker-list',
            component: ProtemSpeakerListComponent
        },
        {
          path: 'protem-speaker-auth-list',
          component: ProtemSpeakerAuthListComponent
        },
        {
          path: 'protem-speaker/:id',
          component: ProtemSpeakerViewComponent
      },
      {
        path: 'election-list',
        component: SpeakerElectionListComponent
      },
      {
        path: 'panel-chairman-list',
        component: PanelChairmanListComponent
      },
      {
        path: 'nomination-list/:id',
        component: NominationListComponent
      },
      {
        path: 'bulletin-list',
        component: BulletinListComponent
      },
      {
        path: 'panel-list',
        component: PanelListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionManagementRoutingModule {}
