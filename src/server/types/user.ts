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
    'post:/user/': UserPermissionCode.SYSTEM,
    'patch:/user/': UserPermissionCode.LOGIN
};
