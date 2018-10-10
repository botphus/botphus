import {SystemCode} from '../types/common';

export interface ISystemError extends Error {
    code?: SystemCode;
}
