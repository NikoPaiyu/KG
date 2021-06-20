import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { TablescommonService } from 'projects/tables/src/lib/shared/services/tablescommon.service';
import { Observable, Observer } from 'rxjs';
import { AssemblyElectionService } from '../../../services/assembly-election.service';

@Component({
  selector: 'tables-add-candidate-form',
  templateUrl: './add-candidate-form.component.html',
  styleUrls: ['./add-candidate-form.component.scss']
})
export class AddCandidateFormComponent implements OnInit {
  createCandidateForm: FormGroup;
  contactTypes: any = [];
  relationTypes: any = [];
  nationList: any = [];
  partyList: any = [];
  stateList: any = [];
  disctrictList: any = [];
  talukList: any = [];
  editMode = true;
  @Output() closeAddCandidateTab = new EventEmitter<any>();
  @Input() electionDetails;
  @Input() detailId;
  @Input() candidateId;
  user: any;
  uploadURL = this.service.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  profilePhoto: any = null;
  @Output() candidateAdded = new EventEmitter<any>();
  assetAcquisitionType = ['INHERITENCE', 'GIFT', 'PURCHASE'];
  assetType = ['MOVABLE', 'IMMOVABLE']
  candidateData = null;
  allMembers = [];
  importedMember = null
  nationalityList: any = ['Indian'];
  // addressTypes = [{name: 'Permanent Address', code: 'PERMANENT'},
  //                 {name: 'Address for Communication', code: 'CURRENT'},
  //                 {name: 'MLA Hostel Address', code: 'MLA_HOSTEL'}];
  addressTypes: any = [];

  constructor(private fb: FormBuilder,
              private service: AssemblyElectionService,
              @Inject('authService') private AuthService,
              private tableCommonService : TablescommonService,
              private notification: NzNotificationService) {
                this.user = AuthService.getCurrentUser();
               }

  ngOnInit() {
    this.createForm();
    this.getAllContactType();
    this.getAllRelationType();
    this.getAllList();
    this.getCountryDetails();
    this.getAddressTypes();
    if(this.candidateId){
      this.editMode = false;
      this.getCandidateById();
      this.showUploadList.showRemoveIcon = false;
    }
    else{
      this.editMode = true;
      this.getAllMembers()
    }
  }

  createForm() {
    this.createCandidateForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      fullName: [null,Validators.required],
      malayalamFullName: [null,],
      contactInfo: this.fb.array([]),
      relatedPersons: this.fb.array([]),
      gender: [null, Validators.required],
      married: [null, Validators.required],
      dateOfBirth: [null,Validators.required],
      placeOfBirth: [null],
      nationality: ['Indian'],
      presetincome: [null],
      partyId: [null,Validators.required],
      traveledAbroad: [null],
      briefHistory: [null],
      languageKnown: this.fb.array([]),
      hobbies: this.fb.array([]),
      profession: this.fb.array([]),
      recreation: this.fb.array([]),
      literary: this.fb.array([]),
      klaUser: [false],
      address: this.fb.array([]),
      assests: this.fb.array([]),
      userName:[null],
    });
  }
  getCandidateById(){
    this.service.getCandidateById(this.candidateId).subscribe((res: any) => {
      this.candidateData = res;
      this.setCandiadteData()
    })
  }
  setCandiadteData(){
    this.createCandidateForm.patchValue(this.candidateData,{onlySelf: true}); 
    if(this.candidateData.contactInfo.length !== 0){
      this.candidateData.contactInfo.forEach(contact => {
        this.setContactDetails(contact)
       });
      }else{
        this.initContactInfoFirstTime();
      }
    if(this.candidateData.relatedPersons.length !== 0){
      this.candidateData.relatedPersons.forEach(relPerson => {
        this.setRelatedPerson(relPerson)
       });
     }
     else{ 
      //  this.initailseRelationFirstTime()
      }
    this.candidateData.languageKnown.forEach(lan => {
      this.setStringArray(lan,'languageKnown');
     });
    this.candidateData.hobbies.forEach(lan => {
      this.setStringArray(lan,'hobbies');
     });
    this.candidateData.profession.forEach(lan => {
      this.setStringArray(lan,'profession');
     });
    this.candidateData.literary.forEach(lan => {
      this.setStringArray(lan,'literary');
     });
    this.candidateData.recreation.forEach(lan => {
      this.setStringArray(lan,'recreation');
     });
    this.candidateData.address.forEach(addres => {
      this.setAddressArray(addres)
     });
    this.candidateData.assests.forEach(asset => {
      this.setAssestsArray(asset)
     });
    this.setProfilePhoto()
  }
  initContactInfoFirstTime(){
    if(this.candidateId == null){
      this.contactArray.push(this.fb.group({
        id: this.fb.control(null),
        code: this.fb.control(null, [Validators.required]),
        name: this.fb.control(''),
        contactTypeCode: this.fb.control('PERSONAL_EMAIL'),
        contactTypeName: this.fb.control(null),
        userContactId : this.fb.control(null),
         klaUser:this.fb.control(false),
      }));
      this.contactArray.push(this.fb.group({
        id: this.fb.control(null),
        code: this.fb.control(null, [Validators.required]),
        name: this.fb.control(''),
        contactTypeCode: this.fb.control('MOBILE_NUMBER'),
        contactTypeName: this.fb.control(null),
        userContactId : this.fb.control(null),
        klaUser:this.fb.control(false),
      }));
    }
  }
  setContactDetails(contactInfo){
    let fg = this.fb.group({
      id: [contactInfo && this.importedMember == null ? contactInfo.id : null,],
      code: [contactInfo ? contactInfo.code : null,[Validators.required]],
      name: [contactInfo ? contactInfo.name : ''],
      contactTypeCode: [contactInfo ? contactInfo.contactTypeCode : 'PERSONAL_EMAIL',[Validators.required]],
      contactTypeName: ['test'],
      klaUser:  [contactInfo && this.importedMember  ? true : false],
      userContactId:  [contactInfo && this.importedMember ? contactInfo.id : contactInfo.userContactId],
    });
    (<FormArray>this.createCandidateForm.get("contactInfo")).push(fg);
  }
  setRelatedPerson(relatedPersons){
    let fr= this.fb.group({
      id: [relatedPersons && this.importedMember == null ? relatedPersons.id : null,],
      firstName: [relatedPersons ? relatedPersons.firstName : null],
      lastName: [relatedPersons ? relatedPersons.lastName : null],
      displayName: [relatedPersons ? relatedPersons.displayName : null],
      nominee: [relatedPersons ? relatedPersons.nominee : null],
      relationCode:[relatedPersons ? relatedPersons.relationCode : null],
      relationName: [relatedPersons ? relatedPersons.relationName : null],
      klaUser:  [relatedPersons && this.importedMember  ? true : false],
      userRelatedPersonId:  [relatedPersons && this.importedMember ? relatedPersons.id : relatedPersons.userRelatedPersonId],
    }) ;
    (<FormArray>this.createCandidateForm.get('relatedPersons')).push(fr);
  }
  setStringArray(data,type){
    let fg = this.fb.group({
      stringValue: [data ? data : null],
    });
    (<FormArray>this.createCandidateForm.get(type)).push(fg);
  }
  setAddressArray(address){
    let fr= this.fb.group({
      id: [address && this.importedMember == null ? address.id : null,],
      line1:  [address ? address.line1 : null,[Validators.required]],
      line2:  [address ? address.line2 : null,[Validators.required]],
      line3:  [address ? address.line3 : null,[Validators.required]],
      village:  [address ? address.village : null,[Validators.required]],
      talukId:  [address ? address.talukId : null,[Validators.required]],
      districtId:  [address ? address.districtId : null,[Validators.required]],
      stateId:  [address ? address.stateId : null,[Validators.required]],
      countryId: [address ? address.countryId : null,[Validators.required]],
      pinCode:  [address ? address.pinCode : null,[Validators.required]],
      klaUser:  [address && this.importedMember  ? true : false],
      userAddressId:  [address && this.importedMember ? address.id : address.userAddressId],
      addressTypeCode: [address ? address.addressTypeCode : null,[Validators.required]],
      addressTypeName: [address ? address.addressTypeName : null]
     });
    (<FormArray>this.createCandidateForm.get("address")).push(fr);
    } 
    setAssestsArray(assests){
      let fr= this.fb.group({
        id: [assests && this.importedMember == null ? assests.id : null,],
        ownedBy:  [assests ? assests.ownedBy : null],
        acquisitionDate:  [assests ? assests.acquisitionDate : null],
        acquisitionDetails:  [assests ? assests.acquisitionDetails : null],
        acquisitionType:  [assests ? assests.acquisitionType : null],
        type:  [assests ? assests.type : null],
        talukId:  [assests ? assests.talukId : null],
        districtId:  [assests ? assests.districtId : null],
        stateId:  [assests ? assests.stateId : null],
        village: [assests ? assests.village : null],
        presentValue: [assests ? assests.presentValue : null],
        annualIncomeFromProperty: [assests ? assests.annualIncomeFromProperty : null],
        klaUser:  [assests && this.importedMember  ? true : false],
        userAssetId:  [assests && this.importedMember ? assests.id : assests.userAssetId],
      });  
      (<FormArray>this.createCandidateForm.get('assests')).push(fr); 
    }
  setProfilePhoto(){
    this.profilePhoto = null;
    this.fileList = [];
    if(this.candidateData.profilePhoto){
      this.profilePhoto = this.candidateData.profilePhoto;
      this.fileList = [
        {
          url: this.candidateData.profilePhoto,
          name: "ProfilePhoto",
          status: "done",
          response: { body: this.candidateData.profilePhoto },
          uid: -1,
        }
      ]
    }
  }
  initContactInfo() {
    return this.fb.group({
      id: this.fb.control(null),
      code: this.fb.control(null, Validators.required),
      name: this.fb.control(''),
      contactTypeCode: this.fb.control(null,Validators.required),
      contactTypeName: this.fb.control(null),
      userContactId : this.fb.control(null),
      klaUser:this.fb.control(false),
      // contactType: this.fb.control(null, Validators.required)
    });
  }

  get contactArray() {
    return this.createCandidateForm.get('contactInfo') as FormArray;
  }

  getAllContactType() {
    this.service.getAllContactType().subscribe((res: any) => {
      this.contactTypes = res;
      this.initContactInfoFirstTime();
    });
  }

  addContactType() {
    this.contactArray.push(this.initContactInfo());
  }

  removeContactType(i) {
    this.contactArray.removeAt(i);
  }
  getContactErrorTip(contact){
   let msg = "Invalid Contact"
    if(contact){
      msg = 'Invalid  ' + contact.split('_').join(' ');
    }
   return msg;
  }
  getConactPlacehlder(contact){
    let msg = "Contact"
     if(contact){
       msg = contact.split('_').join(' ')
     }
    return msg;
   }
  getContactPattern(contactType){
   if(contactType && (contactType == 'PERSONAL_EMAIL' || contactType == 'OFFICE_EMAIL' )){
    return '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$'
    }
   else if(contactType && contactType == 'MOBILE_NUMBER'){
      return '^[1-9]{1}[0-9]{9}$'
      }    
  }
  initRelationType() {
    return this.fb.group({
      id: this.fb.control(null),
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      displayName: this.fb.control(null),
      nominee: this.fb.control(null),
      relationCode: this.fb.control(null, Validators.required),
      relationName: this.fb.control(null),
      userRelatedPersonId : this.fb.control(null),
      klaUser :this.fb.control(false),
      // relationType: this.fb.control(null, Validators.required)
    });
  }

  get relationTypeArray() {
    return this.createCandidateForm.get('relatedPersons') as FormArray;
  }

  getAllRelationType() {
    this.service.getAllRelationType().subscribe((res: any) => {
      this.relationTypes = res;
      // this.initailseRelationFirstTime();
    });
  }
  initailseRelationFirstTime(){
  if(this.candidateId == null){
    this.relationTypeArray.push(this.fb.group({
      id: this.fb.control(null),
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      displayName: this.fb.control(null),
      nominee: this.fb.control(null),
      relationCode: this.fb.control(null),
      relationName: this.fb.control(null),
      userRelatedPersonId : this.fb.control(null),
      klaUser :this.fb.control(false),
      // relationType: this.fb.control(this.relationTypes.find(x => x.code === 'FATHER'), Validators.required)
    }));
   }
  }
  addRelationType() {
    this.relationTypeArray.push(this.initRelationType());
  }

  removeRelationType(i) {
    this.relationTypeArray.removeAt(i);
  }

  getAllList() {
    const body = {
      constituency: true,
      party: true,
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
    this.service.getAllList(body).subscribe((res: any) => {
      //  this.nationList = res.country;
       this.partyList = res.party;
      //  this.stateList = res.state;
      //  this.disctrictList = res.district;
      //  this.talukList = res.taluk;
     });
  }

  initStringFormArray() {
    return this.fb.group({stringValue: [null]});
  }

  get languageArray() {
    return this.createCandidateForm.get('languageKnown') as FormArray;
  }

  addLanguageArray() {
    this.languageArray.push(this.initStringFormArray());
  }

  removeLanguageArray(i) {
    this.languageArray.removeAt(i);
  }

  get hobbyArray() {
    return this.createCandidateForm.get('hobbies') as FormArray;
  }

  addHobbyArray() {
    this.hobbyArray.push(this.initStringFormArray());
  }

  removeHobbyArray(i) {
    this.hobbyArray.removeAt(i);
  }

  get professionArray() {
    return this.createCandidateForm.get('profession') as FormArray;
  }

  addProfessionArray() {
    this.professionArray.push(this.initStringFormArray());
  }

  removeProfessionArray(i) {
    this.professionArray.removeAt(i);
  }

  get recreationArray() {
    return this.createCandidateForm.get('recreation') as FormArray;
  }

  addRecreationArray() {
    this.recreationArray.push(this.initStringFormArray());
  }

  removeRecreationArray(i) {
    this.recreationArray.removeAt(i);
  }

  get literaryArray() {
    return this.createCandidateForm.get('literary') as FormArray;
  }

  addLiteraryArray() {
    this.literaryArray.push(this.initStringFormArray());
  }

  removeLiteraryArray(i) {
    this.literaryArray.removeAt(i);
  }

  initAddressArray() {
    return this.fb.group({
      id: this.fb.control(null),
      line1: this.fb.control(null),
      line2: this.fb.control(null),
      line3: this.fb.control(null),
      village: this.fb.control(null),
      talukId: this.fb.control(null),
      districtId: this.fb.control(null),
      stateId: this.fb.control(null),
      countryId: this.fb.control(null),
      pinCode: this.fb.control(null),
      userAddressId : this.fb.control(null),
      klaUser  : this.fb.control(false),
      addressTypeCode: this.fb.control(null),
      addressTypeName: this.fb.control(null)
    });
  }

  get addressArray() {
    return this.createCandidateForm.get('address') as FormArray;
  }

  addAddressArray() {
    this.addressArray.push(this.initAddressArray());
  }

  removeAddressArray(i) {
    this.addressArray.removeAt(i);
  }

  initAssetArray() {
    return this.fb.group({
      id: this.fb.control(null),
      ownedBy: this.fb.control(null),
      acquisitionDate: this.fb.control(null),
      acquisitionDetails: this.fb.control(null),
      acquisitionType: this.fb.control(null),
      type: this.fb.control(null),
      talukId: this.fb.control(null),
      districtId: this.fb.control(null),
      stateId: this.fb.control(null),
      village: this.fb.control(null),
      presentValue: this.fb.control(null),
      annualIncomeFromProperty: this.fb.control(null),
      userAssetId : this.fb.control(null),
      klaUser  : this.fb.control(false),
    });
  }

  get assetArray() {
    return this.createCandidateForm.get('assests') as FormArray;
  }

  addAssetArray() {
    this.assetArray.push(this.initAssetArray());
  }

  removeAssetArray(i) {
    this.assetArray.removeAt(i);
  }
  onEdit(){
    this.editMode = true;
    this.setProfilePhoto()
    this.showUploadList.showRemoveIcon = true;
  }
 
  addCandidate() {
    // tslint:disable-next-line: forin
    for (const key in this.createCandidateForm.controls) {
      this.createCandidateForm.controls[key].markAsDirty();
      this.createCandidateForm.controls[key].updateValueAndValidity();
      if (key === 'contactInfo' || key === 'relatedPersons') {
        const control = this.createCandidateForm.get(key) as FormArray;
        // tslint:disable-next-line: forin
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          // tslint:disable-next-line: forin
          for (const k in controlTwo.controls) {
            controlTwo.controls[k].markAsDirty();
            controlTwo.controls[k].updateValueAndValidity();
          }
        }
      }
    }
    console.log(this.createCandidateForm);
    if (this.createCandidateForm.valid) {
      this.service.addCandidate(this.buildRequestBody()).subscribe((res: any) => {
        if(this.candidateId){
          this.notification.success('Success', 'Candidate Details Updated Successfully');
        }else{
          this.notification.success('Success', 'Candidate Added Successfully');
        }
        this.candidateAdded.emit();
      });
    }
  }

  returnFormatedArray(data) {
    if (data) {
      return data.map(x => x.stringValue);
    }
  }

  buildRequestBody() {
    const body = {
      electionId: this.electionDetails.id,
      deatilId: this.detailId,
      id: this.candidateId ? this.candidateId : 0,
      fullName: this.createCandidateForm.value.fullName,
      malayalamFullName: this.createCandidateForm.value.malayalamFullName,
      firstName:  this.createCandidateForm.value.firstName,
      lastName: this.createCandidateForm.value.lastName,
      profilePhoto: this.profilePhoto,
      gender: this.createCandidateForm.value.gender,
      nationality: this.createCandidateForm.value.nationality,
      presetincome: this.createCandidateForm.value.presetincome,
      dateOfBirth: this.createCandidateForm.value.dateOfBirth,
      placeOfBirth: this.createCandidateForm.value.placeOfBirth,
      languageKnown: this.returnFormatedArray(this.createCandidateForm.value.languageKnown),
      hobbies: this.returnFormatedArray(this.createCandidateForm.value.hobbies),
      profession: this.returnFormatedArray(this.createCandidateForm.value.profession),
      recreation: this.returnFormatedArray(this.createCandidateForm.value.recreation),
      literary: this.returnFormatedArray(this.createCandidateForm.value.literary),
      briefHistory: this.createCandidateForm.value.briefHistory,
      partyId: this.createCandidateForm.value.partyId,
      address: this.createCandidateForm.value.address,
      relatedPersons: this.createCandidateForm.value.relatedPersons,
      // relatedPersons: this.createCandidateForm.value.relatedPersons.map((x) => (
      //   {
      //   id: x.id,
      //   displayName: x.displayName,
      //   firstName: x.firstName,
      //   lastName: x.lastName,
      //   nominee: x.nominee,
      //   relationCode: x.relationType.code,
      //   relationName: x.relationType.name
      //   }
      // )),
      assests: this.createCandidateForm.value.assests,
      contactInfo: this.createCandidateForm.value.contactInfo,
      // contactInfo: this.createCandidateForm.value.contactInfo.map((x) => (
      //   {
      //   id: x.id,
      //   code: x.code,
      //   name: x.name,
      //   contactTypeCode: x.contactType.code,
      //   contactTypeName: x.contactType.name
      //   }
      // )),
      userId: this.candidateData && this.candidateData.userId ? this.candidateData.userId : null,
      klaUser: this.createCandidateForm.value.klaUser,
      married: this.createCandidateForm.value.married,
      traveledAbroad: this.createCandidateForm.value.traveledAbroad,
      userName : this.createCandidateForm.value.userName ?  this.createCandidateForm.value.userName : null
    };
    return body;
  }

  cancel() {
    this.closeAddCandidateTab.emit();
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  handleRemove = (file: UploadFile) => {
    this.profilePhoto = '';
    return true;
  }

  handleChange(info: any): void {
    const fileList = info.fileList;
    // 2. read from response and show file link
    if (info.file.response) {
      this.profilePhoto = info.file.response.body;
    }
    // 3. filter successfully uploaded files according to response from server
    // tslint:disable-next-line:no-any
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.notification.warning('Warning', 'You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.notification.warning('Warning', 'Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  }
  getAllMembers(){
    this.tableCommonService.getAllMembersList().subscribe((res: any) => {
      this.allMembers = res;
    });
  }
  importCandidate(){
  if(this.importedMember == null){
     this.notification.create("warning","Please select memeber","");
     return;
   }
   else{
    this.candidateData = null;
    this.service.getElectedUserId(this.importedMember).subscribe((res:any) => {
      //  res.details.partyId = res.keralaPolicticalPartyid;
       this.candidateData = res.details;
       this.candidateData.partyId = res.details.keralaPolicticalPartyid;
       this.candidateData.klaUser = true;
       this.candidateData.userId = res.userId;
       this.candidateData.userName = res.userName;
       this.candidateData.hobbies =  this.candidateData.hobbies ?  this.candidateData.hobbies : [];
       this.candidateData.languageKnown =  this.candidateData.languageKnown ?  this.candidateData.languageKnown : [];
       this.candidateData.literary =  this.candidateData.literary ?  this.candidateData.literary : [];
       this.candidateData.profession =  this.candidateData.profession ?  this.candidateData.profession : [];
       this.candidateData.recreation =  this.candidateData.recreation ?  this.candidateData.recreation : [];
       this.candidateData.nationality = res.nationality ? res.nationality : 'Indian';
       this.resetFormControls();
       this.setCandiadteData();
     });
   }
  }
  resetFormControls(){
    this.createCandidateForm.reset();
    let arrays = [ 'contactInfo','relatedPersons','languageKnown','hobbies',
                  'profession','recreation','literary','address','assests']
    arrays.forEach(element => {
    this.createCandidateForm.setControl(element, new FormArray([]));
   });
    this.profilePhoto = null
    this.fileList = [];
  }

  returnContactList(selectedType) {
    return this.contactTypes.filter(x => !this.contactArray.value.map(y => y.contactTypeCode).includes(x.code) || x.code === selectedType);
  }

  disableFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  disabledDate = (current: Date): boolean => {
    const dateDOB = new Date();
    dateDOB.setFullYear(new Date().getFullYear() - 25);
    return differenceInCalendarDays(current, dateDOB) > 0;
  }

  returnAddressList(code) {
    return this.addressTypes.filter(x => !this.addressArray.value.map(y => y.addressTypeCode).includes(x.code) || x.code === code);
  }

  setAdressTypeName(i, code) {
    this.addressArray.controls[i].patchValue({
      addressTypeName: this.addressTypes.find(x => x.code === code).name
    });
  }

  returnRelationList(code) {
    return this.relationTypes.filter(r => !this.relationTypeArray.value.map(t => t.relationCode).includes(r.code) ||
            r.code === 'SON' || r.code === 'DAUGHTER' || r.code === 'BROTHER' || r.code === 'SISTER' || r.code === code);
  }

  getCountryDetails() {
    this.service.getCountryDetails().subscribe((res: any) => {
      this.nationList = res;
    });
  }

  getStateList(countryId, i) {
    this.stateList = [];
    this.disctrictList = [];
    this.talukList = [];
    if (countryId && this.nationList.find(n => n.id === countryId)) {
      return this.stateList = this.nationList.find(n => n.id === countryId).states;
    } else {
      return [];
    }
  }

  getDistrictList(stateId, i) {
    this.disctrictList = [];
    this.talukList = [];
    if (stateId && this.stateList.find(s => s.id === stateId)) {
      return this.disctrictList = this.stateList.find(s => s.id === stateId).district;
    } else {
      return [];
    }
  }

  getTalukList(districtId, i) {
    this.talukList = [];
    if (districtId && this.disctrictList.find(d => d.id === districtId)) {
      return this.talukList = this.disctrictList.find(d => d.id === districtId).taluks;
    } else {
      return [];
    }
  }

  getAddressTypes() {
    this.service.getAddressTypeList().subscribe((res: any) => {
      this.addressTypes = res;
    });
  }

  countryChanged(i) {
    const control = this.createCandidateForm.get('address') as FormArray;
    control.controls[i].get('stateId').reset();
    control.controls[i].get('districtId').reset();
    control.controls[i].get('talukId').reset();
  }

  stateChanged(i) {
    const control = this.createCandidateForm.get('address') as FormArray;
    control.controls[i].get('districtId').reset();
    control.controls[i].get('talukId').reset();
  }

  districtChanged(i) {
    const control = this.createCandidateForm.get('address') as FormArray;
    control.controls[i].get('talukId').reset();
  }
}
