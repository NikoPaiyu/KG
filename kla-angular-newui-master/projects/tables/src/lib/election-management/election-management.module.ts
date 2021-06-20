import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectionManagementComponent } from './election-management.component';
import { ElectionManagementRoutingModule } from './election-management-routing.module';
import { PendingOfficeDocumentsComponent } from './pending-office-documents/pending-office-documents.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewRegisteredDocumentsComponent } from './view-registered-documents/view-registered-documents.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ProtemSpeakerListComponent } from './protem-speaker-list/protem-speaker-list.component';
import { AttachToFileModule } from '../shared/component/attach-to-file/attach-to-file.module';
import { ProtemSpeakerViewComponent } from './protem-speaker-view/protem-speaker-view.component';
import { QuillModule } from 'ngx-quill';
import { ProtemSpeakerAuthListComponent } from './protem-speaker-auth-list/protem-speaker-auth-list.component';
import { CreateBulletinFormModule } from '../shared/component/create-bulletin-form/create-bulletin-form.module';
import { SpeakerElectionListComponent } from './speaker-election-list/speaker-election-list.component';
import { SpeakerElectionViewComponent } from './speaker-election-view/speaker-election-view.component';
import { CosViewModule } from '../shared/component/cos-view/cos-view.module';
import { CosViewComponent } from '../shared/component/cos-view/cos-view.component';
import { PanelChairmanListComponent } from './panel-chairman-list/panel-chairman-list.component';
import { CreateElectionNominationComponent } from './create-election-nomination/create-election-nomination.component';
import { NominationListComponent } from './nomination-list/nomination-list.component';
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';
import { PanelListComponent } from './panel-list/panel-list.component';
import { PanelViewModule } from '../shared/component/panel-view/panel-view.module';
@NgModule({
  declarations: [ElectionManagementComponent, PendingOfficeDocumentsComponent, ViewRegisteredDocumentsComponent, ProtemSpeakerListComponent, ProtemSpeakerViewComponent, ProtemSpeakerAuthListComponent, SpeakerElectionListComponent, SpeakerElectionViewComponent, CreateElectionNominationComponent, NominationListComponent, BulletinListComponent, PanelChairmanListComponent,PanelListComponent],
  imports: [
    CommonModule,
    ElectionManagementRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    AttachToFileModule,
    QuillModule.forRoot(),
    CreateBulletinFormModule,
    ReactiveFormsModule,
    CosViewModule,
    PanelViewModule,
    SafehtmlModule,
    
  ],
  exports: [ViewRegisteredDocumentsComponent, ProtemSpeakerViewComponent, SpeakerElectionViewComponent, NominationListComponent, PanelChairmanListComponent],
  entryComponents: [CosViewComponent]
})
export class ElectionManagementModule { }
