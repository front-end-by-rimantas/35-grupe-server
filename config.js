const environments = {};

environments.dev = {
    envName: 'dev',
    port: 65535,
    auth: {
        minPasswordLength: 4,
        verifyEmail: false,
        // sessionLength: 10,  // seconds
        // hardSessionLimit: 30,  // seconds
        sessionLength: 3600,  // seconds (1val)
        hardSessionLimit: 36000,  // seconds (10val)
    },
    db: {
        user: 'root',
        pass: 'asdasd',
        port: 1234,
    }
}

environments.test = {
    envName: 'test',
    port: 7331,
    auth: {
        minPasswordLength: 8,
        verifyEmail: true,
        sessionLength: 86400,  // seconds (1d)
        hardSessionLimit: 604800,  // seconds (7d)
    },
    db: {
        user: 'root-test',
        pass: 'testtesttesttest',
        port: 1234,
    }
}

environments.prod = {
    envName: 'prod',
    port: 3000,
    auth: {
        minPasswordLength: 12,
        verifyEmail: true,
        sessionLength: 2592000,  // seconds (30d)
        hardSessionLimit: 31536000,  // seconds (365d)
    },
    db: {
        user: 'root-prod',
        pass: 'frgtrh84d5ffd65a8sg6e5resr8g65rgt8s',
        port: 3456,
    }
}

let env = process.env.NODE_ENV;
env = env ? env : 'dev';
let config = environments[env];
config = config ? config : environments.dev;

export default config;