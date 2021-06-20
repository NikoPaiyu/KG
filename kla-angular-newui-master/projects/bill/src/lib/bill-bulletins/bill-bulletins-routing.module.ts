import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillBulletinsComponent } from './bill-bulletins.component';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';


const routes: Routes = [
  {
    path: "",
    component: BillBulletinsComponent,
    children: [
      {
        path: "",
        redirectTo: "bulletin-list",
      },
      {
        path: "bulletin-list",
        component: BulletinListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillBulletinsRoutingModule { }
