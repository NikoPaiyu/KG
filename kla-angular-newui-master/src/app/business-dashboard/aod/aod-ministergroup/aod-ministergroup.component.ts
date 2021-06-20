import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { AodService } from '../shared/service/aod.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MinisterGroupService } from '../shared/service/minister-group.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';


@Component({
  selector: 'app-aod-ministergroup',
  templateUrl: './aod-ministergroup.component.html',
  styleUrls: ['./aod-ministergroup.component.scss'],
})
export class AodMinistergroupComponent implements OnInit {
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  public options = {
    fixedDepth: true,
    maxDepth: 1
  } as NestableSettings;
  selectedMinisters = [];
  showControls = true;
  ministerPortfolioData = [];
  filteredPortfolio = [];
  ministerGroupDetails = [];
  name:any;
  selectedPriority = new FormControl(null);
  encodedreturnUrl = null;
  ministerMasterId = null;
  isEdited = false;
  ministerGroup = {
    id: null,
    currentAssignee: false,
    ministerMasterId: null,
    groupList: []
  };
  currentIndex: number;
  previousIndex: number;
  data: any;
  constructor(
    private aodService: AodService,
    public minister: MinisterGroupService,
    private auth: AuthService,
    private notify: NotificationCustomService,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getAllministers();
    this.data = this.encodedreturnUrl = this.route.snapshot.params.url;
    if (this.data === 'approved') {
      this.getapprovedMinisterGroups(false);
    } else {
      this.getAllMinisterGroups();
    }
    this.minister.getMgPermissions(this.auth.getCurrentUser().userId);
  }
  // get all ministergroupministerGroups
  getAllMinisterGroups() {
    const userId = this.auth.getCurrentUser().userId;
    if (userId) {
      this.minister.getPendingMinisterGroups(userId).subscribe(res => {
        this.ministerGroup = res;
        this.showControls = true;
        this.ministerMasterId = res.id;
        this.ministerGroup.ministerMasterId = res.id;
        this.ministerGroupDetails = res.groupList;
        if (this.ministerGroupDetails.length < 1) {
          this.getapprovedMinisterGroups(true);
          this.ministerGroup.currentAssignee = true;
        }
        this.refreshPortfolioList();
      });
    }
  }
  // get approved ministergroups
  getapprovedMinisterGroups(hide) {
    this.minister.getApprovedMinisterGroup().subscribe(res => {
      this.ministerGroup = res;
      this.ministerMasterId = res.id;
      this.ministerGroup.ministerMasterId = null;
      this.ministerGroupDetails = res.groupList;
      if (hide) {
        this.showControls = true;
        this.isEdited = false;
        this.ministerGroup.currentAssignee = true;
      }
      if (this.ministerGroupDetails.length < 1) {
        this.ministerGroup.currentAssignee = true;
      }
      this.refreshPortfolioList();
    });
  }
  // get all portfolios
  getAllministers() {
    this.aodService
      .getAllministers()
      .subscribe((res) => {
        this.ministerPortfolioData = res;
        this.filteredPortfolio = this.ministerPortfolioData;
        this.refreshPortfolioList();
      });
  }
  // delete minister group
  deleteMinisterGroup(i) {
    this.ministerGroupDetails.splice(i, 1);
    this.isEdited = true;
    this.refreshPortfolioList();
  }
  // remove portfolio
  removePortfolio(groupIndex, itemIndex) {
    if (this.ministerGroup.currentAssignee) {
      if (this.ministerGroupDetails && this.ministerGroupDetails.length > groupIndex) {
        if (this.encodedreturnUrl) {
          if (this.ministerGroupDetails[groupIndex].portfolios.length > 2) {
            this.ministerGroupDetails[groupIndex].portfolios.splice(itemIndex, 1);
          }
        } else {
          this.ministerGroupDetails[groupIndex].portfolios.splice(itemIndex, 1);
        }
        if (this.ministerGroupDetails[groupIndex].portfolios.length < 1) {
          this.deleteMinisterGroup(groupIndex);
        }
        this.isEdited = true;
      }
      this.refreshPortfolioList();
    }
  }
  // mla check
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes('MLA');
  }
  // add portfolio to the group
  addMinister(checked, data) {
    if (checked) {
      this.selectedMinisters.push(data);
    } else {
      const ministerIds = this.selectedMinisters.map(x => x.id);
      if (ministerIds && ministerIds.length > 0) {
        const index = ministerIds.indexOf(data.id);
        this.selectedMinisters.splice(index, 1);
      }
    }
  }
  // refresh portfolio list
  refreshPortfolioList() {
    const ministerDetails = this.ministerGroupDetails.map(x => x.portfolios);
    if (ministerDetails && this.ministerPortfolioData) {
      const merged = [].concat.apply([], ministerDetails);
      this.filteredPortfolio = this.ministerPortfolioData
        .filter(x => !merged.some(d => d.id === x.id));
    }
  }
  // create minister group
  createMinisterGroup() {
    if (this.selectedMinisters.length > 0) {
      this.ministerGroupDetails.push({
        priority: null,
        portfolios: this.selectedMinisters
      });
    }
    this.selectedMinisters = [];
    this.refreshPortfolioList();
  }
  addToMinisterGroup() {
    if (this.selectedPriority.value != null) {
      const priority = Number(this.selectedPriority.value);
      this.ministerGroupDetails[priority].portfolios = this.ministerGroupDetails[priority].portfolios.concat(this.selectedMinisters);
    }
    this.selectedPriority.reset();
    this.selectedMinisters = [];
    this.refreshPortfolioList();
  }
  // save minister group
  saveMinisterGroup() {
    const data = this.ministerGroupDetails.map((x, i) => {
      x.priority = i + 1;
      return x;
    });
    this.ministerGroup.groupList = data;
    this.minister.saveMinisterGroup(this.ministerGroup).subscribe((res: any) => {
      this.notify.showSuccess('Success', 'Minister group saved successfully');
      this.ministerGroup.ministerMasterId = res.id;
      this.isEdited = false;
    });
  }
  goToFileList() {
    this.router.navigate([atob(this.encodedreturnUrl)]);
  }
  // submit minister group
  submitMinisterGroup() {
    const body = {
      fromGroup: this.auth.getCurrentUser().authorities[0]
    };
    this.minister.forwardMinisterGroup(this.ministerGroup.ministerMasterId, body).subscribe(res => {
      this.ministerGroup = res;
      this.notify.showSuccess('Success', 'Minister group submitted successfully');
    });
  }
  // approve minister group
  approveMinisterGroup() {
    const body = {
      fromGroup: this.auth.getCurrentUser().authorities[0]
    };
    this.minister.approveMinisterGroup(this.ministerGroup.ministerMasterId, body).subscribe(res => {
      this.ministerGroup = res;
      this.notify.showSuccess('Success', 'Minister group Approved successfully');
    });
  }
 
  drag(ministerGroupDetails) {
    this.name = moveItemInArray(this.ministerGroupDetails,this.previousIndex,this.currentIndex);
  }
}
