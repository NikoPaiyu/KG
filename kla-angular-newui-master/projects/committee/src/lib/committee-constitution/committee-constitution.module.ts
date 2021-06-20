import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LetterToPpoComponent } from './letter-to-ppo/letter-to-ppo.component';
import { SubjectCommitteeNomineeComponent } from './subject-committee-nominee/subject-committee-nominee.component';
import { CommitteeChartComponent } from './committee-chart/committee-chart.component';
import { CommitteeConstitutionComponent } from './committee-constitution.component';
import { CommitteeConstitutionRoutingModule } from './committee-constitution-routing.module';

import { AddMemberComponent } from '../shared/components/add-member/add-member.component';
import { QuillModule } from "ngx-quill";
import { SelectCommitteeConstitutionComponent } from './select-committee-constitution/select-committee-constitution.component';
import { PmbrCommitteeNomineeComponent } from './pmbr-committee-nominee/pmbr-committee-nominee.component';
const Components = [CommitteeConstitutionComponent, CommitteeChartComponent, LetterToPpoComponent, SubjectCommitteeNomineeComponent, 
  AddMemberComponent];

@NgModule({
  declarations: [...Components, SelectCommitteeConstitutionComponent, PmbrCommitteeNomineeComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommitteeConstitutionRoutingModule,
    QuillModule.forRoot(),
  ],
  exports: [LetterToPpoComponent,SelectCommitteeConstitutionComponent]
})
export class CommitteeConstitutionModule { }
