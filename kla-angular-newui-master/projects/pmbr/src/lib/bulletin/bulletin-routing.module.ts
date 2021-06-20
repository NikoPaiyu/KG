import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';


const routes: Routes = [
  {
    path: '',
    component: BulletinListComponent,
    children: [
      {
        path: 'bulletin-list',
        component: BulletinListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulletinRoutingModule { }
