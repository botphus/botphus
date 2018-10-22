import {FormComponentProps} from 'antd/lib/form/Form';

/**
 * Form Props
 */
export interface IFormProps extends FormComponentProps {
    loading: boolean;
    defaultValue: {
        [index: string]: any
    };
    onSubmit: (data: any) => void;
}

/**
 * Form Error message valid fields
 */
/**
 * Reqired
 */
export interface IFormErrorMsgRequiredFields {
    type: 'required';
}

/**
 * Length
 */
export interface IFormErrorMsgLengthFields {
    type: 'length';
    args: [number, number];
}
