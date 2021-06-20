import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateElectionComponent } from './create-election.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CreateElectionComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CreateElectionComponent]
})
export class CreateElectionModule { }
