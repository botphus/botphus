import connectionTest from './connection';
import taskTest from './task';
import taskFlowTest from './task_flow';
import userTest from './user';

export default function() {
    describe('API', () => {
        userTest();
        connectionTest();
        taskTest();
        taskFlowTest();
    });
}
