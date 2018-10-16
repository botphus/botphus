export default interface ILocalePackage {
    // locale code name
    locale: string;
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
            memebers: string;
            items: string;
        };
        // Task flow fields name
        TaskFlow: {
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
        }
    };
    // Service Error
    Service: {
        Install: {
            installClose: string;
        }
        // User info
        User: {
            loginError: string;
        }
    };
    // Schema Valid Error
    Schema: {
        typeError: string;
        requiredError: string;
        commonError: string;
    };
}
