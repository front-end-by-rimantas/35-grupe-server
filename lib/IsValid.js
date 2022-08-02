import config from "../config.js";

class IsValid {
    static email(str) {
        if (typeof str !== 'string'
            || str === '') {
            return [true, 'Email turi buti ne tuscias tekstas'];
        }

        if (!str.includes('@')) {
            return [true, 'Email turi tureti @ simboli'];
        }

        return [false, 'OK'];
    }

    static password(str) {
        if (typeof str !== 'string'
            || str.length < config.auth.minPasswordLength) {
            return [true, `Password turi buti ne trumpesnis nei ${config.auth.minPasswordLength} simboliu`];
        }
        return [false, 'OK'];
    }
}

export { IsValid }