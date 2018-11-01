import cache, {getRedisKey} from '../server/modules/cache';

export default function() {
    describe('Clear Data', () => {
        let models: any;
        before(() => {
            models = require('../server/models/');
        });
        it('MongoDB', (done) => {
            const promiseList: Array<Promise<void>> = [];
            Object.keys(models).filter((key) => {
                return key !== 'default';
            }).forEach((key) => {
                promiseList.push(models[key].deleteMany({}));
            });
            Promise.all(promiseList)
            .then(() => done())
            .catch(done);
        });
        it('Redis', (done) => {
            cache.keys(getRedisKey(''))
                .then((keys) => {
                    const pipe = cache.pipeline();
                    keys.forEach((key) => {
                        pipe.del(key);
                    });
                    return pipe.exec();
                })
                .then(() => done())
                .catch(done);
        });
    });
}
