/**
 * Request method type
 * @type {String}
 */
export type RequestMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Request action: url path enums
 */
export enum RequestAction {
    'INSTALL' = '/api/user/install/',
    'LOGIN' = '/api/user/login/',
    'LOGOUT' = '/api/user/logout/',
    'USER' = '/api/user/',
    'USER_PROFILE' = '/api/user/profile/',
    'USER_SELF_PROFILE' = '/api/user/profile/my/',
    'CONNECTION' = '/api/connection/',
    'CONNECTION_PROFILE' = '/api/connection/profile/',
    'TASK' = '/api/task/',
    'TASK_PROFILE' = '/api/task/profile/',
    'TASK_FLOW' = '/api/task-flow/',
    'TASK_FLOW_PROFILE' = '/api/task-flow/profile/',
}
