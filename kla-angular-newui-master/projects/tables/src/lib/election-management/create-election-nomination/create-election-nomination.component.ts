import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-create-election-nomination',
  templateUrl: './create-election-nomination.component.html',
  styleUrls: ['./create-election-nomination.component.scss']
})
export class CreateElectionNominationComponent implements OnInit {
  @Input() nominationData: any;
  @Output() afterCreate = new EventEmitter<any>();
  currentAssemblySession: any = null;
  memberList: any = null;
  nominationForm: FormGroup;
  user: any;
  electionType: any = null;
  usersForNomination: any = null;
  permission = {
    selectNominatedBy: false
  };
  electionTypeEnglish: any = null;

  constructor(private electionService: ElectionService,
              private common: TablescommonService,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private fb: FormBuilder,
              public translate: TranslateService) {
                this.user = AuthService.getCurrentUser();
                this.common.setTablePermissions(this.user.rbsPermissions);
               }

  ngOnInit() {
    if (this.nominationData && this.nominationData.electionType === 'SPEAKER') {
      this.electionType = ' സ്പീക്കർ ';
      this.electionTypeEnglish = ' Speaker ';
    } else {
      this.electionType = ' ഡെപ്യൂട്ടി സ്പീക്കർ ';
      this.electionTypeEnglish = ' Deputy Speaker ';
    }
    this.getCurrentAssembly();
    // this.getMemberList();
    this.getUsersForNomination();
    this.getRbsPermissionsinList();
  }

  cancel() {
    this.afterCreate.emit(false);
  }
  create() {
     // tslint:disable-next-line: forin
     for (const i in this.nominationForm.controls) {
      this.nominationForm.controls[i].markAsDirty();
      this.nominationForm.controls[i].updateValueAndValidity();
    }
     if (this.nominationForm.valid) {
      const body = {
        consent: [
          {
            id: null,
            type: 'NOMINATED_BY',
            userId: this.nominationForm.value.nominatedById
          },
          {
            id: null,
            type: 'SUPPORTED_BY',
            userId: this.nominationForm.value.supporterId
          },
          {
            id: null,
            type: 'NOMINEE',
            userId: this.nominationForm.value.nomineeId
          }
        ],
        id: null,
        nomineeId: this.nominationForm.value.nomineeId,
        speakerElectionId: this.nominationData.id
       };
      this.electionService.createElectionNomination(body).subscribe((res: any) => {
        this.afterCreate.emit(true);
        this.notification.success(
          'Success',
          'Election Created succesfully!'
          );
      });
    }
  }

  getCurrentAssembly() {
    this.common.getCurrentAssemblyAndSession().subscribe(res => {
      this.currentAssemblySession = res;
    });
  }

  // getMemberList() {
  //   const body= ["MEMBER","ELECTED"]
  //   this.electionService.getMemberList(body).subscribe((res: any) => {
  //     this.memberList = res;
  //     this.createForm();
  //   });
  // }

  createForm() {
    this.nominationForm = this.fb.group({
      nomineeId: [null, Validators.required],
      nominatedById: [this.user.userId, Validators.required],
      supporterId: [null, Validators.required],
    });
  }

  returnMemberList() {
    return this.usersForNomination.filter(m => m.userId != this.nominationForm.value.supporterId);
  }

  getUsersForNomination() {
    this.electionService.getUserForNomination(this.nominationData.id).subscribe((res: any) => {
      this.usersForNomination = res;
      this.createForm();
    });
  }

  getRbsPermissionsinList() {
    if (this.common.doIHaveAnAccess('CREATE_ELECTION_NOMINATION', 'UPDATE')) {
      this.permission.selectNominatedBy = true;
    }
  }

}
