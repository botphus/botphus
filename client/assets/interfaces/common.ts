import {FormComponentProps} from 'antd/lib/form/Form';

export {INumEnumValue, IIndexMap} from '../../../src/server/interfaces/common';
import {INumEnumValue} from '../../../src/server/interfaces/common';

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
 * Form Select Option data
 */
export interface IFormSelectOptionItem {
    key: string;
    label: string;
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

/**
 * Enum with label
 */
export interface INumEnumValueWithLabel extends INumEnumValue {
    label: string;
}
