import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioManagementRoutingModule } from './portfolio-management-routing.module';
import { PortfolioManagementComponent } from './portfolio-management.component';
import { PortfolioListingComponent } from './portfolio-listing/portfolio-listing.component';
import { CreatePortfolioComponent } from './create-portfolio/create-portfolio.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { NestableModule } from 'ngx-nestable';


@NgModule({
  declarations: [PortfolioManagementComponent, PortfolioListingComponent, CreatePortfolioComponent],
  imports: [
    CommonModule,
    PortfolioManagementRoutingModule,
    TranslateModule,
    NgZorroAntdModule,
    FormsModule,
    NestableModule
  ]
})
export class PortfolioManagementModule { }
