import { Component, OnInit, OnDestroy } from '@angular/core';
import { VotingService } from "../../../dashboard/voting/shared/services/voting.service";
import { Router } from "@angular/router";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NzModalService } from 'ng-zorro-antd';
import { LobService } from '../../lob/shared/services/lob.service';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-initiate-vote',
  templateUrl: './initiate-vote.component.html',
  styleUrls: ['./initiate-vote.component.scss']
})
export class InitiateVoteComponent implements OnInit, OnDestroy {
  currentDayList = [];
  selectedvalue;
  textInput;
  validateForm: FormGroup;
	date = new Date();
  deadline;
  inputValue;
  resultDeadline = Date.now();
  castingVoteComplete = false;
  initiationResult;
  voteEventId;
  business_Id;
  businessId
  id;
  public voteStarted = false;
  constructor(
    private router: Router,
    private voteService: VotingService,
    private notify: NotificationCustomService,
    private modalService: NzModalService,
    private lobService: LobService,
    private fb: FormBuilder,
    private translate: TranslateService,
    
  ) { 

   // console.log(this.inputValue)
  }


  ngOnInit() {
    
    this.modalService.closeAll();
    this.getFromLocalStorageAndSetData();
  //  this.getLobListOnlyByDate(this.date);
    this.getCurrentDayList()
    this.createForm();
    // this.validateForm.get('inputValue').setValue (this.translate.instant('dashboard.vote.result'));
    // this.validateForm.get('inputValue').setValue("നിലവിലെ ബിസിനസ്സിനായി വോട്ടുചെയ്യുക")
  }


  createForm() {
    this.validateForm = this.fb.group({
      businessName: ['', [Validators.required]],
      inputValue: ['', [Validators.required]]
    
    });
  }
  selectedOption(id){

  // this.validateForm.value.businessName=this.selectedvalue;
  console.log(id);
  this.id=id;
   this.validateForm.value.inputValue=this.textInput;
  }
  inputChange(){
    this.textInput=this.validateForm.value.inputValue;
   // console.log(this.textInput)
    
  }
  startVoting() {
  
  
    if (this.voteStarted) {
      return this.notify.showWarning(
        "Warning",
        "Voting is already in progress..!"
      );
    }
    this.voteService
      .initiateVotingByBusinessController(this.id,this.validateForm.value.inputValue)
      .subscribe((res: any) => {
        this.initiationResult = res;
        localStorage.setItem("voteInitiation", JSON.stringify(this.initiationResult));
        localStorage.setItem("voteStartTime", Date.now().toString())
        localStorage.setItem("votingStarted", "true")
        this.deadline = Date.now() + res.time * 1000;
        this.resultDeadline = Date.now() + res.resultDisplayTime * 1000;
        this.voteEventId = res.id;
        this.voteStarted = true;
      });
  }

  onCounterFinish() {
    this.castingVoteComplete = true;
    this.hideElement("startVote");
    this.showElement("voteComplete");

  }
  hideElement(elementId) {
    let element = document.getElementById(elementId);
    element.classList.add("displayhide")
  }
  showElement(elementId) {
    let element = document.getElementById(elementId);
    element.classList.remove("displayhide")
  }
  onResultCounterFinish() {
    this.castingVoteComplete = false;
    this.hideElement("voteComplete");
    this.showElement("startVote");
    this.publishVoteResult();

  }

  publishVoteResult() {
    this.voteService.publishVote(this.voteEventId).subscribe(res => {
      localStorage.removeItem("voteInitiation");
      localStorage.removeItem("voteStartTime")
      localStorage.removeItem("votingStarted")
      this.voteStarted = false;
      this.notify.showSuccess("Results Published.", "");
    });
  }

  getFromLocalStorageAndSetData() {
    this.initiationResult = localStorage.getItem("voteInitiation") ? JSON.parse(localStorage.getItem("voteInitiation")) : "";
    this.voteStarted = localStorage.getItem("votingStarted") == "true" ? true : false;
    if (this.voteStarted && this.initiationResult) {
      this.voteEventId = this.initiationResult.id;
      let currentTIme = Date.now();
      let time = localStorage.getItem("voteStartTime");
      this.deadline = Number(time) + this.initiationResult.time * 1000;
      this.resultDeadline = Number(time) + this.initiationResult.resultDisplayTime * 1000;

      if (this.resultDeadline < currentTIme) {
        this.showResultShowConfirm();
      }
      else if (currentTIme > this.deadline && currentTIme <= this.resultDeadline) {
        this.hideElement("startVote");
        this.showElement("voteComplete");
      }


    }
  }

  showResultShowConfirm() {
    this.modalService.confirm({
      nzTitle: 'Previous vote result is not published. Do you want to do it now?',
      nzBodyStyle: { "margin": "20px" },
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.publishVoteResult(),
      nzCancelText: 'No',
      nzOnCancel: () => {
        localStorage.removeItem("voteInitiation");
        localStorage.removeItem("voteStartTime")
        localStorage.removeItem("votingStarted")
        this.voteStarted = false;
      }
    });
  }
  ngOnDestroy() {
    this.modalService.closeAll();
  }

  getCurrentDayList() {
		this.lobService.getCurrentDayList().subscribe((res: any) => {
      this.currentDayList = res;
      console.log(this.currentDayList)
		});
	}

	// getLobListOnlyByDate(date) {
	// 	if (date) {
	// 		this.lobService.getLobListOnlyByDatebusiness(date).subscribe((res: any) => {
  //       this.currentDayList = res;
  //       console.log(this.currentDayList)

	// 		});
	// 	} else {
  //     this.currentDayList = [];
  //     console.log(this.currentDayList)

	// 	}
	// }


}
