import { BudgetComponent } from './budget.component';
import { BudgetSpeechModule } from './budget-speech/budget-speech.module';
import { FilesModule } from './files/files.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import {BudgetDocumentModule} from './budget-document/budget-document.module';
import { ApBillModule } from './ap-bill/ap-bill.module';
import { SdgAndEgModule } from './sdg-and-eg/sdg-and-eg.module';
import { TimeAllocationModule } from './time-allocation/time-allocation.module';


@NgModule({
  declarations: [BudgetComponent],
  imports: [
    CommonModule,
    BudgetSpeechModule,
    FilesModule,
    BudgetDocumentModule,
    ApBillModule,
    SdgAndEgModule,
    TimeAllocationModule
  ]
})
export class BudgetModule { }
