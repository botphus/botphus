export default interface ILocalePackage {
    // locale code name
    locale: string;
    // Enum
    Enum: {
        UserPermissionCode: {
            ROOT: string;
            SYSTEM: string;
            TASK_MANAGE: string;
            TASK_FLOW: string;
        };
        ConnectionType: {
            MYSQL: string;
            REDIS: string;
        };
        TaskPageType: {
            NORMAL: string;
            SINGLE_PAGE: string;
        }
        TaskType: {
            TYPE_DATA: string;
            TYPE_DOM: string;
            TYPE_EVENT: string;
            TYPE_TIME: string;
            TYPE_PAGE: string;
        };
        TaskTypeDataSubType: {
            SUB_TYPE_MYSQL: string;
            SUB_TYPE_REDIS: string;
        };
        TaskTypeDomSubType: {
            SUB_TYPE_KEYBOARD: string;
            SUB_TYPE_SET_ATTR: string;
            SUB_TYPE_GET_ATTR: string;
            SUB_TYPE_GET_HTML: string;
            SUB_TYPE_GET_TEXT: string;
            SUB_TYPE_CLICK: string;
            SUB_TYPE_SET_INPUT_FILES: string;
        };
        TaskTypeEventSubType: {
            SUB_TYPE_REQUEST: string;
            SUB_TYPE_RESPONSE: string;
            SUB_TYPE_CONSOLE: string;
            SUB_TYPE_DIALOG: string;
        };
        TaskTypeTimeSubType: {
            SUB_TYPE_SET_SLEEP: string;
        };
        TaskTypePageSubType: {
            SUB_TYPE_RELOAD: string;
            SUB_TYPE_SET_COOKIE: string;
            SUB_TYPE_GET_COOKIE: string;
            SUB_TYPE_DELETE_COOKIE: string;
            SUB_TYPE_GOTO: string;
            SUB_TYPE_SCREENSHOT: string;
        };
        TaskReportStatus: {
            PENDING: string;
            FAILED: string;
            SUCCESS: string;
            IGNORE: string;
            ONGOING: string;
        };
        TaskFlowStatus: {
            PENDING: string;
            FAILED: string;
            CLOSE: string;
            SUCCESS: string;
            ONGOING: string;
        };
    };
    Placehoder: {
        Input: string;
        Select: string;
        Search: string;
        NotFound: string;
        Empty: string;
    };
    // System code error message
    SystemCode: {
        success: string;
        notFound: string;
        mongoCastError: string;
        mongoUniqueError: string;
        unknownError: string;
        loginForbidden: string;
        permissionForbidden: string;
    };
    // Mongoose Model valid info
    Model: {
        requiredError: string;
        formatError: string;
        lengthError: string;
        numberMinError: string;
        urlError: string;
        Common: {
            createdUser: string;
            createdAt: string;
            updateAt: string;
        };
        // User fields name
        User: {
            email: string;
            nickname: string;
            permission: string;
            password: string;
            enable: string;
        };
        // Connection fields name
        Connection: {
            name: string;
            type: string;
            config: string;
            mysqlConfig: {
                database: string;
                host: string;
                password: string;
                user: string;
                port: string;
            };
            redisConfig: {
                host: string;
                port: string;
            };
        };
        // Task fields name
        Task: {
            name: string;
            pageType: string;
            members: string;
            ruleItems: string;
            ruleItem: {
                name: string;
                type: string;
                subType: string;
                arguments: {
                    mysql: string;
                    redis: string;
                    querySelector: string;
                    querySelectorHumanClick: string;
                    querySelectorText: string;
                    querySelectorAttrName: string;
                    querySelectorAttrValue: string;
                    eventTimeout: string;
                    eventPath: string;
                    sleepTime: string;
                    gotoPath: string;
                };
                assertion: string;
                assertionVarName: string;
            }
        };
        // Task flow fields name
        TaskFlow: {
            name: string;
            startPage: string;
            mysqlId: string;
            redisId: string;
            taskId: string;
            excludeOption: string;
            status: string;
        };
        // Task report
        TaskReport: {
            index: string;
            status: string;
            message: string;
            receiveData: string;
            flowId: string;
        };
        // Union task
        UnionTask: {
            name: string;
            members: string;
            taskItems: string;
            taskItem: {
                taskId: string;
                startPage: string;
                ignoreError: string;
            }
        }
    };
    // Service Error
    Service: {
        Common: {
            visitForbidden: string;
        };
        Install: {
            installClose: string;
        };
        // User info
        User: {
            loginError: string;
            rootPermissionError: string;
        };
        // Connection info
        Connection: {
            configValidError: string;
        };
        // Task info
        TaskFlow: {
            startForbidden: string;
            taskCreateError: string;
            taskStartSuccess: string;
        }
    };
    // Schema Valid Error
    Schema: {
        typeError: string;
        requiredError: string;
        commonError: string;
    };
    // Client
    Client: {
        // Action
        Action: {
            title: string;
            create: string;
            detail: string;
            modify: string;
            remove: string;
            copy: string;
            cancel: string;
            top: string;
            next: string;
            prev: string;
            login: string;
            logout: string;
            submit: string;
            search: string;
            addRedisConfig: string;
            addTaskRule: string;
            startTaskFlow: string;
            restartTaskFlow: string;
        };
        // Title
        Title: {
            Install: string;
            Login: string;
            Home: string;
            Profile: string;
            Connection: string;
            ConnectionMysqlConfig: string;
            ConnectionRedisConfig: string;
            ConnectionRedisClusterConfig: string;
            Task: string;
            TaskBasic: string;
            TaskRule: string;
            TaskFlow: string;
            TaskFlowBasic: string;
            TaskFlowRule: string;
            TaskFlowConnection: string;
            TaskReport: string;
            User: string;
        };
        // Description
        Desc: {
            Home: string;
            Connection: string;
            Task: string;
            TaskFlow: string;
            TaskReport: string;
            User: string;
        };
        Help: {
            FetchFaild: string;
            removeAction: string;
            taskRuleDragError: string;
            taskRuleEventEmptyTip: string;
            TaskRuleItem: {
                assertion: string;
                assertionVarName: string;
                arguments: {
                    redis: string;
                    querySelector: string;
                    querySelectorHumanClick: string;
                    eventTimeout: string;
                    eventPath: string;
                };
            };
            TaskFlow: {
                connectionId: string;
            }
        }
    };
}
