import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePortfolioComponent } from './create-portfolio/create-portfolio.component';
import { PortfolioListingComponent } from './portfolio-listing/portfolio-listing.component';
import { PortfolioManagementComponent } from './portfolio-management.component';


const routes: Routes = [
  { path: 'portfolio', component: PortfolioManagementComponent,
      children: [
        {
            path: 'listing',
            component: PortfolioListingComponent
        },
        {
          path: 'create/:id',
          component: CreatePortfolioComponent
        },
        {
          path: 'view/:id',
          component: CreatePortfolioComponent
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioManagementRoutingModule { }
