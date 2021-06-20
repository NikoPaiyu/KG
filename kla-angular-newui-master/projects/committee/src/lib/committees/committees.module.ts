import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommitteesRoutingModule } from './committees-routing.module';
import { CommitteesComponent } from './committees.component';

import { CommitteeListingComponent } from './committee-listing/committee-listing.component';
import { CommitteeViewComponent } from './committee-view/committee-view.component';
import { CommitteeEditComponent } from './committee-edit/committee-edit.component';
import { CreateBulletinFormModule } from '../shared/components/create-bulletin-form/create-bulletin-form.module';
import { FilesModule } from '../files/files.module';


const Components = [CommitteesComponent, CommitteeListingComponent];

@NgModule({ 
  declarations: [...Components, CommitteeViewComponent, CommitteeEditComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommitteesRoutingModule,
    CreateBulletinFormModule,
    FilesModule
  ],
  exports: []
})
export class CommitteesModule { }
