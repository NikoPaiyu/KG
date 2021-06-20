import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SdgAndEgComponent } from './sdg-and-eg.component';
import { SdgEgListComponent } from './sdg-eg-list/sdg-eg-list.component';
import { SdgRequestListComponent } from './sdg-request-list/sdg-request-list.component';


const routes: Routes = [
  {
    path: "",
    component: SdgAndEgComponent,
    children: [
      {
        path: "sdg-request-list",
        component: SdgRequestListComponent
      },
      {
        path: "sdgeg/list",
        component: SdgEgListComponent
      },
      {
        path: "sdgeg/received-list",
        component: SdgEgListComponent
      },
      {
        path: "sdgeg/published",
        component: SdgEgListComponent
      }, {
        path: "sdgeg/received-on-legislation",
        component: SdgEgListComponent
      },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdgAndEgRoutingModule { }
