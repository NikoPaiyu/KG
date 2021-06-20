import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NestableModule } from 'ngx-nestable';
import { TimeAllocationComponent } from './time-allocation.component'; 
import { TimeAllocationRoutingModule } from './time-allocation-routing.module';
import { AddMembersComponent } from './add-members/add-members.component'; 
import { ConfigurationComponent } from './configuration/configuration.component'; 
import { TimeAllocationListingComponent } from './time-allocation-listing/time-allocation-listing.component'; 
import { TimeallocationMemberComponent } from './timeallocation-member/timeallocation-member.component'; 
import { TimeallocationTsComponent } from './timeallocation-ts/timeallocation-ts.component'; 


 let Components = [TimeAllocationComponent, AddMembersComponent, ConfigurationComponent, TimeAllocationListingComponent, TimeallocationMemberComponent, TimeallocationTsComponent]
@NgModule({
  declarations: [...Components],
  imports: [
    NgZorroAntdModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    NestableModule,
    ReactiveFormsModule,
    TimeAllocationRoutingModule
  ],
  exports: [ConfigurationComponent, TimeallocationTsComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimeAllocationModule { }
