import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProceedingDiaryComponent } from '../proceeding-reporter/create-proceeding-diary/create-proceeding-diary.component';
import { CreateReporterDiaryComponent } from '../proceeding-reporter/create-reporter-diary/create-reporter-diary.component';
import { ListProceedingDiaryComponent } from '../proceeding-reporter/list-proceeding-diary/list-proceeding-diary.component';
import { ListReporterDiaryComponent } from '../proceeding-reporter/list-reporter-diary/list-reporter-diary.component';
import { FileViewBulletinPart1Component } from './file-view-bulletin-part1/file-view-bulletin-part1.component';
import { FileViewResumeComponent } from './file-view-resume/file-view-resume.component';
import { ListTableDiaryBulletinPart1Component } from './list-table-diary-bulletin-part1/list-table-diary-bulletin-part1.component';
import { PrepareTableDiaryComponent } from './prepare-table-diary/prepare-table-diary.component';
import { PublishedResumeListComponent } from './published-resume-list/published-resume-list.component';
import { ResumeListComponent } from './resume-list/resume-list.component';
import { ResumePrepareComponent } from './resume-prepare/resume-prepare.component';
import { TableDiaryBulletinPart1Component } from './table-diary-bulletin-part1/table-diary-bulletin-part1.component';
import { TableDiaryListComponent } from './table-diary-list/table-diary-list.component';
import { TableDiaryComponent } from './table-diary.component';


const routes: Routes = [
  {
    path: '', component: TableDiaryComponent,
    children: [
      {
        path: "table-diary-list",
        component: TableDiaryListComponent
      },
      {
        path: "prepare-table-diary/:id",
        component: PrepareTableDiaryComponent
      },
      {
        path: "table-diary-bulletin-part1/:id",
        component: TableDiaryBulletinPart1Component
      },
      {
        path: "list-table-diary-bulletin-part1",
        component: ListTableDiaryBulletinPart1Component
      },
      {
        path: "resume-list",
        component: ResumeListComponent
      },
      {
        path: "file-view-bulletin-part1",
        component: FileViewBulletinPart1Component
      },
      {
        path: "file-view-resume",
        component: FileViewResumeComponent
      },
      {
        path: "resume-prepare/:id",
        component: ResumePrepareComponent
      },
      {
        path: "published-resume-list",
        component: PublishedResumeListComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableDiaryRoutingModule { }
