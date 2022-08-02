import crypto from 'crypto';

const utils = {};

utils.fileExtension = (url) => {
    // www.psl.lt/js/main.js
    // www.psl.lt/js/main.min.js
    // www.psl.lt/js/main.5rg5e1f65res.js
    // www.psl.lt/js/main.js?v=1.33.7
    // www.psl.lt/js/main.min.js?v=1.33.7

    const mainPart = url.split('?')[0];
    const dotParts = mainPart.split('.');
    return dotParts[dotParts.length - 1];
}

utils.parseJSONtoObject = (str) => {
    try {
        return [false, JSON.parse(str)];
    } catch (error) {
        return [true, {}];
    }
}

utils.hash = (str) => {
    try {
        return [false, crypto.createHmac('sha256', '984g5f5efretgs5f265').update(str).digest('hex')];
    } catch (error) {
        return [true, str];
    }
}

utils.randomString = (size = 20) => {
    if (typeof size !== 'number'
        || !isFinite(size)
        || size < 0) {
        return [true, 'Dydis turi buti teigiamas normalus skaicius'];
    }
    const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';

    for (let i = 0; i < size; i++) {
        str += abc[Math.floor(Math.random() * abc.length)];
    }

    return str;
}

export { utils };