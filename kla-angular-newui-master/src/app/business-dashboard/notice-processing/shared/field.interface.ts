export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface FieldConfig {
  inputValue: any;
  templateInputId: any;
  label?: string;
  name?: string;
  inputType?: string;
  options?: any;
  serviceMethod?: any;
  collections?: any;
  type: string;
  value?: any;
  mode?: any;
  disabled?: boolean;
  ministerId?: number;
  questionType: string;
  questionId: string;
  validations?: Validator[];
}
export interface statusConfig {
  status?: any;
}
