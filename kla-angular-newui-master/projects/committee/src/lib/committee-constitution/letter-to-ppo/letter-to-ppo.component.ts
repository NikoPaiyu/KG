import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';

@Component({
  selector: 'committee-letter-to-ppo',
  templateUrl: './letter-to-ppo.component.html',
  styleUrls: ['./letter-to-ppo.component.scss']
})
export class LetterToPpoComponent implements OnInit {
  letterContent;
  ppoCodes = [];
@Input() letterDetails;
@Input() userDetails;
@Input() fileDetails;
  constructor(private router: Router,
    private committeeService: CommitteecommonService
    ) { }

  ngOnInit() {
    console.log(this.letterDetails);
    if(!this.letterDetails.correspondenceId){
      this.getToCodesOfPPO();
    }
  }
  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "COMMITEE_REQUEST_NOMINEES",
          type: "COMMITTEE",
          fileId: this.letterDetails.fileId,
          businessReferId: this.letterDetails.id,
          businessReferType: "COMMITTEE",
          businessReferSubType: "COMMITTEE_NOMINEE",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.letterDetails.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.ppoCodes,
          // toDisplayName: "ALL PPO",
          toDisplayName: this.ppoCodes,
          toEditable : true,
          onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }
  getToCodesOfPPO(){
    let type = 'PPO';
    let ppoList = [];
    this.committeeService
    .getAllCode(type)
    .subscribe((Res:any) => {
     ppoList = Res;
     ppoList.forEach(element => {
       this.ppoCodes.push(element)
     });
    });
   
  }
  viewCorrespondence(id) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ]);
  }
  detailedView(id) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondencedetailview',
      id,
    ]);
  }
}
