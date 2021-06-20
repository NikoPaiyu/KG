import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AodRoutingModule } from './aod-routing.module';
import { AodComponent } from './aod.component';
import { AodCreateComponent } from './aod-create/aod-create.component';
import { AodMinistergroupComponent } from './aod-ministergroup/aod-ministergroup.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AodViewComponent } from './aod-view/aod-view.component';
import { NgZorroAntdModule, NzIconModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { NzListModule } from 'ng-zorro-antd/list';
import { AodListComponent } from './aod-list/aod-list.component';
import { FileTrackingMinistergroupComponent } from './file-tracking-ministergroup/file-tracking-ministergroup.component';
import { MinistergroupListComponent } from './ministergroup-list/ministergroup-list.component';
import { ApprovedAodComponent } from './approved-aod/approved-aod.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { NestableModule } from 'ngx-nestable';
import { NgxSortableModule } from 'ngx-sortable';
import { SortablejsModule } from 'ngx-sortablejs';

@NgModule({
  declarations: [
    AodComponent,
    AodCreateComponent,
    AodViewComponent,
    FileTrackingComponent,
    AodMinistergroupComponent,
    AodListComponent,
    FileTrackingMinistergroupComponent,
    MinistergroupListComponent,
    ApprovedAodComponent
  ],
  imports: [
    CommonModule,
    AodRoutingModule,
    NzGridModule,
    NzButtonModule,
    NzDividerModule,
    NzDatePickerModule,
    NzRadioModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzTagModule,
    NzCardModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    TranslateModule,
    NzListModule,
    NzIconModule,
    NgxSortableModule,
    NestableModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgDragDropModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }],
          [{ direction: 'rtl' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
    }),
  ],
})
export class AodModule {}
