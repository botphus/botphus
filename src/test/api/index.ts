import connectionTest from './connection';
import taskTest from './task';
import taskFlowTest from './task_flow';
import unionTaskTest from './union_task';
import userTest from './user';

export default function() {
    describe('API', () => {
        userTest();
        connectionTest();
        taskTest();
        taskFlowTest();
        unionTaskTest();
    });
}
