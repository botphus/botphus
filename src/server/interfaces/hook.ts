import {HookType} from '../types/hook';
import {IAppReply, IAppRequest} from './common';

/**
 * Base hook
 */
interface IBaseHook {
    type: HookType;
}

/**
 * Auth login return with email string
 */
interface IAuthLoginHook extends IBaseHook {
    type: HookType.AUTH_LOGIN;
    hookFunc: (req: IAppRequest, reply: IAppReply) => void | Promise<void>;
}

export type IBotphusHook = IAuthLoginHook;
