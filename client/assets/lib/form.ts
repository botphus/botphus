import {IFormErrorMsgFields} from '../types/common';

import {localePkg} from './const';

// Get Form required error message
export function getFormRequiredErrorMsg(): string {
    return localePkg.Model.requiredError;
}

// Get Form required error message
export function getFormLengthErrorMsg(strLength: [number, number]): string {
    return strLength ? localePkg.Model.lengthError.replace(/\{ARGS\[0\]\}/g, `${strLength[0]}`).replace(/\{ARGS\[1\]\}/g, `${strLength[1]}`) : '';
}

/**
 * Get form field error message
 * @param  {string}                fieldName Field name
 * @param  {IFormErrorMsgFields[]} validList Valid list
 * @return {string}                          Error message
 */
export function getFormFieldErrorMsg(fieldName: string, validList: IFormErrorMsgFields[]): string {
    const errorMsgList: string[] = validList.map((item) => {
        switch (item.type) {
            case 'required':
                return getFormRequiredErrorMsg();
            case 'length':
                return getFormLengthErrorMsg(item.args);
        }
    });
    return `${fieldName}:${errorMsgList.join(',')}`;
}

/**
 * Check form's error
 * @param  {object}  fieldsError Fields Error
 * @return {boolean}             Error status
 */
export function formHasErrors(fieldsError: object): boolean {
    return Object.keys(fieldsError).some((field) => {
        if (fieldsError[field]) {
            if (typeof fieldsError[field][0] === 'string') {
                return true;
            } else {
                return formHasErrors(fieldsError[field]);
            }
        }
        return false;
    });
}

/**
 * Get form field placehoder
 * @param  {string} placeholderTemplate Placeholder template
 * @param  {string} fieldName           Field name
 * @return {string}                     Placeholder text
 */
export function getFormFieldPlaceholder(placeholderTemplate: string, fieldName: string): string {
    return placeholderTemplate.replace(/\$\{field\}/g, fieldName);
}
