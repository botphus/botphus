import ILocalePackage from '../interfaces/locale';

/* tslint:disable:object-literal-sort-keys */
const localeData: ILocalePackage = {
    locale: 'zh-cn',
    SystemCode: {
        success: '请求成功',
        notFound: '找不到该页面',
        mongoCastError: '参数类型错误',
        mongoUniqueError: '以下数据已被使用,请更换',
        unknownError: '未知异常,请联系管理员',
        permissionForbidden: '没有权限使用该功能',
        loginForbidden: '你需要登录才能使用'
    },
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
        Connection: {
            name: '名称',
            type: '类型',
            config: '配置'
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
            taskId: '所属任务',
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
        Install: {
            installClose: '已经不能进行安装'
        },
        User: {
            loginError: '登录信息错误'
        },
        Connection: {
            configValidError: '配置信息不正确'
        }
    },
    Schema: {
        typeError: '不合规的类型',
        requiredError: '缺少必填项',
        commonError: '数据不合规'
    }
};

export default localeData;
