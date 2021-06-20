import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProceedingDiaryComponent } from './create-proceeding-diary/create-proceeding-diary.component';
import { CreateReporterDiaryComponent } from './create-reporter-diary/create-reporter-diary.component';
import { ListProceedingDiaryComponent } from './list-proceeding-diary/list-proceeding-diary.component';
import { ListReporterDiaryComponent } from './list-reporter-diary/list-reporter-diary.component';
import { ProceedingReporterComponent } from './proceeding-reporter.component';


const routes: Routes = [
  {
    path: '',
    component: ProceedingReporterComponent,
    children: [{
      path: 'reporterlist',
      component: ListReporterDiaryComponent
    },
    {
      path: 'proceedinglist',
      component: ListProceedingDiaryComponent
    },
    {
      path: 'createreporter/:id',
      component: CreateReporterDiaryComponent
    },
    {
      path: 'createproceeding/:id',
      component: CreateProceedingDiaryComponent
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProceedingReporterRoutingModule { }
