import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { AssemblyElectionService } from '../../services/assembly-election.service';

@Component({
  selector: 'tables-add-constituency',
  templateUrl: './add-constituency.component.html',
  styleUrls: ['./add-constituency.component.scss']
})
export class AddConstituencyComponent implements OnInit {
  @Output() hidePopup = new EventEmitter<any>();
  @Output() electionCreated = new EventEmitter<any>();
  selectedConstituencies: any = [];
  constituencyList: any = [];
  @Input() electionDetails;
  today = new Date();
  electionDate: any = null;
  resultDate: any = null;
  disabledResultDate: any = null;
  disabledElectionDate: any = null;
  allChecked = false;

  constructor(private electionService: AssemblyElectionService,
              private notification: NzNotificationService) {
  }

  ngOnInit() {
    this.getConstituencyList();
  }

  // disabledDate = (current: Date): boolean => {
  //   return differenceInCalendarDays(current, this.today) < 0;
  // }

  addConstituency() {
    const body = this.selectedConstituencies.map((x) => (
      {
      constituencyId: x.kerelaContituencyId,
      delete: true,
      electionId: this.electionDetails.id,
      electionDate: this.electionDate,
      resultDate: this.resultDate
      }
    ));
    this.electionService.addContituency(this.electionDetails.id, body).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Constituencies Added Successfully!'
      );
      this.hidePopup.emit();
      this.electionCreated.emit();
    });
  }

  handleCancel() {
    this.hidePopup.emit();
  }

  getConstituencyList() {
    const body = {
     constituency: true,
     party: false,
     memberDesignation: false,
     section: false,
     officeDesignation: false,
     rules: false,
     directions: false,
     partyFront: false,
     country: false,
     state: false,
     district: false,
     taluk: false,
    };
    this.electionService.getAllList(body).subscribe((res: any) => {
      if (this.electionDetails.details.length > 0) {
        this.constituencyList = res.constituency.filter(c => !this.electionDetails.details.map(x => x.constituencyId).includes(c.kerelaContituencyId));
      } else {
        this.constituencyList = res.constituency;
      }
    });
  }

  resultDateValidation() {
    this.disabledResultDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, this.electionDate) <= 0);
    };
  }

  electionDateValidation() {
    this.disabledElectionDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, this.resultDate) >= 0);
    };
  }

  selectAllConstituencies() {
    if (this.allChecked) {
      this.selectedConstituencies = this.constituencyList;
    }
  }

  checkAllSelected() {
    if (this.selectedConstituencies.length !== this.constituencyList.length) {
      this.allChecked = false;
    } else {
      this.allChecked = true;
    }
  }

}
