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
            members: '成员',
            ruleItems: '规则列表'
        },
        TaskFlow: {
            name: '名称',
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
        Common: {
            visitForbidden: '你没有权限查询/操作该数据'
        },
        Install: {
            installClose: '已经不能进行安装'
        },
        User: {
            loginError: '登录信息错误',
            permissionDefineError: '权限定义错误',
        },
        Connection: {
            configValidError: '配置信息不正确'
        }
    },
    Schema: {
        typeError: '不合规的类型',
        requiredError: '缺少必填项',
        commonError: '数据不合规'
    },
    Client: {
        Common: {
            submitOk: '提交'
        },
        Title: {
            Install: '创建管理员帐号',
            Login: '登录帐号',
            Home: '首页',
            Profile: '个人资料',
            Connection: '数据库配置',
            Task: '测试任务',
            TaskFlow: '测试任务流水',
            TaskReport: '测试任务报告',
            User: '用户管理'
        },
        Desc: {
            Home: '了解如何使用',
            Connection: '(可选)创建数据库配置以便进行数据库验证',
            Task: '创建一个测试任务并分配成员',
            TaskFlow: '测试任务成员按任务生成测试流水',
            TaskReport: '测试流水执行并生成测试报告',
            User: '管理所有平台用户'
        }
    }
};

export default localeData;
