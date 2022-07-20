import http from 'http';

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encryption ? 's' : ''}://${req.headers.host}/`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();    // uzklausos intensija

    /*
    Uzklausu kategorijos:
    - binary failas
    - tekstinis failas
    - api (JSON)
    - ne failas (HTML)
    */

    let responseContent = '';

    const url = parsedURL.pathname;
    console.log(parsedURL.pathname);

    const binaryFileExtensions = ['ico', 'jpg', 'png'];
    const textFileExtensions = ['css', 'js', 'svg'];

    const urlExtension = url.split('.')[1];
    const isBinaryFile = binaryFileExtensions.includes(urlExtension);
    const isTextFile = textFileExtensions.includes(urlExtension);
    const isAPI = url.slice(0, 5) === '/api/';
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
            '/': pageHome,
            '/services': pageServices,
            '/about': pageAbout,
            '/404': page404,
        }

        responseContent = routes[req.url] ? routes[req.url]() : routes['/404']();
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
    console.log('pasileidzia serveris...');
    server.httpServer.listen(65535);
}

export { server }