import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalRegisterComponent } from './personal-register/personal-register.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { AuthorisationsComponent } from './authorisations/authorisations.component';
import { BullettinFlowComponent } from './bullettin-flow/bullettin-flow.component';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';


const routes: Routes = [
  {
    path: '',
    component: PersonalRegisterComponent
  },
  {
    path: 'file/:id',
    component: FileTrackingComponent
  },
  {
    path: 'authorisation',
    component: AuthorisationsComponent
  },
  {
    path: 'bullettinflow',
    component: BullettinFlowComponent
  },
  {
    path: 'bulletin-list',
    component: BulletinListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
