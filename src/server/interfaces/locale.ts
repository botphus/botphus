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
        // Database fields name
        Database: {
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
        // User info
        User: {
            loginForbidden: string,
            permissionForbidden: string,
            emailVerifyError: string
        }
    };
}
