import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAssemblyComponent } from './assembly-management/manage-assembly/manage-assembly.component';
import { SessionsComponent } from './assembly-management/sessions/sessions.component';
import { ConfigurationComponent } from './configuration.component';
import { ConstituencyListComponent } from './constituency-list/constituency-list.component';
import { PartyComponent } from './parties/party/party.component';
import { SectionListComponent } from './sections/section-list/section-list.component';


const routes: Routes = [
  {
    path: "",
    component: ConfigurationComponent,
    children: [
      {
        path: "sessions",
        component: ManageAssemblyComponent,
      },
      {
        path: "section-list",
        component: SectionListComponent
      },
      {
        path: "party",
        component: PartyComponent
      },
      {
        path: "constituency-list",
        component: ConstituencyListComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
