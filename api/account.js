import { IsValid } from "../lib/IsValid.js";

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

    // 2) Patikrinti, ar toks vartotojas nera uzregistruotas

    // 3) Uzregistruoti vartotoja
    // - slaptazodzio hash'inimas

    return callback(200, {
        msg: 'Vartotojo paskyra sukurta sekmingai',
    })
}

// GET
handler._innerMethods.get = async (data, callback) => {
    return callback(200, {
        msg: 'Vartotojo paskyros informacija',
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