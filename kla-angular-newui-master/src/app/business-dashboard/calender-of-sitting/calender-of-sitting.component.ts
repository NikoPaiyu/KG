import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CalenderofsittingService } from "./shared/services/calenderofsitting.service";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-calender-of-sitting",
  templateUrl: "./calender-of-sitting.component.html",
  styleUrls: ["./calender-of-sitting.component.scss"]
})
export class CalenderOfSittingComponent implements OnInit {
  ngOnInit() {}
}
