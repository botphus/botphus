import connectionTest from './connection';
import userTest from './user';

export default function() {
    describe('API', () => {
        userTest();
        connectionTest();
    });
}
