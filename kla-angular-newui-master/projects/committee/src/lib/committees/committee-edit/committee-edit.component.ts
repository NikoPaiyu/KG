import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
@Component({
  selector: 'committee-committee-edit',
  templateUrl: './committee-edit.component.html',
  styleUrls: ['./committee-edit.component.css']
})
export class CommitteeEditComponent implements OnInit {
  validateForm!: FormGroup;
  dateofconstitution = "28/10/2020";
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  listOfControls: Array<{ id: number; controlInstance: string }> = [];
  constructor() { }
  removeField1(
    i: { id: number; controlInstance: string },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControls.length > 1) {
      const index = this.listOfControls.indexOf(i);
      this.listOfControls.splice(index, 1);
      console.log(this.listOfControls);
      this.validateForm.removeControl(i.controlInstance);
    }
  }
  addField1(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControls.length > 0
        ? this.listOfControls[this.listOfControls.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `member${id}`,
    };
    const index = this.listOfControls.push(control);
    console.log(this.listOfControls[this.listOfControls.length - 1]);
    this.validateForm.addControl(
      this.listOfControls[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(
    i: { id: number; controlInstance: string },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `member${id}`,
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }
  ngOnInit() {
  }

}
