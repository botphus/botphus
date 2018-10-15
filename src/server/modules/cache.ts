import * as Redis from 'ioredis';

import config from './config';

let redisClient: Redis.Redis;

if (Array.isArray(config.redis)) {
    redisClient = new Redis.Cluster(config.redis);
} else {
    redisClient = new Redis(config.redis);
}

export default redisClient;
