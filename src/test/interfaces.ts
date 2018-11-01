import * as request from 'supertest';

import {IHttpResponseMessage} from '../server/interfaces/common';

export interface IRequestData extends request.Request {
    body: IHttpResponseMessage;
    header: any;
}
