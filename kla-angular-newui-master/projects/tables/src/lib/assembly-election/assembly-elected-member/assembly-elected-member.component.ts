import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { electedMemeber,contactInfo,relatedPersons,address,assests } from '../shared/model/elected-member.model';
import { AssemblyElectionService } from '../shared/services/assembly-election.service';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'tables-assembly-elected-member',
  templateUrl: './assembly-elected-member.component.html',
  styleUrls: ['./assembly-elected-member.component.css']
})
export class AssemblyElectedMemberComponent implements OnInit {
  createCandidateForm: FormGroup;
  contactTypes: any = [];
  relationTypes: any = [];
  nationList: any = [];
  partyList: any = [];
  stateList: any = [];
  disctrictList: any = [];
  talukList: any = [];
  user: any;
  editMode = false;
  uploadURL = this.service.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  // profilePhoto: any = null;
  @Output() candidateAdded = new EventEmitter<any>();
  assetAcquisitionType = ['INHERITENCE', 'GIFT', 'PURCHASE'];
  assetType = ['MOVABLE', 'IMMOVABLE']
  electedMember : electedMemeber;
  editModeEnabled = false;
  memberGroups = [
    { label: "Ruling", value: "RULING_PARTY" },
    { label: "Opposition", value: "OPOSITION_PARTY" },
    { label: "Treasury Bench", value: "TREASURY_BENCH" }
  ];
  partyFronts: any = [];
  memberDesignations: any = [];
  roleList: any = [];
  roles: any = [];
  rbsRole: any = null;
  rbsRoles = {
    role: null,
    startDate: null,
    endDate: null,
    operationalFlag: null,
  };
  isRoleVisible = false;
  listOfRbsRoles: any = [];
  editRole = false;
  tempRbsRoles: any = [];
  memberRbsRoles: any = [];
  permission = {
    updateRole: false,
    markDeceased: false,
    // updatePosition : false,
    updateMemberDetails : false,
    viewRoleTab: false
  };
  portFolioList: any = [];
  allPortFolioList : any = [];
  deceasedPopup = false;
  markDeceased = {
    deceasedDate: null,
    reason: null,
    userId: null
  };
  nationalityList: any = ['Indian'];
  // addressTypes = [{name: 'Permanent Address', code: 'PERMANENT'},
  // {name: 'Address for Communication', code: 'CURRENT'},
  // {name: 'MLA Hostel Address', code: 'MLA_HOSTEL'}];
  addressTypes: any = [];
  relationContacts: any = [];

  constructor(private fb: FormBuilder,
              private service: AssemblyElectionService,
              @Inject('authService') private AuthService,
              private route: ActivatedRoute,
              private notification: NzNotificationService, public translate: TranslateService,
              private commonService: TablescommonService) {
                this.user = AuthService.getCurrentUser();
                this.commonService.setTablePermissions(this.user.rbsPermissions);
               }

  ngOnInit() {
    this.createForm();
    this.getAllContactType();
    this.getAllRelationType();
    this.getAllList();
    this.getCountryDetails();
    this.getMemberDesignations();
    this.getRBSPermissions();
    this.getAllPortFolios();
    this.getDraftPortFolios();
    this.getAddressTypes();
  }

  getRBSPermissions() {
    if (this.commonService.doIHaveAnAccess('ADD_ROLES', 'UPDATE')) {
      this.permission.updateRole = true;
      this.getRoles();
      this.getRbsRoles();
    }
    if (this.commonService.doIHaveAnAccess('MARK_DECEASED', 'READ')) {
      this.permission.markDeceased = true;
    }
    if (this.commonService.doIHaveAnAccess('UPDATE_MEMBER_DETAILS', 'UPDATE')) {
      this.permission.updateMemberDetails = true;
    }
    if (this.commonService.doIHaveAnAccess('ADD_ROLES', 'READ')) {
      this.permission.viewRoleTab = true;
    }
  }

  createForm() {
    this.createCandidateForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      fullName: [null,Validators.required],
      gender: [null, Validators.required],
      married: [null, Validators.required],
      userId: [null],
      userName: [null],
      malayalamFullName: [null],
      contactInfo: this.fb.array([]),
      relatedPersons: this.fb.array([]),
      dateOfBirth: [null,Validators.required],
      placeOfBirth: [null],
      nationality: ['Indian'],
      presetincome: [null],
      id:[0],
      keralaPolicticalPartyid: [null],
      keralaConstituencyId:[null],
      traveledAbroad: [null],
      briefHistory: [null],
      email:[null],
      mobileNumber:[null],
      languageKnown: this.fb.array([]),
      hobbies: this.fb.array([]),
      profession: this.fb.array([]),
      recreation: this.fb.array([]),
      literary: this.fb.array([]),
      klaUser: [null],
      address: this.fb.array([]),
      assests: this.fb.array([]),
      profilePhoto:[null],
      memberGroup: [null],
      keralaPartyFrontId: [null],
      memberDesignationId: [null],
      portfolioId: [null]
    });
  }
  setProfileData(){
    this.electedMember = null;
    let userId = this.route.snapshot.params.id ? this.route.snapshot.params.id : this.user.userId;
    this.service.getElectedUserId(userId).subscribe((res: any) =>{
     this.electedMember = res;
     this.tempRbsRoles = this.electedMember.rbsRole;
     this.memberRbsRoles = this.electedMember.rbsRole;
     this.roles = this.electedMember.roles.map(x => x.roleId);
     this.createCandidateForm.patchValue({
        firstName: this.electedMember.details.firstName,
        lastName: this.electedMember.details.lastName,
        fullName: this.electedMember.details.fullName,
        gender: this.electedMember.details.gender,
        married: this.electedMember.details.married,
        userId: this.electedMember.details.userId,
        userName: this.electedMember.details.userName,
        malayalamFullName: this.electedMember.details.malayalamFullName,
        dateOfBirth: this.electedMember.details.dateOfBirth,
        placeOfBirth: this.electedMember.details.placeOfBirth,
        nationality: this.electedMember.details.nationality ? this.electedMember.details.nationality : 'Indian',
        presetincome: this.electedMember.details.presetincome,
        id:this.electedMember.details.id,
        keralaPolicticalPartyid: this.electedMember.details.keralaPolicticalPartyid,
        keralaConstituencyId:this.electedMember.details.keralaConstituencyId,
        traveledAbroad: this.electedMember.details.traveledAbroad,
        briefHistory: this.electedMember.details.briefHistory,
        email:this.electedMember.details.email,
        mobileNumber:this.electedMember.details.mobileNumber,
        klaUser: this.electedMember.details.klaUser,
        profilePhoto:this.electedMember.details.profilePhoto,
        memberGroup: this.electedMember.details.memberGroup,
        keralaPartyFrontId: this.electedMember.details.keralaPartyFrontId,
        memberDesignationId: this.electedMember.details.memberDesignationId,
        portfolioId: this.electedMember.details.portfolioId
      });
    if (this.electedMember.details.contactInfo && this.electedMember.details.contactInfo.length > 0) {
      this.electedMember.details.contactInfo.forEach(contact => {
        this.setContactDetails(contact)
       });
    }
    if (this.electedMember.details.relatedPersons && this.electedMember.details.relatedPersons.length > 0) {
     this.electedMember.details.relatedPersons.forEach(relPerson => {
      this.setRelatedPerson(relPerson)
     });
    }
    if (this.electedMember.details.languageKnown && this.electedMember.details.languageKnown.length > 0) {
     this.electedMember.details.languageKnown.forEach(lan => {
      this.setStringArray(lan,'languageKnown');
     });
    }
    if (this.electedMember.details.hobbies && this.electedMember.details.hobbies.length > 0) {
     this.electedMember.details.hobbies.forEach(lan => {
      this.setStringArray(lan,'hobbies');
     });
    }
    if (this.electedMember.details.profession && this.electedMember.details.profession.length > 0) {
     this.electedMember.details.profession.forEach(lan => {
      this.setStringArray(lan,'profession');
     });
    }
    if (this.electedMember.details.literary && this.electedMember.details.literary.length > 0) {
     this.electedMember.details.literary.forEach(lan => {
      this.setStringArray(lan,'literary');
     });
    }
    if (this.electedMember.details.recreation && this.electedMember.details.recreation.length > 0) {
     this.electedMember.details.recreation.forEach(lan => {
      this.setStringArray(lan,'recreation');
     });
    }
     if( this.electedMember.details.address.length ==0){
      this.setAddressArray(null);
     }else{
      this.electedMember.details.address.forEach(addres => {
        this.setAddressArray(addres)
       });
     }
    if (this.electedMember.details.assests && this.electedMember.details.assests.length > 0) {
     this.electedMember.details.assests.forEach(assests => {
      this.setAssestsArray(assests);
     });
    }
     this.setProfilePhoto()
    });
  }
  setContactDetails(contactInfo : contactInfo){
    let fg = this.fb.group({
        id: [contactInfo ? contactInfo.id : null],
        code: [contactInfo ? contactInfo.code : null,[Validators.required]],
        name: [contactInfo ? contactInfo.name : ''],
        contactTypeCode: [contactInfo ? contactInfo.contactTypeCode : null,[Validators.required]],
        contactTypeName: ['test'],
        // contactType: [contactInfo ? contactInfo.contactType : this.contactTypes.find(x => x.code === 'PERSONAL_EMAIL')],
    });
      (<FormArray>this.createCandidateForm.get("contactInfo")).push(fg);
  }
  setContactDetailsOfRelated(contactInfo : contactInfo,contactIndex){
    let fg = this.fb.group({
        id: [contactInfo ? contactInfo.id : null],
        code: [contactInfo ? contactInfo.code : null,[Validators.required]],
        name: [contactInfo ? contactInfo.name : ''],
        contactTypeCode: [contactInfo ? contactInfo.contactTypeCode : null,[Validators.required]],
        contactTypeName: ['test'],
        // contactType: [contactInfo ? contactInfo.contactType : this.contactTypes.find(x => x.code === 'PERSONAL_EMAIL')],
    });
      (<FormArray>(
        (<FormGroup>(
          (<FormArray>this.createCandidateForm.controls["relatedPersons"]).controls[contactIndex]
        )).controls["contactInfo"]
      )).push(fg);
  }
  setStringArray(languageKnown,type){
    let fg = this.fb.group({
      stringValue: [languageKnown ? languageKnown : null],
    });
    (<FormArray>this.createCandidateForm.get(type)).push(fg);
  }
  setRelatedPerson(relatedPersons : relatedPersons){
    let fr= this.fb.group({
      id: [relatedPersons ? relatedPersons.id : null],
      firstName: [relatedPersons ? relatedPersons.firstName : null],
      lastName: [relatedPersons ? relatedPersons.lastName : null],
      displayName: [relatedPersons ? relatedPersons.displayName : null],
      nominee: [relatedPersons ? relatedPersons.nominee : null],
      relationCode:[relatedPersons ? relatedPersons.relationCode : null],
      relationName: [relatedPersons ? relatedPersons.relationName : null],
      // relationType: [relatedPersons ? relatedPersons.relationType : null],
      contactInfo: this.fb.array([]),
      address: this.fb.array([]),
    }) ;
    (<FormArray>this.createCandidateForm.get('relatedPersons')).push(fr);
    let relIndex = (<FormArray>this.createCandidateForm.get("relatedPersons")).length - 1;
    if(relatedPersons == null || relatedPersons.contactInfo.length == 0 ){
      this.setContactDetailsOfRelated(null,relIndex,)
    }else{
      relatedPersons.contactInfo.forEach(conatct => {
        this.setContactDetailsOfRelated(conatct,relIndex,)
      });
    }
    if(relatedPersons == null || relatedPersons.address.length == 0 ){
      this.setAddressArrayforRelated(null,relIndex)
    }else{
      relatedPersons.address.forEach(address => {
        this.setAddressArrayforRelated(address,relIndex,)
      });
    }
  }
  setAddressArrayforRelated(address : address,relIndex){
    let fr= this.fb.group({
      id: [address ? address.id : null],
      line1:  [address ? address.line1 : null],
      line2:  [address ? address.line2 : null],
      line3:  [address ? address.line3 : null],
      village:  [address ? address.village : null],
      talukId:  [address ? address.talukId : null],
      districtId:  [address ? address.districtId : null],
      stateId:  [address ? address.stateId : null],
      countryId: [address ? address.countryId : null],
      pinCode:  [address ? address.pinCode : null],
      addressTypeCode: [address ? address.addressTypeCode : null],
      addressTypeName: [address ? address.addressTypeName : null],
      country: [address ? address.country : null],
      state: [address ? address.state : null],
      district: [address ? address.district : null],
      taluk: [address ? address.taluk : null],
    });  
    (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.createCandidateForm.controls["relatedPersons"]).controls[relIndex]
      )).controls["address"]
    )).push(fr); 
  }
  setAddressArray(address : address){
    let fr= this.fb.group({
      id: [address ? address.id : null,],
      line1:  [address ? address.line1 : null,[Validators.required]],
      line2:  [address ? address.line2 : null,[Validators.required]],
      line3:  [address ? address.line3 : null,[Validators.required]],
      village:  [address ? address.village : null,[Validators.required]],
      talukId:  [address ? address.talukId : null,[Validators.required]],
      districtId:  [address ? address.districtId : null,[Validators.required]],
      stateId:  [address ? address.stateId : null,[Validators.required]],
      countryId: [address ? address.countryId : null,[Validators.required]],
      pinCode:  [address ? address.pinCode : null,[Validators.required]],
      nearestRailWay:  [address ? address.nearestRailWay : null,[Validators.required]],
      distanceRail:  [address ? address.distanceRail : null,[Validators.required]],
      shortdistResToTvm:  [address ? address.shortdistResToTvm : null,[Validators.required]],
      treasuryForTA:  [address ? address.treasuryForTA : null,[Validators.required]],
      classITractD:  [address ? address.classITractD : null,[Validators.required]],
      classIItractD:  [address ? address.classIItractD : null,[Validators.required]],
      taLocation:  [this.setTAallocation(address)],
      addressTypeCode: [address ? address.addressTypeCode : null,[Validators.required]],
      addressTypeName: [address ? address.addressTypeName : null]
    });
      (<FormArray>this.createCandidateForm.get("address")).push(fr);
  }
  setTAallocation(address){
    let taLocation = false;
    if(address && address.taLocation !== null){
      taLocation = address.taLocation;
    }
    else if(this.createCandidateForm.value.address.length == 0){
      taLocation = true;
    }else{
      taLocation = false;
    }
    return taLocation;
  }

  setAssestsArray(assests:assests){
    let fr= this.fb.group({
      id: [assests ? assests.id : null],
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
    });  
    (<FormArray>this.createCandidateForm.get('assests')).push(fr); 
  }
  addressForTAChange(event,index){
    if(event == true){
      let taMarked = this.createCandidateForm.value.address.filter(x=> x.taLocation == true);
      if(taMarked.length > 1){
       (<FormGroup>(
        (<FormArray>this.createCandidateForm.controls["address"]).controls[index]
       )).controls["taLocation"].setValue(false);
       this.notification.create("warning","You can mark only One addres at a time for travel Allowance","")
      }
    }else{
      let taMarked = this.createCandidateForm.value.address.filter(x=> x.taLocation == true);
      if(taMarked.length == 0){
       (<FormGroup>(
        (<FormArray>this.createCandidateForm.controls["address"]).controls[index]
       )).controls["taLocation"].setValue(true);
       this.notification.create("warning","At least one Addres should be Marked for travel Allowance ","")
      }
    }
  }
  get contactArray() {
    return this.createCandidateForm.get('contactInfo') as FormArray;
  }

  getAllContactType() {
    this.service.getAllContactType().subscribe((res: any) => {
      this.contactTypes = res;
      this.relationContacts = res;
    });
  }

  removeContactType(i) {
    this.contactArray.removeAt(i);
  }
  removeContactFromRelation(relation,i){
    let controls = relation.get("contactInfo") as FormArray;
    controls.removeAt(i);
  }
  removeAddressFromRelation(relation,i){
    let controls = relation.get("address") as FormArray;
    controls.removeAt(i);
  }
  changeContactType(event,relIndex,relation){
   let ContactArray = (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.createCandidateForm.controls["relatedPersons"]).controls[relIndex]
      )).controls["address"]
    ))
    console.log(ContactArray);
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
  get relationTypeArray() {
    return this.createCandidateForm.get('relatedPersons') as FormArray;
  }

  getAllRelationType() {
    this.service.getAllRelationType().subscribe((res: any) => {
      this.relationTypes = res;
    });
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
      partyFront: true,
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
       this.partyFronts = res.partyFront;
       this.setProfileData();
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
  relContact(d) {
    const controls = d.get("contactInfo") as FormArray;
    return controls;
  }
  relAddress(d){
    const controls = d.get("address") as FormArray;
    return controls;
  }

  get addressArray() {
    return this.createCandidateForm.get('address') as FormArray;
  }

  removeAddressArray(i) {
    this.addressArray.removeAt(i);
  }

  get assetArray() {
    return this.createCandidateForm.get('assests') as FormArray;
  }

  removeAssetArray(i) {
    this.assetArray.removeAt(i);
  }

  saveProfileData() {
    console.log(this.createCandidateForm)
    // tslint:disable-next-line: forin
    for (const key in this.createCandidateForm.controls) {
      this.createCandidateForm.controls[key].markAsDirty();
      this.createCandidateForm.controls[key].updateValueAndValidity();
      if (key === 'contactInfo' || key === 'relatedPersons'|| key === 'address' ) {
        const control = this.createCandidateForm.get(key) as FormArray;
        // tslint:disable-next-line: forin
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          // tslint:disable-next-line: forin
          
          for (const k in controlTwo.controls) {
           
            controlTwo.controls[k].markAsDirty();
            controlTwo.controls[k].updateValueAndValidity();
            let index = 0;
                    if(key == 'relatedPersons'){
                   
                    let contctfrmArray = (<FormArray>(
                      (<FormGroup>(
                        (<FormArray>this.createCandidateForm.controls["relatedPersons"]).controls[index]
                      )).controls["contactInfo"]
                    ))
                    for (const contact in contctfrmArray.controls) {
                      const controlThree = contctfrmArray.controls[contact] as FormGroup;
                      // tslint:disable-next-line: forin
                      for (const c in controlThree.controls) {
                        controlThree.controls[c].markAsDirty();
                        controlThree.controls[c].updateValueAndValidity();
                      }
                    }
                    index++;
                  } 
          }
        }
      }
    }
    if (this.createCandidateForm.valid) {

      this.service.saveProfileData(this.buildRequestBody()).subscribe((res: any) => {
        this.editModeEnabled = false;
        this.createForm();
        this.showUploadList.showRemoveIcon = false;
        this.setProfileData();
      });
    }
  }

  returnFormatedArray(data) {
    if (data) {
      return data.map(x => x.stringValue);
    }
  }
  buildRequestBody(){
    this.createCandidateForm.value.languageKnown = this.returnFormatedArray(this.createCandidateForm.value.languageKnown);
    this.createCandidateForm.value.hobbies = this.returnFormatedArray(this.createCandidateForm.value.hobbies);
    this.createCandidateForm.value.profession = this.returnFormatedArray(this.createCandidateForm.value.profession);
    this.createCandidateForm.value.recreation = this.returnFormatedArray(this.createCandidateForm.value.recreation);
    this.createCandidateForm.value.literary = this.returnFormatedArray(this.createCandidateForm.value.literary);
    this.createCandidateForm.value.id = this.electedMember.userId;
    let body={
      action: "UPDATE",
      details: this.createCandidateForm.value,
      userId: this.electedMember.userId,
      userName : this.electedMember.userName,
    }
    return body;
  }
  cancel() {
 
  }
  setProfilePhoto(){
    this.fileList = [];
    if(this.electedMember.details.profilePhoto){
    this.fileList = [
      {
        url: this.electedMember.details.profilePhoto,
        name: "ProfilePhoto",
        status: "done",
        response: { body: this.electedMember.details.profilePhoto },
        uid: -1,
      }
    ]
  }
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  handleRemove = (file: UploadFile) => {
    // this.profilePhoto = '';
    this.createCandidateForm.controls["profilePhoto"].setValue(null);
    return true;
  }

  handleChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.createCandidateForm.controls["profilePhoto"].setValue(
        info.file.response.body
      );
    } else {
      this.createCandidateForm.controls["profilePhoto"].setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
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

  markasValidated(){
    let elected = this.electedMember.electionDetails.filter(x=>x.status == 'ELECTED');
    if(elected.length!= 0){
      this.notification.create("warning","Please Submit Oath Form to validate Profile","");
    }
    else if(!this.isAddressValid()){
      this.notification.create("warning","Please Complete and validate your address details","");
    }
    else{
    this.service.markAsValid(this.electedMember).subscribe((res:any)=>{
      this.notification.create("success","Success","");
     this.reloadForm(null);
     this.AuthService.reloadMenu();
    })
  }
  }
  isAddressValid(){
    return (<FormArray>this.createCandidateForm.controls["address"]).valid ;
   }
  reloadForm(event){
    this.createForm();
    this. setProfileData();
  }

  enableEditMode() {
    this.editModeEnabled = true;
    this.setProfilePhoto();
    this.showUploadList.showRemoveIcon = true;
  }

  cancelEditMode() {
    this.ngOnInit();
    this.editModeEnabled = false;
    this.showUploadList.showRemoveIcon = false;
    this.setProfilePhoto(); 
  }

  returnCountry(id) {
    if (this.nationList.find(x => x.id === id)) {
      return this.nationList.find(x => x.id === id).name;
    }
  }

  returnState(id) {
    if (this.stateList.find(x => x.id === id)) {
      return this.stateList.find(x => x.id === id).name;
    }
  }

  returnDistrict(id) {
    if (this.disctrictList.find(x => x.id === id)) {
      return this.disctrictList.find(x => x.id === id).name;
    }
  }

  returnTaluk(id) {
    if (this.talukList.find(x => x.id === id)) {
      return this.talukList.find(x => x.id === id).name;
    }
  }

  returnNation(id) {
    return this.returnCountry(parseInt(id, 10));
  }

  returnPartyFront(id) {
    if (this.partyFronts.find(x => x.id === id)) {
      return this.partyFronts.find(x => x.id === id).frontName;
    }
  }

  getMemberDesignations() {
    this.service.getMemberDesignations().subscribe((res: any) => {
      this.memberDesignations = res;
    });
  }

  // returnMemberDesignation(id) {
  //   if (this.memberDesignations.find(x => x.id === id)) {
  //     return this.memberDesignations.find(x => x.id === id).designationName;
  //   }
  // }

  getRoles() {
    this.service.getRoles().subscribe((res: any) => {
      this.roleList = res;
    });
  }

  updateRole() {
    let index = 0;
    let roleId: any = [];
    let memRoleId: any = [];
    if (this.tempRbsRoles) {
      roleId = this.tempRbsRoles.map(x => x.roleId);
    }
    if (this.memberRbsRoles) {
      memRoleId = this.memberRbsRoles.map(x => x.roleId);
    }
    // tslint:disable-next-line:forin
    if (roleId) {
      for (const role of roleId) {
        if (memRoleId.indexOf(role) === -1) {
          this.tempRbsRoles[index].operationalFlag = 'D';
        }
        index++;
      }
    }
    const tempRoles = [];
    this.electedMember.roles.forEach(r => {
      if (!this.roles.includes(r.roleId)) {
        tempRoles.push({roleId: r.roleId, action: 'D'});
      }
    });
    const body = {
      userId: this.electedMember.userId,
      roles: [...this.roles.map((x) => ({roleId: x})), ...tempRoles],
      rbsRole: this.tempRbsRoles
    };
    this.service.addAllRole(body).subscribe((res: any) => {
      this.notification.success('Success', 'Saved Successfully');
      this.cancelEditRole();
    });
  }

  showRoleModal() {
    this.isRoleVisible = true;
  }

  handleCancel() {
    this.isRoleVisible = false;
    this.rbsRoles = {
      role: null,
      startDate: null,
      endDate: null,
      operationalFlag: null
    };
  }

  addRole() {
    this.isRoleVisible = false;
    const selectedRole = {
      roleId: this.rbsRoles.role.id,
      startDate: this.rbsRoles.startDate,
      endDate: this.rbsRoles.endDate,
      operationalFlag: null,
      roleName: this.rbsRoles.role.name
    };
    const memRoleId = [];
    if (this.memberRbsRoles) {
      for (const role of this.memberRbsRoles) {
        memRoleId.push(role.roleId);
      }
    }
    if (this.memberRbsRoles && memRoleId.indexOf(this.rbsRoles.role.id) === -1) {
      this.memberRbsRoles = [...this.memberRbsRoles, selectedRole];
    }
    this.tempRbsRoles.push(selectedRole);
    this.handleCancel();
  }

  handleClose(removedTag: {}): void {
    this.memberRbsRoles = this.memberRbsRoles.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  cancelEditRole() {
    this.editRole = false;
    this.createForm();
    this.setProfileData();
  }

  getRbsRoles() {
    this.service.getRbsRoles().subscribe((res: any) => {
      this.listOfRbsRoles = res;
    });
  }

  isMinister() {
    if (this.electedMember && this.electedMember.userType === 'MEMBER' && this.createCandidateForm.value.memberGroup === 'TREASURY_BENCH') {
       return true;
    }
    return false;
  }

  getDraftPortFolios() {
    this.service.getDraftPortfolios().subscribe((res: any) => {
      this.portFolioList = res;
    });
  }
  getAllPortFolios() {
    this.service.getAllPortfolios().subscribe((res: any) => {
      if(res.portfolioMock && res.portfolioMock.length !== 0){
        this.allPortFolioList = res.portfolioMock;
      }
    });
  }
  returnPortfolio(id) {
    if (this.portFolioList.find(x => x.id === id)) {
      return this.portFolioList.find(x => x.id === id).name;
    }
  }

  showDeceasedPopup() {
    this.deceasedPopup = true;
    this.markDeceased.userId = this.electedMember.userId;
  }

  cancelDeceasedPopup() {
    this.deceasedPopup = false;
    this.markDeceased = {
      deceasedDate: null,
      reason: null,
      userId: null
    };
  }

  markAsDeceased() {
    this.service.markAsDeceased(this.markDeceased).subscribe((res: any) => {
      this.notification.success('Success', 'Saved Successfully');
      this.cancelDeceasedPopup();
      this.createForm();
      this.setProfileData();
    });
  }

  returnContactList(selectedType) {
    return this.contactTypes.filter(x => !this.contactArray.value.map(y => y.contactTypeCode).includes(x.code) || x.code === selectedType);
  }

  disabledDate = (current: Date): boolean => {
    const dateDOB = new Date();
    dateDOB.setFullYear(new Date().getFullYear() - 25);
    return differenceInCalendarDays(current, dateDOB) > 0;
  }

  disableFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  returnRelationContactList(code, relation) {
    return this.relationContacts.filter(x => !this.relContact(relation).value.map(y => y.contactTypeCode).includes(x.code) || x.code === code);
  }

  returnAddressList(code) {
    return this.addressTypes.filter(x => !this.addressArray.value.map(y => y.addressTypeCode).includes(x.code) || x.code === code);
  }

  setAdressTypeName(i, code) {
    this.addressArray.controls[i].patchValue({
      addressTypeName: this.addressTypes.find(x => x.code === code).name
    });
  }

  setRelationAdressTypeName(relation, i, code) {
    this.relAddress(relation).controls[i].patchValue({
      addressTypeName: this.addressTypes.find(x => x.code === code).name
    });
  }

  returnRelationAddressList(code, relation) {
    return this.addressTypes.filter(x => (!this.relAddress(relation).value.map(y => y.addressTypeCode).includes(x.code) || x.code === code) && x.code !== 'MLA_HOSTEL'  && x.code !== 'TVM_ADDRESS');
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

  relationCountryChanged(relation, i) {
    this.relAddress(relation).controls[i].get('stateId').reset();
    this.relAddress(relation).controls[i].get('districtId').reset();
    this.relAddress(relation).controls[i].get('talukId').reset();
  }

  relationStateChanged(relation, i) {
    this.relAddress(relation).controls[i].get('districtId').reset();
    this.relAddress(relation).controls[i].get('talukId').reset();
  }

  relationDistrictChanged(relation, i) {
    this.relAddress(relation).controls[i].get('talukId').reset();
  }
  getTabTitle(){
    if(this.permission.updateMemberDetails == false){
      return ((this.translate.getDefaultLang()=='mal') ? 'എൻ്റെ പ്രൊഫൈൽ' : 'My Profile')
    }else{
      return ((this.translate.getDefaultLang()=='mal') ? 'മെമ്പർ പ്രൊഫൈൽ' : 'Member Profile')

    }
  }
}
