import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'nz-minute_details',
  templateUrl: './minute_details.component.html',
  styleUrls: ['./minute-details.component.css']
})

export class NzDemoFormDynamicRuleComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  requiredChange(required: boolean): void {
    if (!required) {
      this.validateForm.get('nickname')!.clearValidators();
      this.validateForm.get('nickname')!.markAsPristine();
    } else {
      this.validateForm.get('nickname')!.setValidators(Validators.required);
      this.validateForm.get('nickname')!.markAsDirty();
    }
    this.validateForm.get('nickname')!.updateValueAndValidity();
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null],
      required: [false]
    });
  }
}
