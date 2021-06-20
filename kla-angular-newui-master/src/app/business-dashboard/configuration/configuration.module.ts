import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { SessionsComponent } from './assembly-management/sessions/sessions.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule, NzIconModule } from 'ng-zorro-antd';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SectionListComponent } from './sections/section-list/section-list.component';
import { PartyComponent } from './parties/party/party.component';
import { ManageAssemblyComponent } from './assembly-management/manage-assembly/manage-assembly.component';
import { PortfolioManagementModule } from './portfolio-management/portfolio-management.module';
import { ConstituencyListComponent } from './constituency-list/constituency-list.component';

@NgModule({
  declarations: [ConfigurationComponent, SessionsComponent, SectionListComponent, PartyComponent, ManageAssemblyComponent, ConstituencyListComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    TranslateModule,
    NgZorroAntdModule,
    NzIconModule,
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    PortfolioManagementModule
  ]
})
export class ConfigurationModule { }
