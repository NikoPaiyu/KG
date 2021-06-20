import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NzNotificationService } from "ng-zorro-antd";
import { electedMemeber } from "../shared/model/elected-member.model";
import { AssemblyElectionService } from "../shared/services/assembly-election.service";

@Component({
  selector: "tables-member-election-details",
  templateUrl: "./member-election-details.component.html",
  styleUrls: ["./member-election-details.component.css"],
})
export class MemberElectionDetailsComponent implements OnInit {
  @Input() electedMember: electedMemeber;
  @Output() onClose = new EventEmitter<any>();
  oathPopup = false;
  oathObj = null;
  oathList = [
    { name: "In the name of God", code: "IN_THE_NAME_OF_GOD", nameMl: 'ദൈവത്തിന്റെ നാമത്തിൽ' },
    { name: "In the name of Allah", code: "IN_THE_NAME_OF_ALLAH", nameMl: 'അല്ലാഹുവിന്റെ നാമത്തിൽ' },
    { name: "Solemnly Affirm", code: "SOLEMNLY_AFFIRM", nameMl: 'സഗൗരവും പ്രതിജ്ഞ' },
  ];
  selected;
  user;
  constructor(
    private service: AssemblyElectionService,
    @Inject("authService") private AuthService,
    private notification: NzNotificationService,
    public translate: TranslateService
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {}

  submitAOth() {
    let body = {
      constituenyId: this.oathObj.constituencyId,
      electionId: this.oathObj.electionId,
      formOfOath: this.selected,
      userId: this.user.userId,
    };
    this.service.submitOath(body).subscribe(res=>{
    this.onClose.emit(false);
     this.cancel();
     this.notification.create("success","Sucess","Form Submitted Successfully")
    });
  }
  cancel() {
    
    this.oathObj = null;
    this.oathPopup = false;
  }
  showOath(list) {
    this.oathObj = list;
    this.oathPopup = true;
  }
}
