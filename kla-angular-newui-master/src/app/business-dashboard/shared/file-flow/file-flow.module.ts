import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes/notes.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { ProcessTrackerComponent } from './process-tracker/process-tracker.component';
import { PullmodalComponent } from './pullmodal/pullmodal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzFormModule, NzInputModule, NzTagModule, NzStepsModule, NzRadioModule, NzCardModule, NzModalModule, NzTableModule, NzButtonModule, NzPopoverModule, NzPopconfirmModule } from 'ng-zorro-antd';
import { LogsComponent } from './logs/logs.component';
import { QuickOptionsComponent } from './quick-options/quick-options.component';

export { NotesComponent } from './notes/notes.component';
export { FileInfoComponent } from './file-info/file-info.component';
export { ProcessTrackerComponent } from './process-tracker/process-tracker.component';
export { PullmodalComponent } from './pullmodal/pullmodal.component';
export { LogsComponent } from './logs/logs.component';
export { QuickOptionsComponent } from './quick-options/quick-options.component';

const components = [NotesComponent, FileInfoComponent, ProcessTrackerComponent, PullmodalComponent, 
  LogsComponent, QuickOptionsComponent];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzTagModule,
    NzStepsModule,
    NzRadioModule,
    NzCardModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzPopoverModule,
    NzPopconfirmModule
  ],
  exports: [...components]
})
export class FileFlowModule { }
