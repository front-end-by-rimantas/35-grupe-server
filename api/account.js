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
        luckyNumber: null,
        isDeleted: false,
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

    if (parseMsg.isDeleted) {
        return callback(400, {
            msg: 'Vartotojas su tokiu email nerastas',
        })
    }

    delete parseMsg.hashedPassword;

    return callback(200, {
        msg: parseMsg,
    })
}

// PUT
handler._innerMethods.put = async (data, callback) => {
    const { trimmedPath, payload } = data;

    const email = trimmedPath.split('/')[2];

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return callback(200, {
            msg: emailMsg,
        })
    }

    const [payloadErr, payloadContent] = payload;
    if (payloadErr) {
        return callback(400, {
            msg: 'Serveris gavo duomenis netinkamu formatu',
        })
    }

    const [readErr, userJSONData] = await file.read('accounts', email + '.json');
    if (readErr) {
        return callback(400, {
            msg: 'Vartotojas su tokiu email nerastas',
        })
    }

    const [parseErr, userObj] = utils.parseJSONtoObject(userJSONData);
    if (parseErr) {
        return callback(500, {
            msg: 'Nepavyko rasti vartotojo informacijos del vidines serverio klaidos',
        })
    }

    if (userObj.isDeleted) {
        return callback(400, {
            msg: 'Vartotojas su tokiu email nerastas',
        })
    }

    const payloadKeys = Object.keys(payloadContent);

    if (payloadKeys.length === 0) {
        return callback(400, {
            msg: 'Norint atnaujinti vartotojo infomracija, reikia nurodyti bent viena reiksme',
        })
    }

    if ('email' in payloadContent) {
        return callback(400, {
            msg: 'Email reiksmes keisti negalima',
        })
    }

    let updatedValues = 0;

    if ('pass' in payloadContent) {
        const [passErr, passMsg] = IsValid.password(payloadContent.pass);
        if (passErr) {
            return callback(400, {
                msg: passMsg,
            })
        }

        const [hashErr, hashMsg] = utils.hash(payloadContent.pass);
        if (hashErr) {
            return callback(500, {
                msg: 'Nepavyko atnaujinti vartotojo informacijos del vidines serverio klaidos',
            })
        }

        userObj.hashedPassword = hashMsg;
        updatedValues++;
    }

    for (const key of payloadKeys) {
        if (key in userObj) {
            userObj[key] = payloadContent[key];
            updatedValues++;
        }
    }

    if (updatedValues !== payloadKeys.length) {
        return callback(400, {
            msg: 'Tarp norimos atnaujinti informacijos yra neleistinu elementu, todel informacija nebuvo pakeista',
        })
    }

    const [updateErr] = await file.update('accounts', email + '.json', userObj);
    if (updateErr) {
        return callback(500, {
            msg: 'Vartotojo informacija neatnaujinta del vidines serverio klaidos',
        })
    }

    return callback(200, {
        msg: 'Vartotojo informacija sekmingai atnaujinta',
    })
}

// DELETE
handler._innerMethods.delete = async (data, callback) => {
    const { trimmedPath } = data;
    const email = trimmedPath.split('/')[2];

    const [emailErr] = IsValid.email(email);
    if (emailErr) {
        return callback(400, {
            msg: 'Neteisingai nurodytas email adresas',
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
            msg: 'Nepavyko istrinti vartotojo del vidines sistemos klaidos',
        })
    }

    if (parseMsg.isDeleted) {
        return callback(400, {
            msg: 'Vartotojas su tokiu email nerastas',
        })
    }

    parseMsg.isDeleted = true;
    delete parseMsg.hashedPassword;

    const [updateErr] = await file.update('accounts', email + '.json', parseMsg);
    if (updateErr) {
        return callback(500, {
            msg: 'Nepavyko istrinti vartotojo del vidines sistemos klaidos',
        })
    }

    return callback(200, {
        msg: 'Paskyra istrinta sekmingai',
    })
}

export default handler;