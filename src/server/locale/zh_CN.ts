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
        },
        TaskPageType: {
            NORMAL: '普通页面',
            SINGLE_PAGE: '单页应用'
        },
        TaskType: {
            TYPE_DATA: '数据类',
            TYPE_DOM: 'DOM处理类',
            TYPE_EVENT: '事件类',
            TYPE_PAGE: '页面类',
            TYPE_TIME: '时间类'
        },
        TaskTypeDataSubType: {
            SUB_TYPE_MYSQL: 'Mysql查询',
            SUB_TYPE_REDIS: 'Redis查询'
        },
        TaskTypeDomSubType: {
            SUB_TYPE_CLICK: '鼠标点击',
            SUB_TYPE_KEYBOARD: '输入内容',
            SUB_TYPE_GET_ATTR: '获取属性',
            SUB_TYPE_GET_HTML: '获取HTML内容',
            SUB_TYPE_GET_TEXT: '获取纯文本',
            SUB_TYPE_SET_ATTR: '设置属性',
            SUB_TYPE_SET_INPUT_FILES: '上传文件'
        },
        TaskTypeEventSubType: {
            SUB_TYPE_CONSOLE: '监听控制台',
            SUB_TYPE_DIALOG: '监听弹窗',
            SUB_TYPE_REQUEST: '监听请求发起',
            SUB_TYPE_RESPONSE: '监听请求结束'
        },
        TaskTypePageSubType: {
            SUB_TYPE_GOTO: '跳转页面',
            SUB_TYPE_RELOAD: '刷新页面',
            SUB_TYPE_SCREENSHOT: '页面截图',
            SUB_TYPE_DELETE_COOKIE: '删除cookie',
            SUB_TYPE_GET_COOKIE: '获取cookie',
            SUB_TYPE_SET_COOKIE: '设置cookie'
        },
        TaskTypeTimeSubType: {
            SUB_TYPE_SET_SLEEP: '睡眠'
        },
        TaskReportStatus: {
            PENDING: '待执行',
            FAILED: '执行失败',
            SUCCESS: '执行成功',
            IGNORE: '跳过执行',
            ONGOING: '执行中'
        }
    },
    Placehoder: {
        Input: '请输入${field}',
        Select: '请选择${field}',
        Search: '请输入${field}搜索',
        NotFound: '未找到${field}'
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
        requiredError: '必须添加该内容',
        formatError: '该内容不合规',
        lengthError: '必须为{ARGS[0]}-{ARGS[1]}之间的字符',
        numberMinError: '必须大于{ARGS[0]}',
        urlError: '无效的网页地址',
        Common: {
            createdUser: '创建用户',
            createdAt: '创建时间',
            updateAt: '更新时间'
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
            pageType: '页面类型',
            members: '成员',
            ruleItems: '规则列表',
            ruleItem: {
                name: '规则名称',
                type: '规则类型',
                subType: '规则子类型',
                arguments: {
                    mysql: 'SQL语句',
                    redis: 'Redis命令',
                    querySelector: 'DOM选择器',
                    querySelectorText: '输入文本',
                    querySelectorAttrName: '属性名',
                    querySelectorAttrValue: '属性值',
                    eventTimeout: '超时时间(ms)',
                    eventPath: '匹配地址',
                    sleepTime: '睡眠时间(ms)',
                    gotoPath: '跳转地址'
                },
                assertion: '验证规则',
                assertionVarName: '规则变量名',
            }
        },
        TaskFlow: {
            name: '名称',
            startPage: '起始页',
            mysqlId: 'MYSQL配置',
            redisId: 'Redis配置',
            taskId: '所属任务',
            excludeOption: '过滤单元'
        },
        TaskReport: {
            index: '单元编号',
            status: '单元执行状态',
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
        },
        TaskFlow: {
            startForbidden: '你不能运行一个已过期的任务流水,请重新创建流水',
            taskCreateError: '创建任务错误'
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
            top: '置顶',
            next: '下一步',
            prev: '上一步',
            login: '登录',
            logout: '登出',
            submit: '提交',
            search: '搜索',
            addRedisConfig: '添加redis配置',
            addTaskRule: '添加任务规则',
            startTaskFlow: '执行任务流水'
        },
        Title: {
            Install: '创建管理员帐号',
            Login: '登录帐号',
            Home: '首页',
            Profile: '个人资料',
            Connection: '数据连接配置',
            ConnectionMysqlConfig: 'Mysql配置',
            ConnectionRedisConfig: 'Redis配置',
            ConnectionRedisClusterConfig: 'Redis集群配置',
            Task: '测试任务',
            TaskBasic: '基本信息',
            TaskRule: '任务规则',
            TaskFlow: '测试任务流水',
            TaskFlowBasic: '基本信息',
            TaskFlowRule: '测试单元',
            TaskFlowConnection: '连接配置',
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
        },
        Help: {
            FetchFaild: '获取数据失败',
            removeAction: '你确定要删除这条数据吗?',
            taskRuleDragError: '只有事件类才允许拥有子规则',
            taskRuleEventEmptyTip: '事件类规则必须包含子规则',
            TaskRuleItem: {
                assertion: '规则断言内容,每行一个判断规则,遵循JS语法,如data==="123"(data为规则变量名)',
                assertionVarName: '断言内容的变量名称,默认为data',
                arguments: {
                    redis: '如set name 111,请注意方法名均为小写',
                    querySelector: 'Chrome中可以使用"控制台->Elements->右键对应节点->Copy->Copy selector"快速选择节点',
                    eventTimeout: '超过该设置时间则视为监听失败',
                    eventPath: '模糊匹配,只有该地址才进行监听'
                }
            },
            TaskFlow: {
                connectionId: '如果没有数据类查询规则,你可以不选择'
            }
        }
    }
};

export default localeData;
