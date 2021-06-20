import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';
import { AttachmentConfig } from '../../field.interface';
import { noticeDescription, noticePpoDescription } from '../../models/pmbr-resolution-model';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-create-lotting-notice',
  templateUrl: './create-lotting-notice.component.html',
  styleUrls: ['./create-lotting-notice.component.css']
})
export class CreateLottingNoticeComponent implements OnInit {

  @Input() noticeDetails;
  @Output() noticeCreateOrCancel = new EventEmitter<boolean>();
  dateFormat = "dd-MM-yyyy";
  createNoticeForm: FormGroup
  uploadURL = this.service.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  fileList: any = [];
  attachmentDto: AttachmentConfig[] = [];
  isVisible: boolean;
  isEdit: boolean = false;
  listOfMembers = [];
  filteredMembers = [];
  currentMembers = [];
  party: any;
  currentUser: any;
  memberIds: any = [];
  tempFilteredMembers = [];
  addMemberDetails;
  mla;
  presentationDates;
  presentationAllowedDates: any = [];
  constructor(private formBuilder: FormBuilder,
    private service: PmbrResolutionService,
    private notify: NzNotificationService,
    private pmbrCommon: PmbrCommonService,
    private pmbrResolution: PmbrResolutionService,
    @Inject('authService') private AuthService,) {
    this.currentUser = AuthService.getCurrentUser();
    if (this.currentUser.authorities[0] === 'parliamentaryPartySecretary') {
      this.addMemberDetails = true;
    }
    if (this.currentUser.authorities[0] === 'MLA') {
      this.mla = true;
    }
  }

  ngOnInit() {
    this.initiateForm();
    this.getAllMembers();
    this.getPresentationDates();
    // this.replaceNoticeDescription();
  }
  initiateForm() {
    this.createNoticeForm = this.formBuilder.group({
      id: [null],
      subject: [null, Validators.required],
      description: this.mla?noticeDescription: noticePpoDescription,
      attachmentDto: [[]],
      assemblyId: 0,
      memberIds: [null],
      noticeType: "PMR_LOT_REQUEST",
      ownerId: null,
      pmResolutionId: 0,
      resolutionDate: [null, Validators.required],
      sessionId: 0,
      stage: null,
      status: null,
      presentationDate: null,
      memberList: this.formBuilder.array([]),
    })
  }
  getAllMembers() {
    this.pmbrCommon.getMemberListByPPO(this.currentUser.userId).subscribe(data => {
      this.listOfMembers = data as any;
      this.filteredMembers = this.tempFilteredMembers = this.listOfMembers.filter((x) => x.details.memberGroup !== 'TREASURY_BENCH');
      if (this.noticeDetails) {
        this.isEdit = true;
        this.getNoticeById(this.noticeDetails.noticeId);
      }
    });

  }
  saveNotice() {
    if (!this.validateMemberList()) {
      this.notify.warning('Warning', 'Save all members!');
      return;
    }
      const attachment = this.attachmentDto.map((x) => ({
        name: x.name,
        attachmentUrl: x.attachmentUrl,
        type: x.type,
      }));
      this.createNoticeForm.get('attachmentDto').setValue(attachment);
      this.createNoticeForm.get('ownerId').setValue(this.currentUser.userId);
      this.service.saveNotice(this.createNoticeForm.value).subscribe(res => {
        if (res) {
          if (!this.isEdit) {
            this.notify.success("Success", "Notice Created Succesfully");
          } else { this.notify.success("Success", "Notice Updated Succesfully"); }
          this.noticeCreateOrCancel.emit(true);
        }
        this.noticeDetails = res;
      });
  }
  validateMemberList() {
    if (this.mla) {
      this.memberIds.push(this.currentUser.userId.toString());
      this.createNoticeForm.get('memberIds').setValue(this.memberIds);
      return true;
    }
    if (!this.memberIds.length) {
      return false;
    }
    if (this.memberIds.length === this.createNoticeForm.value.memberList.length) {
      return true;
    }
    if (this.createNoticeForm.value.memberList[this.createNoticeForm.value.memberList.length - 1].memberId !== null) {
      return false;
    }

    return true;
  }
  handleChange(info: UploadChangeParam): void {
    let fileType = 'ATTACHMENT';
    let fileName = '';
    const fileList = [...info.fileList];
    this.fileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.fileList.push({
          name: (fileName) ? fileName : info.file.name,
          attachmentUrl: info.file.response.body,
          type: fileType,
        });
      }
    }
    this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
  attachFiles() {
    this.isVisible = true;
  }
  onCancel() {
    this.noticeCreateOrCancel.emit(false)
  }
  getNoticeById(noticeId) {
    this.service.getNoticeById(noticeId).subscribe((res: any) => {
      if (res) {
        this.createNoticeForm.patchValue({
          description: res.description,
          subject: res.subject,
          assemblyId: res.assemblyId,
          id: res.id,
          memberIds: res.memberIds,
          noticeType: res.noticeType,
          ownerId: res.ownerId,
          pmResolutionId: res.pmResolutionId,
          resolutionDate: res.resolutionDate,
          sessionId: res.sessionId,
          stage: res.stage,
          status: res.status,
          presentationDate: res.presentationDate
        });
        for (let i = 0; i <= this.filteredMembers.length; i++) {
          if (this.filteredMembers[i]) {
            if (res.memberIds.includes(this.filteredMembers[i].userId.toString())) {
              this.formArrForMembers.push(this.formBuilder.group({
                id: null,
                memberId: this.filteredMembers[i],
                operationType: ['SAVE']
              }))
            }
          }
        }
        this.memberIds = this.createNoticeForm.value.memberIds;
      }
    });
  }
  deleteMember(index, event) {
    let controls = event.value;
    if (controls.id > 0) {
      controls.operationType = 'DELETE';
    } else {
      this.formArrForMembers.removeAt(index);
    }
    this.memberIds.pop(index);
    // this.memberIds = this.createNoticeForm.value.memberList.map( x=> x.memberId.id);
    this.createNoticeForm.get('memberIds').setValue(this.memberIds);
  }
  saveMember(index, event) {
    this.memberIds[index] = event.value.memberId.userId.toString();
    // this.memberIds = this.createNoticeForm.value.memberList.map( x=> x.memberId.id);
    this.createNoticeForm.get('memberIds').setValue(this.memberIds);
  }
  addMember() {
    this.formArrForMembers.push(this.initRowsForMembers());
    this.filteredMembers = this.tempFilteredMembers.filter(x => !this.memberIds.includes(x.userId.toString()));
  }
  get formArrForMembers() {
    return this.createNoticeForm.get("memberList") as FormArray;
  }
  initRowsForMembers() {
    return this.formBuilder.group({
      id: null,
      memberId: [null],
      operationType: ['SAVE']
    });
  }
  cancel() { }
  getPresentationDates() {
    this.service.getActivePresentationDates().subscribe(res => {
      this.presentationDates = res;
      this.presentationAllowedDates = (current: Date): boolean => {
        const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
        return !this.presentationDates.find(item => item === todayDate);
      };
    });

  }

  replaceNoticeDescription(event) {
    const replaceContent = this.service.replaceNoticeDescription(event, this.mla);
    this.createNoticeForm.get('description').setValue(replaceContent);
  }
}
