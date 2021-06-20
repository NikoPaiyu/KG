import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';
import { FileListComponent } from './file-list/file-list.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CreateCommitteeConstitutionComponent } from '../create-committee-constitution/create-committee-constitution.component';
import { FileViewComponent } from './file-view/file-view.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { PmbrCommitteeFileviewComponent } from './pmbr-committee-fileview/pmbr-committee-fileview.component';
import { NotesComponent } from './notes/notes.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';

const Components=[CreateCommitteeConstitutionComponent]

@NgModule({
  declarations: [FilesComponent, FileListComponent, CreateCommitteeConstitutionComponent, FileViewComponent, ButtonsComponent, PmbrCommitteeFileviewComponent, NotesComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzBreadCrumbModule,
    TranslateModule,
    NzTabsModule,
    NzSelectModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTableModule,
    NzTagModule,
    NzPopconfirmModule,
    NzRadioModule,
    NzCheckboxModule,
    NzStepsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilesModule { }
