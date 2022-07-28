import http from 'http';
import { file } from './file.js';
import { utils } from './utils.js';
import { StringDecoder } from 'string_decoder';
import config from '../config.js';

import { pageHome } from '../pages/pageHome.js';
import { pageServices } from '../pages/pageServices.js';
import { pageAbout } from '../pages/pageAbout.js';
import { page404 } from '../pages/page404.js';
import { pageRegister } from '../pages/pageRegister.js';

import APIaccount from '../api/account.js';

const server = {};

server.httpServer = http.createServer(async (req, res) => {
    const baseURL = `http${req.socket.encryption ? 's' : ''}://${req.headers.host}/`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();    // uzklausos intensija
    const trimmedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, '');

    let responseContent = '';

    const binaryFileExtensions = ['ico', 'jpg', 'png', 'webp'];
    const textFileExtensions = ['css', 'js', 'svg'];

    const fileExtension = utils.fileExtension(trimmedPath);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.slice(0, 4) === 'api/';
    const isPage = !isBinaryFile && !isTextFile && !isAPI;

    const MIMES = {
        txt: 'text/plain',
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg',
        webp: 'image/webp',
        ico: 'image/x-icon',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        otf: 'font/otf',
        eot: 'application/vnd.ms-fontobject',
        webmanifest: 'application/manifest+json',
        pdf: 'application/pdf',
        json: 'application/json',
    };

    const decoder = new StringDecoder('utf8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', async () => {
        buffer += decoder.end();

        const dataForHandlers = {
            baseURL,
            trimmedPath,
            httpMethod,
            payload: utils.parseJSONtoObject(buffer),
            searchParams: parsedURL.searchParams,
            user: {
                isLoggedIn: false,
                name: '',
                email: '',
                browser: '',
                IP: req.socket.remoteAddress,
            },
        }

        if (isBinaryFile) {
            const [readErr, readMsg] = await file.readPublicBinary(trimmedPath);
            if (readErr) {
                const userLang = 'fr';
                const trans = {
                    en: 'File not found',
                    lt: 'Failas nerastas',
                    ru: 'XXXX XXXXXXX'
                }
                res.writeHead(404, {
                    'Content-Type': MIMES[fileExtension] || MIMES.html,
                });
                responseContent = userLang in trans ? trans[userLang] : trans.en;
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension] || MIMES.html,
                })
                responseContent = readMsg;
            }
        }

        if (isTextFile) {
            const [readErr, readMsg] = await file.readPublic(trimmedPath);
            if (readErr) {
                const userLang = 'fr';
                const trans = {
                    en: 'File not found',
                    lt: 'Failas nerastas',
                    ru: 'XXXX XXXXXXX'
                }
                res.writeHead(404, {
                    'Content-Type': MIMES[fileExtension] || MIMES.html,
                });
                responseContent = userLang in trans ? trans[userLang] : trans.en;
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension] || MIMES.html,
                })
                responseContent = readMsg;
            }
        }

        if (isAPI) {
            const APIroute = trimmedPath.split('/')[1];         // account
            if (server.API[APIroute] && server.API[APIroute][APIroute]) {
                const APIhandler = server.API[APIroute][APIroute];

                function apiCallbackFunc(statusCode, payload, headers = {}) {
                    statusCode = typeof statusCode === 'number' ? statusCode : 200;
                    responseContent = typeof payload === 'string' ? payload : JSON.stringify(payload);

                    res.writeHead(statusCode, {
                        'Content-Type': MIMES.json,
                        ...headers,
                    })
                }

                await APIhandler(dataForHandlers, apiCallbackFunc);
            } else {
                res.writeHead(404, {
                    'Content-Type': MIMES.json,
                })
                responseContent = JSON.stringify({
                    msg: 'No such API endpoint found'
                });
            }
        }

        if (isPage) {
            const responseFunc = server.routes[trimmedPath] ? server.routes[trimmedPath] : server.routes['404'];
            responseContent = responseFunc(dataForHandlers);
        }

        res.end(responseContent);
    })
});

server.routes = {
    '': pageHome,
    'services': pageServices,
    'about': pageAbout,
    '404': page404,
    'register': pageRegister,
}

server.API = {
    account: APIaccount,
}

server.init = () => {
    const PORT = config.port;
    server.httpServer.listen(PORT, () => {
        console.log(`Sveikinu, tavo projektas pasiekiamas per http://localhost:${PORT}`);
    });
}

export { server }