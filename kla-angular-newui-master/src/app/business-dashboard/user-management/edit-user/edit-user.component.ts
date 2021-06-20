import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDetails } from '../shared/models/userDetails';
import { UserManagementService } from '../shared/services/user-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { User } from 'src/app/auth/shared/models';
import { UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public resetPword = false;
  public invalidPword = false;
  public contituencies = [];
  public roles = [];
  public parties = [];
  public klaDepartments = [];
  public memberDesignations = [];
  public keralaPartyFrontIds = [];
  public memberGroups = [
    { label: 'Ruling', value: 'RULING_PARTY' },
    { label: 'Opposition', value: 'OPOSITION_PARTY' },
    { label: 'Treasury Bench', value: 'TREASURY_BENCH' }
  ];
  public memberTypes = [
    { label: 'Non elected Minister', value: 'NON_ELECTED' },
    { label: 'Nominated MLA', value: 'NOMINATED' }
  ];
  public klaRoles = [];
  public user: UserDetails;
  public users: UserDetails[] = [];
  public searchParam = '';

  public IsEnabled: boolean;
  public IsEnableRadio = false;
  flag: boolean;
  isVisible = false;
  selectedValue: any = null;
  listOfDisplayData;
  startValue: Date | null = null;
  endValue: Date | null = null;
  memberRoles: any = [];
  rbsRoles: any = [];
  rbsRoleNames: any = [];
  sectionType: any = '';
  public sectionTypes = [
    { label: 'KLA Section', value: 'KLA_SECTION' },
    { label: 'Others', value: 'OTHERS' }
  ];
  ministerDept: any = [];
  minPortfolios: any = [];
  isRoleVisible = false;

  Hide() {
    this.flag = false;
    const mla = this.roles.find(role => role.label == 'MLA' || role.label == "parliamentaryPartySecretary");
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
      if (this.user.userType == 'NON_MEMBER') {
        this.sectionType = 'OTHERS';
      }
      this.IsEnabled = true;
    }
  }

  HideRadio() {
    const noConstituency = this.contituencies.find(
      constituency => constituency.label == 'No Constituency'
    );
    if (noConstituency && this.user.constituencyId !== ' ') {
      if (this.user.constituencyId == noConstituency.value) {
        this.IsEnableRadio = true;
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
  public fileList = [];
  previewImage: string | undefined = '';
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
    this.user.profilePhoto = '';
    return true;
  };
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.notify.showWarning('Warning', 'You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.notify.showWarning('Warning', 'Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  };

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
        return item.response.status !== 'success';
      }
      return true;
    });
  }
  ngOnInit() {
    this.user = new UserDetails();
    this.route.params.subscribe(params => {
      let userId = params['id'];
      if (userId) {
        this.getParties();
        this.getKlaRoles();
        this.getKlaDepartments();
        this.getMemberDesignations();
        this.getKeralaPartyFront();
        this.getAllPortfolios();
        this.userService.getUserByUserName(userId).subscribe(response => {
          this.user = response;
          this.rbsRoles = this.user.rbsRole;
          this.memberRoles = this.user.rbsRole;
          this.getRolesByUserType(this.user.userType);
          this.getConstituencies();
          this.getSection();
          if (response.profilePhoto) {
            this.fileList = [
              {
                uid: -1,
                name: 'photo',
                status: 'done',
                url: this.user.profilePhoto
              }
            ];
          }
        });
      }
    });
    this.userService.getRbsRole().subscribe(Res => {
      this.listOfDisplayData = Res;
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
      this.getSection();
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

  onesetPasswordClick() {
    this.resetPword = true;
  }

  updatePassword(event: NgForm) {
    if (this.user.password !== this.user.cpassword) {
      this.invalidPword = true;
    } else {
      this.invalidPword = false;
    }
    if (!this.invalidPword && event.form.status == 'VALID') {
      this.userService
        .upDatePassword(this.user.userName, this.user.cpassword)
        .subscribe(response => {
          this.user.cpassword = '';
          this.user.password = '';
          this.notify.showSuccess('Update Success', '');
          this.onCancelResetPword();
        });
    }
  }

  onCancelEditForm() {
    this.router.navigate(['business-dashboard/user-management/manage-user']);
    this.user = new UserDetails();
  }

  onCancelResetPword() {
    this.user.cpassword = '';
    this.user.password = '';
    this.resetPword = false;
  }

  getKeralaPartyFront() {
    this.userService.getKeralaPartyFrontIds().subscribe(res => {
      this.keralaPartyFrontIds = res;
    });
  }

  updateUser(event: NgForm) {
    let index = 0;
    const roleId: any = [];
    const memRoleId: any = [];
    if (this.rbsRoles) {
      for (const role of this.rbsRoles) {
        roleId.push(role.roleId);
      }
    }
    if (this.memberRoles) {
      for (const role of this.memberRoles) {
        memRoleId.push(role.roleId);
      }
    }
    // tslint:disable-next-line:forin
    if (roleId) {
      for (const role of roleId) {
        if (memRoleId.indexOf(role) === -1) {
          this.rbsRoles[index].operationalFlag = 'D';
        }
        index++;
      }
    }
    if (this.sectionType === 'OTHERS') {
      const section = this.klaDepartments.find(dept => dept.label === 'Others');
      this.user.klaDepartmentId = section.value;
      this.user.klaRoleId = '';
    } else if (this.sectionType === 'KLA_SECTION') {
      this.user.portfolioId = (this.isMinister()) ? this.user.portfolioId : null;
      this.user.departmentId = null;
    }
    if (event.form.status == 'VALID') {
      if (this.user.userType == 'MEMBER') {
        const constituency = this.contituencies.find(
          element => element.value == this.user.constituencyId
        );
        this.user.constituencyName = constituency ? constituency.label : '';
      }
      this.userService.updateUser(this.user).subscribe(response => {
        this.notify.showSuccess('Update Success', '');
        this.onCancelEditForm();
      });
    }
  }
  deleteUser() {
    this.userService.deleteUser(this.user).subscribe(response => {
      this.notify.showSuccess('Delete Success', '');
      this.onCancelEditForm();
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  showRoleModal() {
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
    const selectedRole = {
      roleId: this.selectedValue.id,
      startDate: this.startValue,
      endDate: this.endValue,
      operationalFlag: null,
      roleName: this.selectedValue.name
    };
    const memRoleId = [];
    if (this.memberRoles) {
      for (const role of this.memberRoles) {
        memRoleId.push(role.roleId);
      }
    }
    if (this.memberRoles && memRoleId.indexOf(this.selectedValue.id) === -1) {
      this.memberRoles = [...this.memberRoles, selectedRole];
    }
    this.user.rbsRole.push({
      roleId: this.selectedValue.id,
      startDate: this.startValue,
      endDate: this.endValue,
      operationalFlag: null,
      roleName: this.selectedValue.name
    });
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

  getSection() {
    if (this.klaDepartments && this.user) {
      const section = this.klaDepartments.find(dept => dept.label === 'Others');
      if (section) {
        if (this.user.klaDepartmentId === section.value) {
          this.sectionType = 'OTHERS';
          this.getMinisterDepartments();
        } else {
          this.sectionType = 'KLA_SECTION';
        }
      }
    }
  }

  getAllPortfolios() {
    this.userService.getAllPortfolios().subscribe((Res) => {
      this.minPortfolios = Res;
    });
  }

  getMinisterDepartments() {
    if (this.user.portfolioId !== null) {
      this.userService.getPortfolioDepartments(this.user.portfolioId).subscribe((Res) => {
      //this.userService.getMinisterDepartments(this.user.portfolioId).subscribe((Res) => {
        this.ministerDept = Res;
      });
    }
  }
  isMinister() {
    if (this.user.userType === 'MEMBER' && this.user.memberGroup === "TREASURY_BENCH") {
       return true;
    }
    return false;
  }
}
