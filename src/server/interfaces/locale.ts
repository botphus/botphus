export default interface ILocalePackage {
    // locale code name
    locale: string;
    // Enum
    Enum: {
        UserPermissionCode: {
            'ROOT': string;
            'SYSTEM': string;
            'TASK_MANAGE': string;
            'TASK_FLOW': string;
        }
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
        };
        // Connection fields name
        Connection: {
            name: string;
            type: string;
            config: string;
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
            permissionDefineError: string;
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
            login: string;
            logout: string;
            submit: string;
            search: string;
        };
        // Title
        Title: {
            Install: string;
            Login: string;
            Home: string;
            Profile: string;
            Connection: string;
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
