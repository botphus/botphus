import ILocalePackage from '../interfaces/locale';

/* tslint:disable:object-literal-sort-keys */
const localeData: ILocalePackage = {
    locale: 'zh-cn',
    Enum: {
        UserPermissionCode: {
            ROOT: '管理员',
            SYSTEM: '系统配置',
            TASK_MANAGE: '任务管理',
            TASK_FLOW: '任务流水执行'
        },
        ConnectionType: {
            MYSQL: 'Mysql数据库',
            REDIS: 'Redis缓存服务器'
        }
    },
    Placehoder: {
        Input: '请输入${field}',
        Select: '请选择${field}'
    },
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
            password: '密码',
            enable: '是否可用'
        },
        Connection: {
            name: '名称',
            type: '类型',
            config: '配置详情',
            mysqlConfig: {
                database: '数据库名',
                host: '主机地址',
                password: '登录密码',
                user: '登录用户名',
                port: '主机端口'
            },
            redisConfig: {
                host: '主机地址',
                port: '主机端口'
            }
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
            rootPermissionError: '站点管理员账户不能被修改任何内容,修改请转至个人资料',
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
        Action: {
            title: '操作',
            create: '创建数据',
            detail: '详情',
            modify: '编辑',
            remove: '删除',
            cancel: '返回',
            login: '登录',
            logout: '登出',
            submit: '提交',
            search: '搜索',
            addRedisConfig: '添加redis配置',
        },
        Title: {
            Install: '创建管理员帐号',
            Login: '登录帐号',
            Home: '首页',
            Profile: '个人资料',
            Connection: '数据连接配置',
            ConnectionRedisConfig: 'Redis配置',
            ConnectionRedisClusterConfig: 'Redis集群配置',
            Task: '测试任务',
            TaskFlow: '测试任务流水',
            TaskReport: '测试任务报告',
            User: '用户管理'
        },
        Desc: {
            Home: '了解如何使用',
            Connection: '(可选)创建数据连接(Mysql/Redis等)配置以便进行数据验证',
            Task: '创建一个测试任务并分配成员',
            TaskFlow: '测试任务成员按任务生成测试流水',
            TaskReport: '测试流水执行并生成测试报告',
            User: '管理所有平台用户'
        }
    }
};

export default localeData;
