import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { FieldConfig, Validator } from '../../field.interface';
import { filter } from 'rxjs/operators';

@Component({
  exportAs: 'dynamicForm',
  selector: 'app-dynamic-form',
  styles: [`.invalid {
    width: 100%;
    margin-top: .25rem;
    font-size: 80%;
    color: #dc3545;
}`],
  template: `
  <form nz-form class='dynamic-form' [formGroup]='form' (submit)='onSubmit($event)'>
 
    <nz-form-item  *ngFor='let field of fields'>
      <nz-form-label nzFor="field.inputType" [nzSm]="6" [nzXs]="24">{{field.label}}</nz-form-label>
      <nz-form-control [nzSm]="14" [nzXs]="24">
          <ng-container dynamicField [field]='field' [group]='form'></ng-container>
          <span *ngIf="hasError(field)" class="invalid">
            {{ "Input is required!"  }}
          </span>
      </nz-form-control>
      
    </nz-form-item>
  </form>
  `
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];

  // tslint:disable-next-line:no-output-native
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-native
  @Output() changes: EventEmitter<any> = new EventEmitter<any>();

  form = new FormGroup({});

  get value() {
    return this.form.value;
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.createControl();
    this.form.valueChanges.subscribe(Response => {
      this.changes.emit({ formValues: this.form.getRawValue(), fields: this.fields });
    });
    this.form.updateValueAndValidity();
  }

  hasError(field) {
    return (this.form.controls[field.name].invalid && this.form.controls[field.name].touched);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.getRawValue());
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === 'button') {
        return;
      }
      const control = this.fb.control({ value: field.value, disabled: field.disabled },
        this.bindValidations(field.mode != 'multiple' ? [Validators.required] : [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  // onChange() {
  //   this.fields.forEach(field => {
  //     if (field.name == "[date1]") {
  //       this.form.get(field.name).valueChanges.subscribe(val => {
  //         let c = this.fields.splice(4, 1);
  //         this.noticeService.getallWorkflow().subscribe(res => {
  //           this.fields.splice(4, 0, c[0]);
  //           this.form.get("[pm]").setValue("");
  //         });
  //       });
  //     }

  //   });
  // }
}
