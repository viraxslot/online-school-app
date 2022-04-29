const appConfig: {
    env: string;
    host: string;
    database: string;
    username: string;
    password: string;
    dialect: string;
    apiUrl: string;
    apiKeys: string;
    apiKey: string;
    basicAuth: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    adminLogin: string;
    adminPassword: string;
    aws: {
        accessKeyId: string;
        secretKeyId: string;
        region: string;
        cloudWatchLogGroup: string;
    };
};

export default appConfig;
