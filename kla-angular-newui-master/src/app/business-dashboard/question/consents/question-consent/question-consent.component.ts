import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-question-consent",
  templateUrl: "./question-consent.component.html",
  styleUrls: ["./question-consent.component.scss"],
})
export class QuestionConsentComponent implements OnInit {
  currentUser: UserData;
  constructor(
    private router: Router,
    private questionSerivce: QuestionService,
    private auth: AuthService,
    private route: ActivatedRoute,
    public rbsService: QuestionRBSService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  RequestRecieved = [];
  RequestGrant: object = [];
  RequestAccept = [];
  ConsentsRequested: object = [];
  memeberDetails = [];
  isPpo = false;
  ppoId;
  memberMember = [];
  ppoPpo = [];
  ppoMember = [];
  showAccept = false;
  showRevoke = false;
  requestInfo = "Request From PPO";
  ngOnInit() {
    if (this.currentUser.authorities.includes("parliamentaryPartySecretary")) {
      this.isPpo = true;
      this.ppoId = this.currentUser.userId;
    }
    this.getAllRequestRecieved();
  }

  getAllRequestRecieved() {
    this.requestInfo = "Request From PPO";
    this.showRevoke = false;
    this.showAccept = true;
    this.memberMember = [];
    this.ppoMember = [];
    this.ppoPpo = [];
    this.questionSerivce
      .getListOfConsentRequests(this.auth.getCurrentUser().userId)
      .subscribe((res: any) => {
        this.RequestRecieved = res;
        this.RequestRecieved.forEach((element) => {
          if (element.type == "MEMBER") {
            this.setmemberMember(element);
          } else if (element.type == "PPO_MEMBER") {
            this.setppoMember(element);
          } else if (element.type == "PPO") {
            this.setPpo(element);
          }
        });
      });
  }

  getAllRequestGrant() {
    this.questionSerivce
      .getListOfConsentGiven(this.auth.getCurrentUser().userId)
      .subscribe((res) => {
        this.RequestGrant = res;
      });
  }

  getAllRequestAccept() {
    this.requestInfo = "Accepted PPO Request";
    this.showAccept = false;
    this.showRevoke = false;
    this.memberMember = [];
    this.ppoMember = [];
    this.ppoPpo = [];
    let memberData = [];
    this.questionSerivce
      .getAllConsentsAccepted(this.auth.getCurrentUser().userId)
      .subscribe((res: any) => {
        memberData = res;
        memberData.forEach((element) => {
          if (element.type === "MEMBER") {
            this.setmemberMember(element);
            this.showRevoke = true;
          } else if (element.type === "PPO_MEMBER") {
            this.setppoMember(element);
            this.showRevoke = (element.memberIdTo === this.auth.getCurrentUser().userId) ? true : false;            
          } else if (element.type === "PPO") {
            this.showRevoke = (element.memberIdFrom !== this.auth.getCurrentUser().userId) ? true : false;
            this.setPpo(element);
          }
        });
      });
  }
  getAllRequestSent() {
    this.requestInfo = "Request to PPO";
    this.memberMember = [];
    this.ppoMember = [];
    this.ppoPpo = [];
    let memberData = [];
    this.showRevoke = false;
    this.showAccept = false;
    this.questionSerivce
      .getAllRequestSent(this.auth.getCurrentUser().userId)
      .subscribe((res: any) => {
        this.ConsentsRequested = res;
        memberData = res;
        memberData.forEach((element) => {
          if (element.type == "MEMBER") {
            this.setmemberMember(element);
          } else if (element.type == "PPO_MEMBER") {
            this.setppoMember(element);
          } else if (element.type == "PPO") {
            this.setPpo(element);
          }
        });
      });
  }
  acceptRejectRevokeRequest(id, status) {
    this.questionSerivce
      .acceptRejectRevokeRequest(
        {
          status,
        },
        id
      )
      .subscribe((element) => {
        status === "REVOKED"
          ? this.getAllRequestAccept()
          : this.getAllRequestRecieved();
      });
  }
  onCreateClick() {
    this.router.navigate(["question-create"],
    {relativeTo: this.route.parent});
  }
  formatDate(input) {
    const datePart = input.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];
    return day + "/" + month + "/" + year;
  }
  goToRequestConsent(towhom) {
    this.router.navigate(["question-request-consent", towhom],
    {relativeTo: this.route.parent});
  }
  goToGrantConsent() {
    this.router.navigate(["question-grant-consent"],
    {relativeTo: this.route.parent});
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }

  setReceivedData(element) {
    this.memberMember.push(element);
  }

  setmemberMember(element) {
    if (
      element.memberIdFrom &&
      element.memberIdFrom != this.auth.getCurrentUser().userId
    ) {
      this.memberMember.push({
        memberTo: element.memberFrom,
        memberIdTo: element.memberIdFrom,
        fullName: element.memberFrom.details.fullName
          ? element.memberFrom.details.fullName
          : null,
        profilePhoto: element.memberFrom && element.memberFrom.details && element.memberFrom.details.profilePhoto
          ? element.memberFrom.details.profilePhoto
          : null,
        keralaConstituencyName: element.memberFrom.details
          .keralaConstituencyName
          ? element.memberFrom.details.keralaConstituencyName
          : null,
        keralaConstituencyId: element.memberFrom.details.keralaConstituencyId
          ? element.memberFrom.details.keralaConstituencyId
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    } else if (
      element.memberIdTo &&
      element.memberIdTo != this.auth.getCurrentUser().userId
    ) {
      this.memberMember.push({
        memberTo: element.memberTo,
        memberIdTo: element.memberIdTo,
        fullName: element.memberTo.details.fullName
          ? element.memberTo.details.fullName
          : null,
        profilePhoto: element.memberTo.details.profilePhoto
          ? element.memberTo.details.profilePhoto
          : null,
        keralaConstituencyName: element.memberTo.details.keralaConstituencyName
          ? element.memberTo.details.keralaConstituencyName
          : null,
        keralaConstituencyId: element.memberTo.details.keralaConstituencyId
          ? element.memberTo.details.keralaConstituencyId
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    }
  }

  setppoMember(element) {
    if (
      element.memberIdFrom &&
      element.memberIdFrom != this.auth.getCurrentUser().userId
    ) {
      this.ppoMember.push({
        memberTo: element.memberFrom,
        memberIdTo: element.memberIdFrom,
        // fullName:element.memberFrom.details.fullName,
        fullName: "Parlimentary Party Secretary",
        profilePhoto: element.memberFrom && element.memberFrom.details && element.memberFrom.details.profilePhoto
          ? element.memberFrom.details.profilePhoto
          : null,
        kerelaPoliticalPartyName: element.partyFrom.kerelaPoliticalPartyName
          ? element.partyFrom.kerelaPoliticalPartyName
          : null,
        kerelaPoliticalPartyId: element.memberFrom && element.memberFrom.details
          .keralaPolicticalPartyid
          ? element.memberFrom.details.keralaPolicticalPartyid
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    } else if (
      element.memberIdTo &&
      element.memberIdTo != this.auth.getCurrentUser().userId
    ) {
      this.ppoMember.push({
        memberTo: element.memberTo,
        memberIdTo: element.memberIdTo,
        fullName: element.memberTo.details.fullName
          ? element.memberTo.details.fullName
          : null,
        profilePhoto: element.memberTo.details.profilePhoto
          ? element.memberTo.details.profilePhoto
          : null,
        kerelaPoliticalPartyName: element.memberTo.details
          .keralaConstituencyName
          ? element.memberTo.details.keralaConstituencyName
          : null,
        kerelaPoliticalPartyId: element.memberTo.details.keralaConstituencyId
          ? element.memberTo.details.keralaConstituencyId
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    }
  }

  setPpo(element) {
    if (
      element.memberIdFrom &&
      element.memberIdFrom != this.auth.getCurrentUser().userId
    ) {
      this.ppoPpo.push({
        memberTo: element.partyFrom,
        memberIdTo: element.partyIdFrom,
        fullName: "Parlimentary Party Secretary",
        profilePhoto: null,
        kerelaPoliticalPartyName: element.partyFrom.kerelaPoliticalPartyName
          ? element.partyFrom.kerelaPoliticalPartyName
          : null,
        kerelaPoliticalPartyId: element.partyFrom.kerelaPoliticalPartyId
          ? element.partyFrom.kerelaPoliticalPartyId
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    } else if (
      element.partyIdTo &&
      element.partyIdTo != this.auth.getCurrentUser().userId
    ) {
      // else if(element.memberIdTo && element.memberIdTo != this.auth.getCurrentUser().userId){
      this.ppoPpo.push({
        memberTo: element.memberTo,
        memberIdTo: element.partyIdTo,
        fullName: "Parlimentary Party Secretary",
        profilePhoto: null,
        kerelaPoliticalPartyName: element.partyTo.kerelaPoliticalPartyName
          ? element.partyTo.kerelaPoliticalPartyName
          : null,
        kerelaPoliticalPartyId: element.partyTo.kerelaPoliticalPartyId
          ? element.partyTo.kerelaPoliticalPartyId
          : null,
        fromDate: element.fromDate,
        id: element.id,
        onlineConsentRequired: element.onlineConsentRequired,
        status: element.status,
        toDate: element.toDate,
      });
    }
  }
}
