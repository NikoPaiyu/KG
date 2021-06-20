import { Component, OnInit } from "@angular/core";
import { member } from "../../shared/model/member";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { UserDetails } from "../../../user-management/shared/models/userDetails";
import { QuestionMenus } from "../../question.menus";
import { Location } from "@angular/common";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-question-mla-view",
  templateUrl: "./question-mla-view.component.html",
  styleUrls: ["./question-mla-view.component.scss"],
})
export class QuestionMlaViewComponent implements OnInit {
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private questionmlaviewservice: QuestionService,
    private questionMenus: QuestionMenus,
    public rbsService: QuestionRBSService
  ) {
    this.setRouterData();
  }
  radioValue;
  listOfMla = [];
  memberId;
  displayMladetail = [];
  mladetail = new UserDetails();
  dashBoardUrl;
  routeData;
  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.data;
  }
  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.route.params.subscribe((params) => {
      this.memberId = params["id"];
      this.getlistOfMla();
    });
  }

  getlistOfMla() {
    this.listOfMla = [];
    this.questionmlaviewservice.getMlaList().subscribe((user: any) => {
      this._formatDataForRendering(user);
    });
  }
  _formatDataForRendering(user) {
    const listArrr = [];
    const self = this;
    user.forEach(function (user) {
      const userelement = new UserDetails();
      if(user.details) {
        userelement.constituencyId = user.details.keralaConstituencyId;
        userelement.fullName = user.details.fullName;
        userelement.lastName = user.details.lastName;
        userelement.constituencyName = user.details.keralaConstituencyName;
        userelement.partyId = user.details.keralaPolicticalPartyid;
        userelement.memberGroup = self.rebuildPartySide(user.details.memberGroup);
        userelement.mobileNumber = user.details.mobileNumber;
        userelement.id = user.userId;
        userelement.email = user.details.email;
      }
      // userelement.partyId = self.rebuildPartyByName(user.details.keralaPolicticalPartyid);
      user.roles.forEach((element) => {
        userelement.role.push(element.roleId);
        userelement.roleDisplay.push(element.roleName);
      });

      listArrr.push(userelement);
    });
    this.listOfMla = listArrr;
    this.mladetail = this.listOfMla.find((x) => x.id == this.memberId);
    // for (let i = 0; i < this.listOfMla.length; ) {
    //   if (this.listOfMla[i].id == this.memberId) {
    //     this.mladetail.fullName = this.listOfMla[i].fullName;
    //     this.mladetail.constituencyName = this.listOfMla[i].constituencyName;
    //     this.mladetail.mobileNumber = this.listOfMla[i].mobileNumber;
    //     this.mladetail.email = this.listOfMla[i].email;
    //     this.mladetail.memberGroup = this.listOfMla[i].memberGroup;
    //     this.mladetail.roleDisplay = this.listOfMla[i].roleDisplay;
    //   }
    //   i++;
    // }
    console.log(this.mladetail);
  }

  rebuildPartySide(memberGroup) {
    if (memberGroup === "OPOSITION_PARTY") {
      return "Opposition";
    }
    return "Ruling";
  }
  clickBack() {
    this.router.navigate(["question-mlaListing"],
      {
        relativeTo: this.route.parent, state: {
          data: this.routeData
        }
      });
  }
}
