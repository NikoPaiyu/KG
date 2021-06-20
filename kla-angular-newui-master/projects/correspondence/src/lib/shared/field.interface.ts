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
  validations?: Validator[];
}
export interface DataConfig {
  id?: string;
  code: any;
  displayName: any;
}

export interface AttachmentConfig {
  name: string;
  attachmentUrl: string;
  type: string;
}
