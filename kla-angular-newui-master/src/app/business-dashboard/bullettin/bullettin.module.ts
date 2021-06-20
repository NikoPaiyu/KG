import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BullettinRoutingModule } from './bullettin-routing.module';
import { ViewBullettinsComponent } from './view-bullettins/view-bullettins.component';
import { BullettinDetailsComponent } from './bullettin-details/bullettin-details.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TranslateModule } from "@ngx-translate/core";
import { ListBullettinComponent } from './list-bullettin/list-bullettin.component';
import { FileTrackerComponent } from './file-tracker/file-tracker.component';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { FileFlowModule } from '../shared/file-flow/file-flow.module';
import { PublishedBullettinComponent } from './published-bullettin/published-bullettin.component'
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  declarations: [ViewBullettinsComponent, BullettinDetailsComponent, ListBullettinComponent, FileTrackerComponent, PublishedBullettinComponent],
  imports: [
    CommonModule,
    BullettinRoutingModule,
    NgZorroAntdModule,
    FormsModule, 
    ReactiveFormsModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzTabsModule,
    NzInputModule,
    NzTableModule,
    NzIconModule,
    NzDropDownModule,
    NzCardModule,
    NzPaginationModule,
    TranslateModule,
    PdfJsViewerModule,
    FileFlowModule,
    NgxDocViewerModule
  ]
})
export class BullettinModule { }
