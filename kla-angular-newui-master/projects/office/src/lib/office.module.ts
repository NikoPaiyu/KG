import { NgModule } from '@angular/core';
import { DocsManagementModule } from './docs-management/docs-management.module';
import { OfficeComponent } from './office.component';



@NgModule({
  declarations: [OfficeComponent],
  imports: [
    DocsManagementModule
  ],
  exports: [OfficeComponent]
})
export class OfficeModule { }
