import { Component, OnInit } from "@angular/core";
import { FieldConfig } from "../../field.interface";
import { FormGroup } from "@angular/forms";
import { differenceInCalendarDays } from "date-fns";

@Component({
  selector: "app-datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrls: ["./datepicker.component.scss"],
})
export class DatepickerComponent implements OnInit {
  today = new Date();
  field: FieldConfig;
  group: FormGroup;
  dateFormate = "dd-MM-yyyy";
  constructor() {}
  ngOnInit() {}
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
}
