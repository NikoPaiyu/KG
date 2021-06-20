import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssemblyElectedMemberComponent } from './assembly-elected-member/assembly-elected-member.component';
import { AssemblyElectionListComponent } from './assembly-election-list/assembly-election-list.component';
import { AssemblyElectionViewComponent } from './assembly-election-view/assembly-election-view.component';
import { AssemblyElectionComponent } from './assembly-election.component';

const routes: Routes = [
    { path: 'assembly-election', component: AssemblyElectionComponent,
      children: [
        {
            path: 'list',
            component: AssemblyElectionListComponent
        },
        {
            path: 'view/:id',
            component: AssemblyElectionViewComponent
        },
        {
          path: 'elected-member/:id',
          component: AssemblyElectedMemberComponent
        },
        {
          path: 'elected-member',
          component: AssemblyElectedMemberComponent
        }
      ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AssemblyElectionRoutingModule {}
