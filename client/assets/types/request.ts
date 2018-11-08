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
    'TASK_FLOW_START' = '/api/task-flow/start/',
    'UNION_TASK' = '/api/union-task/',
    'UNION_TASK_PROFILE' = '/api/union-task/profile/',
    'UNION_TASK_FLOW' = '/api/union-task-flow/',
    'UNION_TASK_FLOW_PROFILE' = '/api/union-task-flow/profile/',
    'UNION_TASK_FLOW_START' = '/api/union-task-flow/start/',
}
