import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';
import { CreateAgendaComponent } from './create-agenda/create-agenda.component';
import { ListAgendaComponent } from './list-agenda/list-agenda.component';
import { AssemblyRelatedAgendaComponent } from './assembly-related-agenda/assembly-related-agenda.component';
import { AcctionTakenReportBasedAgendaComponent } from './acction-taken-report-based-agenda/acction-taken-report-based-agenda.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AgendaComponent, CreateAgendaComponent, ListAgendaComponent, AssemblyRelatedAgendaComponent, AcctionTakenReportBasedAgendaComponent],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AgendaModule { }
