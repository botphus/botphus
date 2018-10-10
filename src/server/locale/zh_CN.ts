import ILocalePackage from '../interfaces/locale';

/* tslint:disable:object-literal-sort-keys */
const localeData: ILocalePackage = {
    locale: 'zh-cn',
    Model: {
        requiredError: '必须填写该内容',
        formatError: '该内容不合规',
        lengthError: '必须为{ARGS[0]}-{ARGS[1]}之间的字符',
        numberMinError: '必须大于{ARGS[0]}',
        urlError: '无效的网页地址',
        Common: {
            createdUser: '创建用户'
        },
        User: {
            email: '邮箱',
            nickname: '昵称',
            permission: '权限',
            password: '密码'
        },
        Database: {
            name: '名称',
            type: '类型',
            config: '配置文件'
        },
        Task: {
            name: '名称',
            memebers: '成员',
            items: '规则列表'
        },
        TaskFlow: {
            startPage: '起始页',
            pageType: '页面类型',
            mysqlId: 'MYSQL配置',
            redisId: 'Redis配置',
            excludeOption: '过滤单元'
        },
        TaskReport: {
            index: '单元编号',
            success: '单元执行结果',
            message: '单元执行信息',
            flowId: '所属流水'
        }
    },
    Service: {
        User: {
            loginForbidden: '该功能必须登录才能使用',
            permissionForbidden: '没有权限使用该功能',
            emailVerifyError: '该邮箱已存在'
        }
    }
};

export default localeData;
