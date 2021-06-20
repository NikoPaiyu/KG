import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { AssemblyElectionService } from '../shared/services/assembly-election.service';

@Component({
  selector: 'tables-assembly-election-view',
  templateUrl: './assembly-election-view.component.html',
  styleUrls: ['./assembly-election-view.component.scss']
})
export class AssemblyElectionViewComponent implements OnInit {
  electionDetails: any = null;
  search: any = null;
  electionId: any = null;
  today = new Date();
  constituencyList: any = null;
  electionDate: any = null;
  resultDate: any = null;
  constDetails: any = [];
  editMode = false;
  addConstituencyModal = false;
  candidateVisible = false;
  candidateList: any = null;
  details: any = null;
  tempElectionDetails: any = null;
  disabledResultDate: any;
  disabledElectionDate: any;

  constructor(private route: ActivatedRoute,
              private electionService: AssemblyElectionService,
              private notification: NzNotificationService,
              private datepipe: DatePipe,
              private router: Router) { }

  ngOnInit() {
    this.electionId = this.route.snapshot.params.id;
    if (this.electionId) {
      this.getElectionById();
    }
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  getElectionById() {
    this.electionService.getElectionById(this.electionId).subscribe((res: any) => {
      this.electionDetails = res;
      this.details = this.tempElectionDetails = this.electionDetails.details;
      this.details.forEach(c => {
        if (c.electionDate) {
          c.electionDate = parseISO(c.electionDate);
        }
        if (c.resultDate) {
          c.resultDate = parseISO(c.resultDate);
        }
      });
    });
  }

  searchList() {
    if (this.search) {
      this.details = this.tempElectionDetails.filter(x =>
        (x.constituency && x.constituency.toLowerCase().includes(this.search.toLowerCase())) ||
        (x.winnerName && x.winnerName.toLowerCase().includes(this.search.toLowerCase())));
    } else {
      this.details = this.tempElectionDetails;
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.getElectionById();
  }

  showAddModal() {
    this.addConstituencyModal = true;
  }

  cancelModal() {
    this.addConstituencyModal = false;
  }

  updateDetails() {
    this.details.forEach(element => {
      element.electionDate = this.datepipe
      .transform(element.electionDate, 'yyyy-MM-dd');
      element.resultDate = this.datepipe
      .transform(element.resultDate, 'yyyy-MM-dd');
    });
    this.electionService.addContituency(this.electionDetails.id, this.details).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Dates Updated Successfully!'
      );
      this.cancelEdit();
    });
  }

  showLinks(id) {
    this.details.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.details.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  deleteConstituency(constituency) {
    // this.details.find(x => x.id === id).delete = true;
    // this.details.forEach(element => {
    //   element.electionDate = this.datepipe
    //   .transform(element.electionDate, 'yyyy-MM-dd');
    //   element.resultDate = this.datepipe
    //   .transform(element.resultDate, 'yyyy-MM-dd');
    // });
    const body = {
      id: constituency.id,
      constituencyId: constituency.constituencyId,
      electionId: this.electionId
    };
    this.electionService.deleteConstituencyById(body).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Constituency Deleted Successfully!'
      );
      this.getElectionById();
    });
  }

  showCandidatePopup(list) {
    this.candidateVisible = true;
    this.candidateList = list;
  }

  cancelCandidatePopup() {
    this.candidateVisible = false;
    this.candidateList = null;
  }

  resultDateValidation(electionDate) {
    this.disabledResultDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, electionDate) <= 0);
    };
  }

  electionDateValidation(resultDate) {
    this.disabledElectionDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, resultDate) >= 0);
    };
  }

  goBack() {
    this.router.navigate(['business-dashboard/tables/assembly-election/list']);
  }

}
