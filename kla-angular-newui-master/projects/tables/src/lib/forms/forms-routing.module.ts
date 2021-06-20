import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormsComponent } from './forms.component';

const routes: Routes = [
    { path: 'forms', component: FormsComponent,
      children: [
        {
            path: 'list',
            component: FormsListComponent
        }
      ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class FormsRoutingModule {}
