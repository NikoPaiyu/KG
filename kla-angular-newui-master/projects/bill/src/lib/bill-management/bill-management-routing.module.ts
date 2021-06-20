import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BillManagementComponent } from "./bill-management.component";
import { BillsComponent } from "./bills/bills.component";
import { CreateBillComponent } from "./create-bill/create-bill.component";
import { ErrataListComponent } from "./errata-list/errata-list.component";
import { GovernerSignedBillsComponent } from "./governer-signed-bills/governer-signed-bills.component";
import { TranslatedBillsComponent } from './translated-bills/translated-bills.component';
import { VettingComponent } from './vetting/vetting.component';

const routes: Routes = [
  {
    path: "",
    component: BillManagementComponent,
    children: [
      {
        path: "bills",
        component: BillsComponent,
      },
      {
        path: 'errata-list',
        component: ErrataListComponent,
      },
      {
        path: 'create-bill/:id',
        component: CreateBillComponent,
      },
      {
        path: 'vetting',
        component: VettingComponent
      },
      {
        path: 'translated-bills',
        component: TranslatedBillsComponent
      },
      {
        path: 'goveners-recomended',
        component: GovernerSignedBillsComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillManagementRoutingModule {}
