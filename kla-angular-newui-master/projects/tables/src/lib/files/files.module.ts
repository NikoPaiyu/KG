import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesRoutingModule } from './files-routing.module';
import { NotesComponent } from './notes/notes.component';
import { FileViewComponent } from './file-view/file-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListComponent } from './file-list/file-list.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { FilesComponent } from './files/files.component';
import { GovernersAddressModule } from '../governers-address/governers-address.module';
import { QuillModule } from 'ngx-quill';
import { ObiturayManagementModule } from '../obituray-management/obituray-management.module';
import { M2MProcessionModule } from '../shared/component/m2m-procession/m2m-procession.module';
import { GovernorsAddressFileViewModule } from '../shared/component/governors-address-file-view/governors-address-file-view.module';
import { ElectionManagementModule } from '../election-management/election-management.module';
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { BulletinPart2ViewModule } from './bulletin-part2-view/bulletin-part2-view.module';
import { SeatManagementModule } from '../seat-management/seat-management.module';
import { TimeAllocationModule } from '../time-allocation/time-allocation.module';
import { PanelMemberModule } from '../shared/component/panel-member/panel-member.module';


@NgModule({
  declarations: [NotesComponent, FileViewComponent, FileListComponent, ButtonsComponent, FilesComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    GovernersAddressModule,
    SeatManagementModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
    }),
    ObiturayManagementModule,
    M2MProcessionModule,
    GovernorsAddressFileViewModule,
    ElectionManagementModule,
    SafehtmlModule,
    BulletinPart2ViewModule,
    TimeAllocationModule,
    PanelMemberModule
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilesModule { }
