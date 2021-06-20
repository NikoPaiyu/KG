import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpeakerListComponent } from './speaker-list/speaker-list.component';
import { SpeakerNoteViewComponent } from './speaker-note-view/speaker-note-view.component';
import { SpeakerComponent } from './speaker/speaker.component';


const routes: Routes = [
  {
    path: '',
    component: SpeakerComponent,
    children: [
      {
        path: 'speaker-list',
        component: SpeakerListComponent
      },
      {
        path: 'speaker-note-view/:id',
        component: SpeakerNoteViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakerRoutingModule { }
