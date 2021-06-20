import { Component, Inject, Input, OnInit } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { ElectionService } from "../../services/election.service";
import { FileServiceService } from "../../services/file-service.service";
import { TablescommonService } from "../../services/tablescommon.service";

@Component({
  selector: "tables-panel-member",
  templateUrl: "./panel-member.component.html",
  styleUrls: ["./panel-member.component.css"],
})
export class PanelMemberComponent implements OnInit {
  membersDtoList: any = null;
  fileDetails: any = null;
  fileResponse: any = null;
  @Input() currentPOC;
  @Input() fileId;
  currentUser: any = null;
  hide = true;
  userId;
  membersList = [];
  rbsPermission = {
    edit: false,
  };
  checked = {
    marked: false,
  };
  usersList: any = [];
  constructor(
    private electionService: ElectionService,
    private notification: NzNotificationService,
    private commonService: TablescommonService,
    private file : FileServiceService,
    @Inject("authService") private AuthService
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.currentUser.rbsPermissions);
  }

  markToPoc(list) {
    if (this.checked.marked) {
      this.userId = list.users.userId;
      this.membersList.push({'userId':this.userId , 'operationType': 'UPDATE'});
    } else {
      if ( this.membersList.length !== -1) {
        this.membersList = this.membersList.filter(r=>r.userId !== list.users.userId);
      }
    }
    if (list.pocMarked && list.pocMarked === "true") {
      this.checked.marked = true;
    } else {
      this.checked.marked = false;
    }
  }
  savePanelOfChairman() {
    if(this.membersList.length > 0){
    const body = {
      id: this.currentPOC.id,
      assemblyId: this.currentPOC.assemblyId,
      sessionId: this.currentPOC.sessionId,
      operationType: "UPDATE",
      membersList: this.membersList,
    };
    this.electionService.createPanelList(body).subscribe((res: any) => {
      this.notification.success("Success", "Successfully marked to POC!");
      this.getFileByElectionFileId();
    });
  } else {
    this.notification.warning("Warning", "Please mark atleast one user!");
  }
  }
  ngOnInit() {
    this.getRBSPermissions();
    this.getFileByElectionFileId();
  }
  getFileByElectionFileId(){
    this.file.getFileByElectionFileId(this.fileId, this.AuthService.getCurrentUser().userId).subscribe((res:any)=>{
      this.fileDetails = res;
      this.fileResponse = this.fileDetails.fileResponse;
      this.membersDtoList = this.fileDetails.memberListDtos;
    })
  }

  getRBSPermissions() {
    if (this.commonService.doIHaveAnAccess("PANEL_OF_CHAIRMAN", "UPDATE")) {
      this.rbsPermission.edit = true;
    }
  }
  editable() {
    this.hide 
    ? (this.hide = false)
     : (this.hide = true);
  }
}
