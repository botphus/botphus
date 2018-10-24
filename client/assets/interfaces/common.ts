import {FormComponentProps} from 'antd/lib/form/Form';

export {INumEnumValue} from '../../../src/server/interfaces/common';

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
 * Modify Form Props
 */
export interface IModifyFormProps extends IFormProps {
    isCreate: boolean;
}

/**
 * Form error message valid fields
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
