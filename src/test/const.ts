import config from '../server/modules/config';

// User test data
export const testAdminEmail = 'test-admin@test.com';
export const testPwd = 'test-password';
export const testAdminNickname = 'botphus-admin';
export const testEmail = 'test@test.com';
export const testNickname = 'botphus-user';
export const testEmail2 = 'test2@test.com';
export const sessionReg = new RegExp(`^${config.sessionCookieKey}=([^;]*)(;|)[\\S\\s]*$`);

// Connection test data
export const connectionName = 'test-conenction';
export const connectionMysqlConfig = {
    database: 'botphus_test',
    host: '127.0.0.1',
    password: '',
    user: 'travis'
};
export const connectionRedisConfig = {
  host: '127.0.0.1',
  port: 6379
};
export const connectionRedisClusterConfig = [
    {
      host: '127.0.0.1',
      port: 6379
    },
    {
      host: '127.0.0.1',
      port: 6380
    }
];
