import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "committee-create-assurance",
  templateUrl: "./create-assurance.component.html",
  styleUrls: ["./create-assurance.component.css"],
})
export class CreateAssuranceComponent implements OnInit {
  createAssuranceForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formValidation();
  }
  formValidation() {
    this.createAssuranceForm = this.fb.group({
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }
  save() {
    for (const i in this.createAssuranceForm.controls) {
      this.createAssuranceForm.controls[i].markAsDirty();
      this.createAssuranceForm.controls[i].updateValueAndValidity();
    }
  }
}
