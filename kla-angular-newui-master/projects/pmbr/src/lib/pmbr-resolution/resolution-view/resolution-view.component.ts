import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'pmbr-resolution-view',
  templateUrl: './resolution-view.component.html',
  styleUrls: ['./resolution-view.component.css']
})
export class ResolutionViewComponent implements OnInit {
  resolutionForm: FormGroup

  constructor(private formBuilder: FormBuilder,
              ){ 
    this.createForm();

  }

  resolutionStatus = [
    {
      label: "Resolution Status1",
      value: "A",
    },
    {
      label: "Resolution Status2",
      value: "B",
    },
  ];
  department = [
    {
      label: "department1",
      value: "A",
    },
    {
      label: "department2",
      value: "B",
    },
  ];
  createForm() {
    this.resolutionForm = this.formBuilder.group({
      status: [null, [Validators.required]],
      minister: [null, [Validators.required]],
      department: [null, [Validators.required]],
      date: [null, [Validators.required]]

    })
  }
  
  ngOnInit() {
  }

}
