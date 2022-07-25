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

    console.log(payload);

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