/**
 * User permission code
 */
export enum UserPermissionCode {
    // Admin account
    'ROOT' = 0b1,
    // System management, like person profile setting, reset password
    'SYSTEM' = 0b10,
    // Task management, like create task, manage task's testing team
    'TASK_MANAGE' = 0b100,
    // Task execution flow
    'TASK_FLOW' = 0b1000
}

export const userPermissionMap: {
    [index: string]: number
} = {
    'post:/user/create/': UserPermissionCode.SYSTEM
};
