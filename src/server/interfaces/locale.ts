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
    };
    Placehoder: {
        Input: string;
        Select: string;
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
            members: string;
            ruleItems: string;
        };
        // Task flow fields name
        TaskFlow: {
            name: string;
            startPage: string;
            pageType: string;
            mysqlId: string;
            redisId: string;
            taskId: string;
            excludeOption: string;
        };
        // Task report
        TaskReport: {
            index: string;
            success: string;
            message: string;
            flowId: string;
        };
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
            cancel: string;
            login: string;
            logout: string;
            submit: string;
            search: string;
            addRedisConfig: string;
        };
        // Title
        Title: {
            Install: string;
            Login: string;
            Home: string;
            Profile: string;
            Connection: string;
            ConnectionRedisConfig: string;
            ConnectionRedisClusterConfig: string;
            Task: string;
            TaskFlow: string;
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
    };
}
