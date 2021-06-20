import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BacRoutingModule } from './bac-routing.module';
import { AddMemberComponent } from './components/add-member/add-member.component';


@NgModule({
  declarations: [AddMemberComponent],
  imports: [
    CommonModule,
    BacRoutingModule
  ]
})
export class BacModule { }
