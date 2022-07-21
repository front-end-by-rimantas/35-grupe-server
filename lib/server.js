import http from 'http';
import { file } from './file.js';
import { utils } from './utils.js';

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encryption ? 's' : ''}://${req.headers.host}/`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();    // uzklausos intensija
    const trimmedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, '');

    let responseContent = '';

    const binaryFileExtensions = ['ico', 'jpg', 'png'];
    const textFileExtensions = ['css', 'js', 'svg'];

    const fileExtension = utils.fileExtension(trimmedPath);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.slice(0, 5) === '/api/';
    const isPage = !isBinaryFile && !isTextFile && !isAPI;

    if (isBinaryFile) {
        responseContent = 'BINARY FILE';
    }

    if (isTextFile) {
        responseContent = 'TEXT FILE';
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

(async () => {
    const [createErr, createMsg] = await file.create('accounts', 'chuck-norris.json', {
        name: 'Chuck',
        age: Infinity,
        age2: NaN,
        age3: 77,
        kick: 'round'
    })

    if (createErr) {
        console.log(createMsg);
        return;
    }

    console.log(createMsg);
})()