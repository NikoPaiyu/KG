import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { IAssemblySessionResponseDto, ISession, IAssemblySession, IDocumentTypeResponseDto, IDocumentSubTypeResponseDto, IKlaSectionResponseDto, IDepartmentResponseDto, IAccessLevelResponseDto } from '../shared/models/digitizationmodel';
import { DigitisationapiService } from '../shared/services/digitisationapi.service';
import { DigitisationprocessService } from '../shared/services/digitisationprocess.service';

@Component({
  selector: 'digitisation-create-digitisation',
  templateUrl: './create-digitisation.component.html',
  styleUrls: ['./create-digitisation.component.css']
})
export class CreateDigitisationComponent implements OnInit {
  public digitisationForm: FormGroup;
  assemblyList: IAssemblySession[];
  sessionList: ISession[];
  documentType: IDocumentTypeResponseDto[] = [];
  documentSubType: IDocumentSubTypeResponseDto[];
  klaSectionList: IKlaSectionResponseDto[] = [];
  fileUploadUrl = this.digitzationApiService.getFileUploadUrl();
  departmentList: IDepartmentResponseDto[] = [];
  accesLevelList: IAccessLevelResponseDto[] = [];
  tags = [];
  inputVisible = false;
  inputValue = '';
  fileList: any = [];
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  constructor(private digitisationProcessService: DigitisationprocessService, private digitzationApiService: DigitisationapiService, private notification: NzNotificationService) { }

  ngOnInit() {
    this.pageLoadFunctions();
  }

  createDigitsationForm() {
    this.digitisationForm = this.digitisationProcessService.createDigitisationForm();
  }

  getAssemblyList() {
    this.digitzationApiService.getAllAssemblyandSesssion().subscribe((res: IAssemblySessionResponseDto) => {
      this.assemblyList = res.assemblySession;
    })
  }

  getSessionList() {
    const assemblyId = this.digitisationForm.value.assemblyId;
    this.sessionList = this.digitisationProcessService.getSessionListByassemblyId(this.assemblyList, assemblyId)
  }

  getDocumentType() {
    if (this.documentType.length == 0) {
      this.digitzationApiService.getDocumentType().subscribe((res: IDocumentTypeResponseDto[]) => {
        this.documentType = res;
      })
    }
  }
  getDocumentSubType() {
    const documenTypeId = this.digitisationForm.value.documentType;
    this.digitzationApiService.getDocumentSubType().subscribe((res: IDocumentSubTypeResponseDto[]) => {
      this.documentSubType = res;
    })
  }

  getKlaSectionList() {
    if (this.klaSectionList.length == 0) {
      this.digitzationApiService.getKlaSection().subscribe((res: IKlaSectionResponseDto[]) => {
        this.klaSectionList = res;
      })
    }
  }

  getAllDepartment() {
    if (this.departmentList.length == 0) {
      this.digitzationApiService.getDepartment().subscribe((res: IDepartmentResponseDto[]) => {
        this.departmentList = res;
      })
    }
  }

  getAccessLevelList() {
    this.digitzationApiService.getAccesLevelList().subscribe((res: IAccessLevelResponseDto[]) => {
      this.accesLevelList = res;
    })
  }

  pageLoadFunctions() {
    this.createDigitsationForm();
    this.getAssemblyList();
    this.getDocumentType();
    this.getDocumentSubType();
    this.getKlaSectionList();
    this.getAllDepartment();
    this.getAccessLevelList();
  }

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  handleChange(info: UploadChangeParam): void {
    if (info.file.response) {
      const uploadedFiles = info.fileList;
      for (const file of uploadedFiles) {
        this.fileList.push({
          id: null,
          title: info.file.name,
          url: info.file.response.body,
        });
      }
    }


  }

  saveDigitisation() {
    for (const i in this.digitisationForm.controls) {
      this.digitisationForm.controls[i].markAsDirty();
      this.digitisationForm.controls[i].updateValueAndValidity();
    }
    if (this.digitisationForm.valid) {

    }
  }
}
