import http from 'http';
import { file } from './file.js';
import { utils } from './utils.js';

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
    const isAPI = trimmedPath.slice(0, 5) === '/api/';
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
        responseContent = 'API RESPONSE';
    }

    if (isPage) {
        const routes = {
            '': pageHome,
            'services': pageServices,
            'about': pageAbout,
            '404': page404,
        }

        responseContent = routes[trimmedPath] ? routes[trimmedPath]() : routes['404']();
    }

    res.end(responseContent);
});

function pageHome() {
    return `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <link rel="stylesheet" href="/css/main.css">
                <link rel="stylesheet" href="/css/demo.css">
            </head>

            <body>
                HOME PAGE CONTENT
                <img src="/img/I.R._Baboon.webp" alt="Baboon">
                <img src="/img/a.webp" alt="Baboon">
                <script src="/js/main.js" type="module" defer></script>
            </body>

            </html>`;
}

function pageAbout() {
    return 'ABOUT PAGE';
}

function pageServices() {
    return 'SERVICES PAGE';
}

function page404() {
    return '404 PAGE';
}

server.init = () => {
    const PORT = 65535;
    server.httpServer.listen(PORT, () => {
        console.log(`Sveikinu, tavo projektas pasiekiamas per http://localhost:${PORT}`);
    });
}

export { server }