import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BudgetSpeechComponent } from "./budget-speech.component";
import { BudgetSpeechRoutingModule } from './budget-speech-routing.module';
import { CreateFileComponent } from '../files/create-file/create-file.component'; 
import { AttachToFileComponent } from '../files/attach-to-file/attach-to-file.component'; 
import { ListPublishedBsComponent } from './list-published-bs/list-published-bs.component';
import { NgxDocViewerModule } from "ngx-doc-viewer";

 let Components = [BudgetSpeechComponent, ListPublishedBsComponent]
@NgModule({
  declarations: [...Components],
  imports: [
    NgZorroAntdModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BudgetSpeechRoutingModule,
    NgxDocViewerModule
  ],
  entryComponents: [CreateFileComponent, AttachToFileComponent]
})
export class BudgetSpeechModule { }
