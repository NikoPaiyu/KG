import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListvoteResultsComponent } from './listvote-results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {VoteResultsComponent}from  './vote-results/vote-results.component'

const routes: Routes = [{ path: '', component: VoteResultsComponent },
{path:'vote-results',
component:VoteResultsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListvoteResultsRoutingModule { }
