import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PmbrCommitteeRoutingModule } from './pmbr-committee-routing.module';
import { PmbrCommitteeComponent } from './pmbr-committee.component';
import { FilesModule } from './files/files.module';
import { AgendaModule } from './agenda/agenda.module';

@NgModule({
  declarations: [PmbrCommitteeComponent],
  imports: [
    CommonModule,
    PmbrCommitteeRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AgendaModule,
    FilesModule
  ]
})
export class PmbrCommitteeModule { }
