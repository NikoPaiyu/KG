import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyElectionComponent } from './assembly-election.component';
import { AssemblyElectionListComponent } from './assembly-election-list/assembly-election-list.component';
import { AssemblyElectionRoutingModule } from './assembly-election-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateElectionModule } from './shared/components/create-election/create-election.module';
import { AssemblyElectionViewComponent } from './assembly-election-view/assembly-election-view.component';
import { AddConstituencyModule } from './shared/components/add-constituency/add-constituency.module';
import { AddCandidatesModule } from './shared/components/add-candidates/add-candidates.module';
import { AssemblyElectedMemberComponent } from './assembly-elected-member/assembly-elected-member.component';
import { MemberElectionDetailsComponent } from './member-election-details/member-election-details.component';
import { MemberTermsComponent } from './member-terms/member-terms.component';
import { MemberPositionDetailsComponent } from './member-position-details/member-position-details.component';



@NgModule({
  declarations: [AssemblyElectionComponent, AssemblyElectionListComponent, AssemblyElectionViewComponent, AssemblyElectedMemberComponent, MemberElectionDetailsComponent, MemberTermsComponent, MemberPositionDetailsComponent],
  imports: [
    CommonModule,
    AssemblyElectionRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CreateElectionModule,
    AddConstituencyModule,
    AddCandidatesModule
  ]
})
export class AssemblyElectionModule { }
