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
import { FieldConfig, statusConfig, Validator } from '../../field.interface';
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
      <nz-form-label nzFor="field.inputType" [nzSm]="6" [nzXs]="24">{{filterLabel(field.label)}}</nz-form-label>
      <nz-form-control [nzSm]="14" [nzXs]="24">
          <ng-container dynamicField [field]='field' [group]='form' [FormData]="fields" [status]='status'></ng-container>
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
  @Input() status: statusConfig[] = [];
  // tslint:disable-next-line:no-output-native
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-native
  @Output() changes: EventEmitter<any> = new EventEmitter<any>();

  form = new FormGroup({});

  get value() {
    return this.form.value;
  }
  constructor(private fb: FormBuilder) { }

  filterLabel(label) {
    label = label.split('[').join('');
    label = label.split(']').join('');
    return label;
  }

  ngOnInit() {
    this.form = this.createControl();
    this.form.valueChanges.subscribe(Response => {
      this.clearQuestionNumber();
      this.changes.emit({ formValues: this.form.getRawValue(), fields: this.fields });
    });
    this.form.updateValueAndValidity();
  }
  clearQuestionNumber() {
    const questiontypeData = this.fields.find(x => x.type === 'questiontype');
    if (questiontypeData) {
      const label = questiontypeData.label;
      if (this.fields.find(x => x.label === label)) {
          const questionNumberData = this.fields.find(x => x.type === 'questionlist');
          const answerDateData = this.fields.find(x => x.type === 'questionanswerdate');
          this.form.get(questiontypeData.label).valueChanges.subscribe(res => {
              const qtLabel = questionNumberData.label;
              const anLabel = answerDateData.label;
              if (this.form.get(qtLabel).value && this.form.get(anLabel).value.id) {
                this.form.get(qtLabel).reset();
                this.form.get(anLabel).reset();
                this.form.updateValueAndValidity();
              }
          });
      }
    }
    const questionListData = this.fields.find(x => x.type === 'questionlist');
    if (questionListData) {
      const answerData =  this.fields.find(x => x.type === 'questionanswerdate');
      if (answerData) {
        this.form.get(questionListData.label).valueChanges.subscribe(res => {
          if (this.form.get(answerData.label).value) {
            this.form.get(answerData.label).reset();
            this.form.updateValueAndValidity();
          } else {
            console.log(this.form.get(questionListData.label).value);
            if (this.form.get(questionListData.label).value && this.form.get(questionListData.label).value.id) {
              const options = answerData.options.filter(x => x.parentId == this.form.get(questionListData.label).value.id);
              if (!this.form.get(answerData.label).value) {
                this.form.get(answerData.label).setValue(Number(options[0].id));
                this.form.updateValueAndValidity();
              }
            }
          }
        });
      }
    }
    const aodministerlistData = this.fields.find(x => x.type === 'aodministerlist');
    if (aodministerlistData) {
      const ministerData =  this.fields.find(x => x.type === 'portfoliosubject');
      const aodData =  this.fields.find(x => x.type === 'portfoliosubject');
      if (ministerData) {
        this.form.get(aodministerlistData.label).valueChanges.subscribe(res => {
          if (this.form.get(ministerData.label).value) {
            this.form.get(ministerData.label).reset();
            this.form.get(aodData.label).reset();
            this.form.updateValueAndValidity();
          }
        });
      }
    }
    const portfolioData = this.fields.find(x => x.type === 'portfoliosubject');
    if (portfolioData) {
      const aodDates =  this.fields.find(x => x.type === 'aod');
      if (aodDates) {
        this.form.get(portfolioData.label).valueChanges.subscribe(res => {
          if (this.form.get(aodDates.label).value) {
              this.form.get(aodDates.label).reset();
              this.form.updateValueAndValidity();
          }
        });
      }
    }
    const answerDate = this.fields.find(x => x.type == 'questionanswerdate');
    if (answerDate && answerDate.value) {
      if (!this.form.get(answerDate.label).value) {
        this.form.get(answerDate.label).setValue(answerDate.options[0]);
        this.form.updateValueAndValidity();
      }
    }
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
