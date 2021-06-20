import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StmtDemandsGrantsService } from '../../../../shared/services/stmt-demands-grants.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../../../shared/services/file-service.service';

@Component({
  selector: 'budget-prepare-bit-list',
  templateUrl: './prepare-bit-list.component.html',
  styleUrls: ['./prepare-bit-list.component.css']
})
export class PrepareBitListComponent implements OnInit {
  urlParams;
  @Input() bitListMasterId;
  @Input() isFileView;
  @Input() sdfgId;
  constructor(private sdfg: StmtDemandsGrantsService, 
    private route: ActivatedRoute, 
    private notify: NzNotificationService,
    private file: FileServiceService,
    private router: Router,
    @Inject('authService') public auth,
  ) {
    if(this.router.getCurrentNavigation()) {
      this.urlParams = this.router.getCurrentNavigation().extras.state;
    }
   }
  cosDate;
  showHeadPopUp = false;
  sdfgList;
  bitListData = {
    id: null, cosdates: [], sdfgId: null, fileId:null, demandsList: [], listToAddHeads: [], submitDto:
    {
      cosDate: null,
      demandDraftId: null,
      demandMasterIds: [],
      sdfgId: null
    }
  };
  listToAddHeads = {
    previousUnselectedHeads: { dates: [], datas: [] },
    upcomingHeads: { dates: [], datas: [] }
  }
  ngOnInit() {
    this.getAllPublishedSDFG();
  }
  getAllPublishedSDFG() {
    this.sdfg.getAllPublishedSDFG().subscribe((res: any) => {
      if (res && res.content.length == 0) {
        this.notify.info("Info", "No Published SDFG / VOA Found");
        return;
      }
      this.sdfgList = res.content;
      this.setParams();
    });
  }
  setParams() {
    this.route.params.subscribe((params) => {
      if (params["id"]){
        this.bitListData.id = params["id"];
      }
      if (this.urlParams) {
          this.getSDFGByLineId(this.urlParams)
      }
      if(this.bitListMasterId && this.sdfgId) { 
        this.bitListData.id = this.bitListMasterId; 
        this.getSDFGByLineId({sdfgId: this.sdfgId, fileId: null})
      }
    });
  }
  getSDFGByLineId(sdfgDto) {
    this.bitListData.sdfgId = (sdfgDto.sdfgId) ? sdfgDto.sdfgId : null;
    this.bitListData.fileId = (sdfgDto.fileId) ? sdfgDto.fileId : null;
    if(this.bitListData.sdfgId) {
      this.getCosDatesForSdfgId();
    }
  }
  getCosDatesForSdfgId() {
    this.sdfg.getCosDatesForSdfgId(this.bitListData.sdfgId).subscribe((dates) => {
      this.bitListData.cosdates = dates;
    })
  }
  fitData(e) {
    this.clearDatas();
    this.bitListData.submitDto.cosDate = e.value;
    this.bitListData.submitDto.demandDraftId = e.key;
    this.bitListData.submitDto.sdfgId = this.bitListData.sdfgId;
    this.getDemandMasterById();
  }
  getDemandMasterById() {
    this.sdfg.getDemandMasterById(this.bitListData.submitDto.demandDraftId).subscribe((res) => {
      if (res) {
        this.bitListData.demandsList = res;
      }
    })
  }
  cancelDemand() {

  }
  clearDatas() {
    this.bitListData.demandsList =  [],
    this.bitListData.listToAddHeads = [],
    this.bitListData.submitDto = 
      {
        cosDate: null,
        demandDraftId: null,
        demandMasterIds: [],
        sdfgId: null
      }
    this.listToAddHeads = {
      previousUnselectedHeads: { dates: [], datas: [] },
      upcomingHeads: { dates: [], datas: [] }
    }
  }
  createDemand() {
    this._setSelectedDemands();
    if (this.bitListData.submitDto.demandMasterIds.length == 0) {
      this.notify.warning('Warning', 'Please select atleast one !!');
      return;
    }
    this.sdfg.createBitList(this.bitListData.submitDto).subscribe((res) => {
      this.notify.success('Success', 'Saved Successfully');
    });

  }
  _setSelectedDemands() {
    this.bitListData.demandsList.forEach(e => {
      if (e.isSelectedForBitList) {
        this.bitListData.submitDto.demandMasterIds.push(e.id);
      }
    });
  }
  showHead() {
    this.sdfg.listToAddHeads(this.bitListData.submitDto.demandDraftId).subscribe((res) => {
      if (res) {
        this.bitListData.listToAddHeads = res;
        if (res.previousUnselectedHeads.length > 0) {
          let dates = [];
          res.previousUnselectedHeads.forEach(e => {
            dates.push(e.cosDate);
          });
          this.listToAddHeads.previousUnselectedHeads.dates = dates.filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
          });
        }
        if (res.upcomingHeads.length > 0) {
          let dates = [];
          res.upcomingHeads.forEach(e => {
            dates.push(e.cosDate);
          });
          this.listToAddHeads.upcomingHeads.dates = dates.filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
          })
        }
        this.showHeadPopUp = true;
      }
    });
  }
  filterpreviousDemandDta(e) {
    if (this.bitListData.listToAddHeads && this.bitListData.listToAddHeads['previousUnselectedHeads']) {
      this.bitListData.listToAddHeads['previousUnselectedHeads'].forEach(list => {
        if (list.cosDate == e) {
          this.listToAddHeads.previousUnselectedHeads.datas = list.demandMasterDtos;
        }
      });
    }
  }
  filterUpcomingDemandDta(e) {
    if (this.bitListData.listToAddHeads && this.bitListData.listToAddHeads['upcomingHeads']) {
      this.bitListData.listToAddHeads['upcomingHeads'].forEach(list => {
        if (list.cosDate == e) {
          this.listToAddHeads.upcomingHeads.datas = list.demandMasterDtos;
        }
      });
    }
  }
  resubmitFile() {
    let reqBody = {
      bitListMasterId: this.bitListData.id,
      fileForm: {
        fileId: this.bitListData.fileId,
        activeSubTypes: ['BUDGET_BIT_LIST_PREPARATION'],
        type: 'BUDGET',
        userId: this.auth.getCurrentUser().userId,
      },
    };
    this.file.reSubmitFile(reqBody).subscribe((Res: any) => {
     this.notify.success('Success', ' Resubmitted Successfully');
     if(Res.fileResponse && Res.fileResponse.fileId) {
      this.router.navigate(['business-dashboard/budgets/file-view', Res.fileResponse.fileId]);
      return;
     }
     this.router.navigate(['business-dashboard/budgets/files/bs-files']);
   });
  }
  setlistToAddHeads() {
    let arr = [];
    if(this.listToAddHeads.previousUnselectedHeads) {
      if(this.listToAddHeads.previousUnselectedHeads.datas.length > 0) {
        this.listToAddHeads.previousUnselectedHeads.datas.forEach(d1 => {
          if(d1.isSelectedForBitList) {
            arr.push(d1);
          }
        });
      }
    }
    if(this.listToAddHeads.upcomingHeads) {
      if(this.listToAddHeads.upcomingHeads.datas.length > 0) {
        this.listToAddHeads.upcomingHeads.datas.forEach(d2 => {
          if(d2.isSelectedForBitList) {
            arr.push(d2);
          }
        });
      }
    }
    if(arr.length > 0) {
      this.bitListData.demandsList = this.bitListData.demandsList.concat(arr)
      this.showHeadPopUp = false
    }
  }
}
