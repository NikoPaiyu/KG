import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserDetails } from "../shared/models/userDetails";
import { UserManagementService } from "../shared/services/user-management.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { UploadFile } from "ng-zorro-antd";
import { Observable, Observer } from "rxjs";
import { environment } from "src/environments/environment";
import { element } from "protractor";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"]
})
export class CreateUserComponent implements OnInit {
  @ViewChild('userAddForm', { static: true }) userAddForm: NgForm;
  public resetPword = false;
  public invalidPword = false;
  public userType = "";
  public contituencies = [];
  public memberGroups = [
    { label: "Ruling", value: "RULING_PARTY" },
    { label: "Opposition", value: "OPOSITION_PARTY" },
    { label: "Treasury Bench", value: "TREASURY_BENCH" }
  ];
  public memberTypes = [
    { label: "Non elected Minister", value: "NON_ELECTED" },
    { label: "Nominated MLA", value: "NOMINATED" }
  ];
  public sectionTypes = [
    { label: 'KLA Section', value: 'KLA_SECTION' },
    { label: 'Others', value: 'OTHERS' }
  ];
  public roles = [];
  public parties = [];
  public klaDepartments = [];
  public memberDesignations = [];
  public klaRoles = [];
  public keralaPartyFrontIds = [];
  public user: UserDetails;
  public users: UserDetails[] = [];
  public searchParam: string = "";
  public IsEnabled = true;
  public IsEnableRadio = false;
  public rbsRole: any = [];
  selectedValue: any = null;
  isVisible = false;
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
  listOfDisplayData;
  memberRoles: any = [];
  flag: boolean;
  tag = [];
  minPortfolios: any = [];
  ministerDept: any = [];
  sectionType: any = '';
  isRoleVisible = false;

  Hide() {
    this.flag = false;
    let mla = this.roles.find(role => role.label == "MLA" || role.label == "parliamentaryPartySecretary");
    if (mla && this.user.role.length > 0) {
      this.user.role.forEach(element => {
        if (element == mla.value) {
          this.flag = true;
        }
      });
    } else {
      this.IsEnabled = true;
    }
    if (this.flag === false) {
      this.IsEnabled = false;
      this.IsEnableRadio = false;
      this.user.partyId = null;
      this.user.constituencyId = null;
      this.user.memberType = null;
      this.user.memberGroup = null;
    } else {
      if (this.userType == "NON_MEMBER") {
        this.sectionType = 'OTHERS';
      }
      this.IsEnabled = true;
    }
  }

  HideRadio() {
    let noConstituency = this.contituencies.find(
      constituency => constituency.label == "No Constituency"
    );
    if (noConstituency && this.user.constituencyId !== " ") {
      if (this.user.constituencyId == noConstituency.value) {
        this.IsEnableRadio = true;
        this.user.memberType = "NON_ELECTED";
      } else {
        this.IsEnableRadio = false;
        this.user.memberType = null;
      }
    } else {
      this.IsEnableRadio = false;
    }
  }

  uploadURL = `${environment.fileupload_url}/uploadImage`;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = "";
  previewVisible = false;
  constructor(
    public userService: UserManagementService,
    public router: Router,
    public route: ActivatedRoute,
    public notify: NotificationCustomService,
    public http: HttpClient
  ) { }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleRemove = (file: UploadFile) => {
    this.user.profilePhoto = "";
    return true;
  };

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.notify.showWarning("Warning", "You can only upload JPG file!");
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.notify.showWarning("Warning", "Image must smaller than 2MB!");
        observer.complete();
        return;
      }
      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  }

  handleChange(info: any): void {
    const fileList = info.fileList;
    // 2. read from response and show file link
    if (info.file.response) {
      this.user.profilePhoto = info.file.response.body;
    }
    // 3. filter successfully uploaded files according to response from server
    // tslint:disable-next-line:no-any
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  ngOnInit() {
    this.user = new UserDetails();
    this.route.params.subscribe(params => {
      this.userType = params["userType"];
      if (this.userType) {
        this.getRolesByUserType(this.userType);
        if (this.userType == "MEMBER") {
          this.getConstituencies();
          this.getParties();
          this.getMemberDesignations();
          this.getKeralaPartyFront();
        } else if (this.userType == "NON_MEMBER") {
          this.getKlaDepartments();
          this.getKlaRoles();
          this.getParties();
          this.sectionType = 'KLA_SECTION';
          this.getAllPortfolios();
          this.getKeralaPartyFront();
        }
      }
    });
    this.userService.getRbsRole().subscribe(Res => {
      this.listOfDisplayData = Res;
    });
  }

  getKeralaPartyFront() {
    this.userService.getKeralaPartyFrontIds().subscribe(res => {
      this.keralaPartyFrontIds = res;
    });
  }
  getMemberDesignations() {
    this.userService.getMemberDesignations().subscribe(res => {
      this.memberDesignations = res;
    });
  }
  getKlaDepartments() {
    this.userService.getKlaDepartments().subscribe(res => {
      this.klaDepartments = res;
    });
  }
  getKlaRoles() {
    this.userService.getKlaDesignations().subscribe(res => {
      this.klaRoles = res;
    });
  }
  getConstituencies() {
    this.userService.getConstituencies().subscribe(res => {
      this.contituencies = res;
      this.HideRadio();
    });
  }

  getParties() {
    this.userService.getParties().subscribe(res => {
      this.parties = res;
    });
  }
  getRolesByUserType(userType: string) {
    this.userService.getRolesByUserType(userType).subscribe(res => {
      this.roles = res;
      this.Hide();
    });
  }

  saveNewUser(event: NgForm) {
    if (this.user.password !== this.user.cpassword) {
      this.invalidPword = true;
    } else {
      this.invalidPword = false;
    }
    if (this.sectionType === 'OTHERS') {
      const section = this.klaDepartments.find(dept => dept.label === 'Others');
      this.user.klaDepartmentId = section.value;
      this.user.klaRoleId = '';
    } else if (this.sectionType === 'KLA_SECTION') {
      this.user.portfolioId = null;
      this.user.departmentId = null;
    }
    if (!this.invalidPword && event.form.status == "VALID") {
      this.user.userType = this.userType;
      if (this.userType == "MEMBER") {
        let constituency = this.contituencies.find(
          element => element.value == this.user.constituencyId
        );
        this.user.constituencyName = constituency ? constituency.label : "";
      }
      this.userService.addUser(this.user).subscribe(element => {
        this.notify.showSuccess("Add Success", "");
        this.onCancelAddForm();
      });
    }
  }

  onCancelAddForm() {
    this.router.navigate(["business-dashboard/user-management/manage-user"]);
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  showModal(): void {
    this.isVisible = true;
  }

  showRoleModal(): void {
    this.isRoleVisible = true;
  }

  onStartChange(date: Date): void {
    this.startValue = date;
  }

  onEndChange(date: Date): void {
    this.endValue = date;
  }
  addRole(): void {
    this.isRoleVisible = false;

    this.user.rbsRole.push({
      roleId: this.selectedValue.id,
      startDate: this.startValue,
      endDate: this.endValue
    });
    if (this.selectedValue && this.memberRoles.indexOf(this.selectedValue) === -1) {
      this.memberRoles = [...this.memberRoles, this.selectedValue.name];
    }
    this.selectedValue = null;
    this.startValue = null;
    this.endValue = null;
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isRoleVisible = false;
  }
  handleClose(removedTag: {}): void {
    this.memberRoles = this.memberRoles.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  getAllPortfolios() {
    this.userService.getAllPortfolios().subscribe((Res) => {
      this.minPortfolios = Res;
    });
  }

  getMinisterDepartments() {
    if (this.user.portfolioId !== null) {
      // this.userService.getMinisterDepartments(this.user.portfolioId).subscribe((Res) => {
    this.userService.getPortfolioDepartments(this.user.portfolioId).subscribe((Res) => {
        this.ministerDept = Res;
      });
    }
  }
}
