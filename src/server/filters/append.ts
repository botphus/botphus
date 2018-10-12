import {app, getHttpErrorMsg} from '../modules/util';

import {ISystemError} from '../interfaces/common';
import {SystemCode} from '../types/common';

// Set error handle
app.setErrorHandler((error: ISystemError, _request, reply) => {
    // 返回数据
    const params = getHttpErrorMsg(error);

    // 设置特殊情况下的http状态码，否则为200
    switch (params.code) {
    case SystemCode.FORBIDDEN:
    case SystemCode.NOT_FOUND:
    case SystemCode.UNKNOWN_ERROR:
        reply.status(params.code);
        break;
    }
    reply.send(params);
});
