import { Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FileServiceService } from '../../services/file-service.service';

@Component({
  selector: 'tables-m2m-procession',
  templateUrl: './m2m-procession.component.html',
  styleUrls: ['./m2m-procession.component.scss']
})
export class M2mProcessionComponent implements OnInit, OnChanges {
  @Output() closeModal = new EventEmitter<any>();
  @Output() reloadPage = new EventEmitter<any>();
  @Input() fileResponse;
  m2mAndProcessionList: any = null;
  selectedValues: any = {
    m2mValue: null,
    processionValue: null
  };

  ngOnChanges() {
    this.ngOnInit();
  }

  constructor(private fileService: FileServiceService,
              @Inject('authService') public auth) { }

  ngOnInit() {
    this.getList();
  }

  closeM2MPModal() {
    this.selectedValues = {
      m2mValue: null,
      processionValue: null
    };
    this.closeModal.emit();
  }

  cancel() {}

  getList() {
    this.fileService.getSubmittedM2MProcession().subscribe((res: any) => {
      this.m2mAndProcessionList = res;
    });
  }

  attachToFile() {
    const body: any = {
      minuteToMinuteId: this.selectedValues.m2mValue,
      processionId: this.selectedValues.processionValue,
      governorsAddressId: this.fileResponse.governorsAddress[0].id,
      fileForm: {
        activeSubTypes: ['TABLE_M2M_AND_PROCESSION'],
        fileId: this.fileResponse.fileResponse.fileId,
        userId: this.auth.getCurrentUser().userId,
        subTypes: [ 'TABLE_MINUTE_TO_MINUTE',
              'TABLE_PROCESSION_OF_GOVERNORS_ADDRESS',
           'TABLE_COVERING_LETTER_CORRESPONDENCE'],
        type: 'TABLE'
      },
    };
    this.fileService.reSubmitFile(body).subscribe((res: any) => {
      this.closeM2MPModal();
      this.reloadPage.emit();
    });
  }

  showProcession(url) {
    window.open(url, '_blank');
  }

}
