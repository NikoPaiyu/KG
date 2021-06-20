import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GovernerAddressRoutingModule } from "./governers-address-routing.module";
import { GovernersAddressComponent } from "./governers-address.component";
import { ListGovernersAddressComponent } from "./list-governers-address/list-governers-address.component";
import { CreateMinuteComponent } from "./minute-to-minute/create-minute/create-minute.component";
import { ListMinuteComponent } from "./minute-to-minute/list-minute/list-minute.component";
import { ViewMinuteComponent } from "./minute-to-minute/view-minute/view-minute.component";
import { RouterModule } from "@angular/router";
import { ConfigurationComponent } from './time-allocation/configuration/configuration.component';
import { TimeallocationMemberComponent } from './time-allocation/timeallocation-member/timeallocation-member.component';
import { NestableModule } from 'ngx-nestable';
import { AddMembersComponent } from './time-allocation/add-members/add-members.component';
import { TimeallocationTsComponent } from './time-allocation/timeallocation-ts/timeallocation-ts.component';
import { MinutesPreviewComponent } from '../shared/component/minutes-preview/minutes-preview.component';
import { ListProcessionComponent } from './procession/list-procession/list-procession.component';
import { AmendmentMOTComponent } from './amendment-mot/amendment-mot.component';
import { ApprovedMOTComponent } from './approved-mot/approved-mot.component';
import { QuillModule } from 'ngx-quill';
import { ListMOTComponent } from './list-mot/list-mot.component';
import { TimeAllocationListingComponent } from './time-allocation/time-allocation-listing/time-allocation-listing.component';
import { AmendmentListpreparationComponent } from './amendment-listpreparation/amendment-listpreparation.component';
import { CreateGovComponent } from './create-gov/create-gov.component';

const Components = [
  GovernersAddressComponent,
  ListGovernersAddressComponent,
  CreateMinuteComponent,
  ListMinuteComponent,
  ViewMinuteComponent,
  ConfigurationComponent,
  MinutesPreviewComponent,
  ListProcessionComponent,
  ConfigurationComponent,
  TimeallocationMemberComponent,
  AddMembersComponent,
  TimeallocationTsComponent,
  AmendmentMOTComponent,
  ApprovedMOTComponent,
  ListMOTComponent,
  TimeAllocationListingComponent,
  AmendmentListpreparationComponent,
  CreateGovComponent
];

@NgModule({
  declarations: [...Components, ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    GovernerAddressRoutingModule,
    RouterModule,
    NestableModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar:
          [['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }],
          [{ 'direction': 'rtl' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ]
      }
    })
  ],
  exports: [CreateMinuteComponent, AmendmentMOTComponent, ConfigurationComponent, TimeallocationTsComponent,AmendmentListpreparationComponent],
  entryComponents: [MinutesPreviewComponent, CreateGovComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GovernersAddressModule { }
