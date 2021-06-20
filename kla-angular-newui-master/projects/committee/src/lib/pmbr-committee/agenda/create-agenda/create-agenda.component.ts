import { Component, OnInit, ViewChild } from '@angular/core';
import { AcctionTakenReportBasedAgendaComponent } from '../acction-taken-report-based-agenda/acction-taken-report-based-agenda.component';
import { AssemblyRelatedAgendaComponent } from '../assembly-related-agenda/assembly-related-agenda.component';

@Component({
  selector: 'committee-create-agenda',
  templateUrl: './create-agenda.component.html',
  styleUrls: ['./create-agenda.component.css'],

})
export class CreateAgendaComponent implements OnInit {
  radioValue = 'assemblyrelated';

  @ViewChild(AcctionTakenReportBasedAgendaComponent, { static: false }) actionBased_Component: AcctionTakenReportBasedAgendaComponent;
  @ViewChild(AssemblyRelatedAgendaComponent, { static: false }) assemblyRelated_Component: AssemblyRelatedAgendaComponent;

  constructor() {
  }

  ngOnInit() {

  }

  //function to save agenda
  saveAgenda() {
    if (this.radioValue == 'actionBased') {
      this.actionBased_Component.createmeetings();
    }
    else if (this.radioValue == 'assemblyrelated') {
      this.assemblyRelated_Component.saveButtonClick();
    }
  }

  //function to submit agenda
  submitAgenda() {

  }
}
