import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DigitisationprocessService {

  constructor(private formBuilder: FormBuilder) { }

  //create digitisation form
  createDigitisationForm() {
    return this.formBuilder.group({
      refId: [null],
      date: [null],
      assemblyId: [null, [Validators.required]],
      sessionId: [null, [Validators.required]],
      documentType: [null, [Validators.required]],
      subType: [null, [Validators.required]],
      documentNo: [null, [Validators.required]],
      documentName: [null, [Validators.required]],
      documentYear: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      event: [null],
      status: [null, [Validators.required]],
      klaSection: [null, [Validators.required]],
      recievedFrom: [null, [Validators.required]],
      department: [null, [Validators.required]],
      recievedDate: [null, [Validators.required]],
      documentAttachments: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      accessLevel: [null, [Validators.required]],
      accessForKlaSection: [null],
      accessForRoles: [null]
    })
  }

  getSessionListByassemblyId(list, assemblyId) {
    const filterData = list.find(x => x.id == assemblyId);
    return filterData.session
  }

}
