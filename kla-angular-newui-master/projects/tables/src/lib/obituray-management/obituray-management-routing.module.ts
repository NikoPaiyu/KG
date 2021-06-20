import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateObituaryAddressComponent } from './create-obituary-address/create-obituary-address.component';
import { ObituaryListingComponent } from './obituary-listing/obituary-listing.component';
import { ObiturayManagementComponent } from './obituray-management.component';


const routes: Routes = [
  {
    path: '', component: ObiturayManagementComponent,
    children: [
      {
        path: "obituary-listing",
        component: ObituaryListingComponent,
      },
      {
        path: "create-obituary-address",
        component: CreateObituaryAddressComponent,
      },
      {
        path: "create-obituary-address/:id",
        component: CreateObituaryAddressComponent,
      }
    ]
  }   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObiturayManagementRoutingModule { }
