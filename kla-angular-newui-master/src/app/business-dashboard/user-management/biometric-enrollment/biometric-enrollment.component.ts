import { Component, OnInit } from "@angular/core";
import { UserManagementService } from "../shared/services/user-management.service";
import { DataSource } from "@angular/cdk/collections";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-biometric-enrollment",
  templateUrl: "./biometric-enrollment.component.html",
  styleUrls: ["./biometric-enrollment.component.scss"]
})
export class BiometricEnrollmentComponent implements OnInit {
  userId = 0;
  searchParam = "";
  fingerName = "";
  memberList = [];
  filtermemberList = [];
  biometricDetails = [];
  ShowEnrollmentModal = false;
  responseText = "";
  mainResponseText = "";
  responseStatus = true;
  Processing = false;
  constructor(
    private service: UserManagementService,
    public notify: NotificationCustomService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllMembers();
  }
  getBiometricListByMemberId() {
    const data = this.memberList.filter(x => x.userId === this.userId);
    if (data.length > 0) {
      const biometricDetails = this.memberList.filter(
        x => x.userId === this.userId
      );
      if (biometricDetails.length > 0) {
        this.biometricDetails = biometricDetails[0].userHashes;
      }
    }
  }
  getAllMembers() {
    this.service.getAllMembersWithBiometrics().subscribe(Response => {
      if (Response) {
        this.memberList = Response as any;
        this.filtermemberList = this.memberList;
      }
    });
  }
  startDevice(userId) {
    this.userId = userId;
    this.service.startDevice().subscribe(Response => {
      if (Response.status) {
        this.ShowEnrollmentModal = true;
        this.enrollUserBiometrics(userId);
      } else {
        this.notify.showError("Error", Response.message);
      }
    });
  }
  enrollUserBiometrics(userId) {
    if (userId > 0) {
      this.userId = userId;
    }
    if (!this.Processing) {
      this.Processing = true;
      this.responseText = "";
      let arrayLength = 1;
      if (this.biometricDetails) {
        arrayLength = this.biometricDetails.length + 1;
      }
      this.fingerName = `Finger ` + arrayLength;
      this.service
        .registerUser(this.userId, this.fingerName)
        .subscribe(Response => {
          this.Processing = false;
          this.ShowEnrollmentModal = true;
          if (Response) {
            this.responseStatus = Response.status;
            if (Response.status === true) {
              const datas: any = Response;
              if (datas.userHashes) {
                this.biometricDetails = datas.userHashes;
                if (this.biometricDetails.length > 2) {
                  this.responseStatus = true;
                  this.responseText = "Biometric enrollment completed";
                }
              } else {
                this.responseText = "Something went wrong.please try again";
              }
            } else {
              this.responseStatus = false;
              this.responseText = Response.message;
            }
          }
        });
    }
  }
  stopDevice() {
    this.service.stopDevice().subscribe(Response => {
      if (Response) {
        this.responseStatus = Response.status;
        this.userId = 0;
        this.biometricDetails = [];
        this.getAllMembers();
        if (Response.status) {
          this.ShowEnrollmentModal = false;
        } else {
          this.responseText = Response.message;
        }
      }
    });
  }
  onSearchUser() {
    this.filtermemberList = this.memberList.filter(x =>
      x.details.fullName.toLowerCase().includes(this.searchParam.toLowerCase())
    );
  }
  deleteBiometrics(userBioId) {
    this.service.deleteBiometricByUserId(userBioId).subscribe( Response => {
      if (Response) {
        this.getAllMembers();
      }
    });
  }
  cancelDelete() {
    // Do nothing
  }
}
