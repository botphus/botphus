import connectionTest from './connection';
import taskTest from './task';
import taskFlowTest from './task_flow';
import unionTaskTest from './union_task';
import unionTaskFlowTest from './union_task_flow';
import userTest from './user';
import userGroupTest from './user_group';

export default function() {
    describe('API', () => {
        userTest();
        userGroupTest();
        connectionTest();
        taskTest();
        taskFlowTest();
        unionTaskTest();
        unionTaskFlowTest();
    });
}
