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
    'get:/connection/profile/': UserPermissionCode.LOGIN
};
