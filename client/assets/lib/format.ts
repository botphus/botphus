import moment from 'moment';

import {dateFormat} from './const';

/**
 * Format number to fix precision issue
 * @param  {number} sourceNumber Source number
 * @param  {number} digit        Digit
 * @return {number}              Result number
 */
export function formatNumber(sourceNumber: number, digit: number): number {
    const accuracyNum: number = Math.pow(10, digit);
    return Math.round(sourceNumber * accuracyNum) / accuracyNum;
}

/**
 * Format date to string
 * @param  {any}    dateData Date info
 * @param  {string} format   Format string
 * @return {string}          Result string
 */
export function formatDate(dateData: any, format: string = dateFormat): string {
    switch (typeof dateData) {
    case 'string':
    case 'number':
        dateData = dateData.toString();
        if (isNaN(dateData)) { // If dateDate is date string
            return moment(new Date(dateData)).format(format);
        }
        if (dateData.length === 10) {
            return moment(new Date(parseInt(dateData, 10) * 1000)).format(format);
        }
        if (dateData.length !== 10) {
            return moment(new Date(parseInt(dateData, 10))).format(format);
        }
        break;
    case 'object':
        if (dateData instanceof Date) {
            return moment(dateData).format(format);
        }
        break;
    }
    return '-';
}
