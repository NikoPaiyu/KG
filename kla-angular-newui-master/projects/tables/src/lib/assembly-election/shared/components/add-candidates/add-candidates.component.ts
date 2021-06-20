import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { AssemblyElectionService } from '../../services/assembly-election.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'tables-add-candidates',
  templateUrl: './add-candidates.component.html',
  styleUrls: ['./add-candidates.component.scss']
})
export class AddCandidatesComponent implements OnInit {
  @Input() candidateList;
  @Input() electionDetails;
  @Input() detailId;
  @Output() candidateAdded = new EventEmitter<any>();
  tabIndex = 0;
  tabs = {
    addCandidateTab: false,
    markWinner: false
  };
  constDetails: any = null;
  winnerDetails: any = null;
  userNameRadio = false;
  userName: any = null;
  candidateId = null;
  electionDateNotOver = false;
  resultDateOver = false;
  @Output() closePopup = new EventEmitter<any>();

  constructor(private service: AssemblyElectionService,public translate: TranslateService,
              private notification: NzNotificationService) { }

  ngOnInit() {
    this.getElectionDetailsById();
  }

  showLinks(id) {
    this.constDetails.candidates.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.constDetails.candidates.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  showAddTab() {
    this.tabs.addCandidateTab = true;
    this.tabIndex = 2;
  }
  viewCandidate(id){
    this.candidateId = id;
    this.showAddTab();
  }
  closeAllTabs() {
    this.tabs = {
      addCandidateTab: false,
      markWinner: false
    };
    this.tabIndex = 0;
    this.userNameRadio = false;
    this.winnerDetails = null;
    this.candidateId = null; 
  }

  candidateAddedEvent() {
    this.getElectionDetailsById();
    this.candidateAdded.emit();
    this.closeAllTabs();
  }

  getElectionDetailsById() {
    this.service.getDetailsById(this.candidateList.id).subscribe((res: any) => {
      this.constDetails = res;
      this.electionDateNotOver = differenceInCalendarDays(parseISO(this.constDetails.electionDate), new Date()) < 0 ? false : true;
      this.resultDateOver = differenceInCalendarDays(parseISO(this.constDetails.resultDate), new Date()) <= 0 ? true : false;
    });
  }

  showWinnerMarkPopup(list) {
    this.winnerDetails = list;
    if (this.winnerDetails.userName) {
      this.userName = this.winnerDetails.userName;
    } else {
      this.userNameRadio = true;
    }
    this.tabs.markWinner = true;
    this.tabIndex = 3;
  }

  markAsWinner() {
    const body = {
      candiateId: this.winnerDetails.id,
      id: this.candidateList.id,
      resultDate: this.constDetails.resultDate,
      username: this.userName,
      usernameChange: this.userNameRadio
    };
    this.service.markWinner(body, this.electionDetails.id).subscribe((res: any) => {
      this.notification.success('Success', 'Winner Marked Successfully');
      this.getElectionDetailsById();
      this.closeAllTabs();
      this.candidateAdded.emit();
    });
  }

  userRadioChange() {
    if (!this.userNameRadio) {
      this.userName = this.winnerDetails.userName;
    }
  }

  closePopupEvent() {
    this.closePopup.emit();
  }

  deleteCandidate(candidateId) {
    const body = {
      electionId: this.electionDetails.id,
      deatilId: this.candidateList.id,
      id: candidateId
    };
    this.service.deleteCandidateById(body).subscribe((res: any) => {
      this.notification.success('Success', 'Candidate Deleted Successfully!');
      this.getElectionDetailsById();
    });
  }
getCandidateTitle(){
  if(this.candidateId){
    return ((this.translate.getDefaultLang()=='mal') ? 'സ്ഥാനാർത്ഥിയെ  വ്യൂ ചെയ്യുക' : 'View Candidate')
  }else{
    return ((this.translate.getDefaultLang()=='mal') ? 'സ്ഥാനാർത്ഥിയെ  ചേർക്കുക' : 'Add Candidate')
  }
}
}
