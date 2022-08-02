const environments = {};

environments.dev = {
    port: 65535,
    auth: {
        minPasswordLength: 4,
        verifyEmail: false,
        sessionLength: 600,  // seconds
    },
    db: {
        user: 'root',
        pass: 'asdasd',
        port: 1234,
    }
}

environments.test = {
    port: 7331,
    auth: {
        minPasswordLength: 8,
        verifyEmail: true,
        sessionLength: 86400,  // seconds
    },
    db: {
        user: 'root-test',
        pass: 'testtesttesttest',
        port: 1234,
    }
}

environments.prod = {
    port: 3000,
    auth: {
        minPasswordLength: 12,
        verifyEmail: true,
        sessionLength: 31536000,  // seconds
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