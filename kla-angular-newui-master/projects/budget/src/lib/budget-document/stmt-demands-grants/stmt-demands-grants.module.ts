import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NestableModule } from 'ngx-nestable';
import { StmtDemandsGrantsRoutingModule } from './stmt-demands-grants-routing.module'; 
import { StmtDemandsGrantsComponent } from './stmt-demands-grants.component'; 
import { DemandsListComponent } from './demands-list/demands-list.component'; 
import { SdfgOrVOACreationComponent } from './sdfg-voa-creation/sdfg-voa-creation.component'; 
import { SdfgListComponent } from './sdfg-list/sdfg-list.component'; 
import { SdfgViewComponent } from './sdfg-view/sdfg-view.component'; 
import { SdfgPreViewComponent } from './sdfg-preview/sdfg-preview.component'; 
import { CreateGreenBookComponent } from './green-book/create-greenbook/create-greenbook.component'; 
import { GreenbkPreviewComponent } from './green-book/greenbk-preview/greenbk-preview.component'; 



 let Components = [StmtDemandsGrantsComponent, DemandsListComponent, SdfgOrVOACreationComponent, SdfgListComponent, SdfgViewComponent, SdfgPreViewComponent, CreateGreenBookComponent, GreenbkPreviewComponent]
@NgModule({
  declarations: [...Components],
  imports: [
    NgZorroAntdModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    NestableModule,
    ReactiveFormsModule,
    StmtDemandsGrantsRoutingModule
  ],
  entryComponents: [SdfgPreViewComponent, GreenbkPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SdfgPreViewComponent, GreenbkPreviewComponent, CreateGreenBookComponent],
})
export class StmtDemandsGrantsModule { }
