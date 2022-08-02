import config from "../config.js";
import { file } from "../lib/file.js";
import { IsValid } from "../lib/IsValid.js";
import { utils } from "../lib/utils.js";

const handler = {};

handler.token = async (data, callback) => {
    // kliento intensija - ka jis nori daryti?
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        const httpMethodFunc = handler._innerMethods[data.httpMethod];
        return await httpMethodFunc(data, callback);
    }

    return callback(405, 'Tavo norimas HTTPmethod yra nepalaikomas');
}

handler._innerMethods = {};

// POST
handler._innerMethods.post = async (data, callback) => {
    const { payload } = data;
    const [payloadErr, payloadContent] = payload;
    if (payloadErr) {
        return callback(400, {
            msg: 'Serveris gavo duomenis netinkamu formatu',
        })
    }

    const { email, pass } = payloadContent;

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return callback(400, {
            msg: emailMsg,
        })
    }

    const [passErr, passMsg] = IsValid.password(pass);
    if (passErr) {
        return callback(400, {
            msg: passMsg,
        })
    }

    const [readErr, readMsg] = await file.read('accounts', email + '.json');
    if (readErr) {
        return callback(400, {
            msg: 'Toks vartotojas neegzistuoja arba neteisinga email ir password kombinacija',
        })
    }

    const [parseErr, userObj] = utils.parseJSONtoObject(readMsg);
    if (parseErr) {
        return callback(500, {
            msg: 'Vidine serverio klaida bandant nuskaityti vartotojo duomenis',
        })
    }

    if (userObj.isDeleted) {
        return callback(400, {
            msg: 'Toks vartotojas neegzistuoja arba neteisinga email ir password kombinacija',
        })
    }

    const [hashErr, hashMsg] = utils.hash(pass);
    if (hashErr) {
        return callback(500, {
            msg: 'Vidine serverio klaida bandant prijungti vartotoja',
        })
    }

    if (hashMsg !== userObj.hashedPassword) {
        return callback(400, {
            msg: 'Toks vartotojas neegzistuoja arba neteisinga email ir password kombinacija',
        })
    }

    const now = Date.now();
    const token = {
        email,
        id: utils.randomString(30),
        sessionStart: now,
        sessionEnd: now + config.auth.sessionLength * 1000,
    }

    const [createErr] = await file.create('tokens', token.id + '.json', token);
    if (createErr) {
        return callback(500, {
            msg: 'Nepavyko prisijungti del vidines serverio klaidos',
        })
    }

    const cookies = [
        'server-35-token=' + token.id,
        'path=/',
        'domain=localhost',
        'max-age=' + config.auth.sessionLength,
        // 'Secure',
        'SameSite=Lax',
        'HttpOnly'
    ];

    return callback(200, {
        msg: token.id,
    }, {
        'Set-Cookie': cookies.join('; '),
    })
}

// GET
handler._innerMethods.get = async (data, callback) => {
    return callback(200, {
        msg: 'Visa token informacija',
    })
}

// PUT
handler._innerMethods.put = async (data, callback) => {
    return callback(200, {
        msg: 'Token sekmingai atnaujintas',
    })
}

// DELETE
handler._innerMethods.delete = async (data, callback) => {
    return callback(200, {
        msg: 'Token sekmingai istrintas',
    })
}

export default handler;