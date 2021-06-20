import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCandidatesComponent } from './add-candidates.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCandidateFormComponent } from './add-candidate-form/add-candidate-form.component';



@NgModule({
  declarations: [AddCandidatesComponent, AddCandidateFormComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddCandidatesComponent]
})
export class AddCandidatesModule { }
