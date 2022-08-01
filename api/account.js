import { file } from "../lib/file.js";
import { IsValid } from "../lib/IsValid.js";
import { utils } from "../lib/utils.js";

const handler = {};

handler.account = async (data, callback) => {
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

    // 1) Patikrinti, ar atejusi informacija yra tinkama

    const { email, pass } = payloadContent;

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return callback(200, {
            msg: emailMsg,
        })
    }

    const [passErr, passMsg] = IsValid.password(pass);
    if (passErr) {
        return callback(200, {
            msg: passMsg,
        })
    }

    // 2) Patikrinti, ar toks vartotojas nera uzregistruotas
    const [readErr, readMsg] = await file.read('accounts', email + '.json');
    if (!readErr) {
        return callback(400, {
            msg: 'Toks vartotojas jau uzregistruotas',
        })
    }

    // 3) Uzregistruoti vartotoja
    // - slaptazodzio hash'inimas
    const [hashErr, hashMsg] = utils.hash(pass);
    if (hashErr) {
        return callback(500, {
            msg: 'Nepavyko sukurti vartotojo paskyros del vidines serverio klaidos',
        })
    }

    const userData = {
        email,
        hashedPassword: hashMsg,
        registerDate: Date.now(),
        // emailConfirmationDate: null,
        // lastLoginDate: null,
        // orderIDs: [],
    }

    const [createErr, createMsg] = await file.create('accounts', email + '.json', userData);
    if (createErr) {
        return callback(500, {
            msg: 'Nepavyko uzregistruoti vartotojo del vidines serverio klaidos',
        })
    }

    return callback(200, {
        msg: 'Vartotojo paskyra sukurta sekmingai',
    })
}

// GET
handler._innerMethods.get = async (data, callback) => {
    const { trimmedPath } = data;

    const email = trimmedPath.split('/')[2];

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return callback(200, {
            msg: emailMsg,
        })
    }

    const [readErr, readMsg] = await file.read('accounts', email + '.json');
    if (readErr) {
        return callback(400, {
            msg: 'Vartotojas su tokiu email nerastas',
        })
    }

    const [parseErr, parseMsg] = utils.parseJSONtoObject(readMsg);
    if (parseErr) {
        return callback(500, {
            msg: 'Nepavyko rasti vartotojo informacijos del vidines serverio klaidos',
        })
    }

    delete parseMsg.hashedPassword;

    return callback(200, {
        msg: parseMsg,
    })
}

// PUT
handler._innerMethods.put = async (data, callback) => {
    return callback(200, {
        msg: 'Vartotojo informacija sekmingai atnaujinta',
    })
}

// DELETE
handler._innerMethods.delete = async (data, callback) => {
    return callback(200, {
        msg: 'Paskyra istrinta sekmingai',
    })
}

export default handler;