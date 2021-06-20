import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcctionTakenReportBasedAgendaComponent } from './acction-taken-report-based-agenda/acction-taken-report-based-agenda.component';
import { AgendaComponent } from './agenda.component';
import { AssemblyRelatedAgendaComponent } from './assembly-related-agenda/assembly-related-agenda.component';
import { CreateAgendaComponent } from './create-agenda/create-agenda.component';
import { ListAgendaComponent } from './list-agenda/list-agenda.component';


const routes: Routes = [
  {
    path: '',
    component: AgendaComponent,
    children: [
      {
        path: 'list-agenda',
        component: ListAgendaComponent
      },
      {
        path: 'assembly-related',
        component: AssemblyRelatedAgendaComponent
      },
      {
        path: 'action-taken',
        component: AcctionTakenReportBasedAgendaComponent
      },
      {
        path: 'create-agenda',
        component: CreateAgendaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
