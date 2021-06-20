import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectionListComponent } from './election-list/election-list.component';
import { SwearingInListComponent } from './swearing-in-list/swearing-in-list.component';
import { SwearingInComponent } from './swearing-in.component';


const routes: Routes = [
  { path: 'swearing-in', component: SwearingInComponent,
      children: [
        {
            path: '',
            component: ElectionListComponent
        },
        {
          path: 'list/:id',
          component: SwearingInListComponent
      }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwearingInRoutingModule { }
