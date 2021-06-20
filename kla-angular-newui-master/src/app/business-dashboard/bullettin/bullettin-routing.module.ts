import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBullettinsComponent } from './view-bullettins/view-bullettins.component';
import { BullettinDetailsComponent } from './bullettin-details/bullettin-details.component';
import { ListBullettinComponent } from './list-bullettin/list-bullettin.component';
import { FileTrackerComponent } from './file-tracker/file-tracker.component';
import { PublishedBullettinComponent } from './published-bullettin/published-bullettin.component';


const routes: Routes = [
  {
    path: '',
    component: ListBullettinComponent
  },
  {
    path: 'details/:id',
    component: BullettinDetailsComponent
  },
  {
    path: 'file/:id',
    component: FileTrackerComponent
  },
  {
    path: 'published-bulletin',
    component: PublishedBullettinComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BullettinRoutingModule { }
