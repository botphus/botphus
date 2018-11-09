/**
 * User permission code
 */
export enum UserPermissionCode {
    // Login
    'LOGIN' = 0,
    // Admin account
    'ROOT' = 0b1,
    // System management, like person profile setting, reset password
    'SYSTEM' = 0b10,
    // Task management, like create task, manage task's testing team
    'TASK_MANAGE' = 0b100,
    // Task execution flow
    'TASK_FLOW' = 0b1000
}

/* tslint:disable:object-literal-sort-keys */
export const userPermissionMap: {
    [index: string]: number
} = {
    // User
    'post:/user/': UserPermissionCode.SYSTEM,
    'patch:/user/': UserPermissionCode.LOGIN,
    'get:/user/': UserPermissionCode.LOGIN,
    'get:/user/profile/my/': UserPermissionCode.LOGIN,
    'get:/user/profile/': UserPermissionCode.SYSTEM,
    // Connection
    'post:/connection/': UserPermissionCode.SYSTEM,
    'patch:/connection/': UserPermissionCode.SYSTEM,
    'get:/connection/': UserPermissionCode.LOGIN,
    'get:/connection/profile/': UserPermissionCode.LOGIN,
    // Task
    'post:/task/': UserPermissionCode.TASK_MANAGE,
    'patch:/task/': UserPermissionCode.TASK_MANAGE,
    'get:/task/': UserPermissionCode.LOGIN,
    'get:/task/profile/': UserPermissionCode.LOGIN,
    // Task flow
    'post:/task-flow/': UserPermissionCode.TASK_FLOW,
    'get:/task-flow/': UserPermissionCode.TASK_FLOW,
    'get:/task-flow/profile/': UserPermissionCode.TASK_FLOW,
    'get:/task-flow/start/': UserPermissionCode.TASK_FLOW,
    // Union task
    'post:/union-task/': UserPermissionCode.TASK_MANAGE,
    'patch:/union-task/': UserPermissionCode.TASK_MANAGE,
    'get:/union-task/': UserPermissionCode.LOGIN,
    'get:/union-task/profile/': UserPermissionCode.LOGIN,
    // Union Task flow
    'post:/union-task-flow/': UserPermissionCode.TASK_FLOW,
    'get:/union-task-flow/': UserPermissionCode.TASK_FLOW,
    'get:/union-task-flow/profile/': UserPermissionCode.TASK_FLOW,
    'get:/union-task-flow/start/': UserPermissionCode.TASK_FLOW,
};
/* tslint:enable:object-literal-sort-keys */
