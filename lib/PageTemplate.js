import config from "../config.js";

class PageTemplate {
    constructor(data) {
        this.data = data;
        this.pageTitle = 'Serveris';
        this.cssForPage = 'home';
        this.jsForPage = '';
    }

    headHTML() {
        return `<meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.pageTitle}</title>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <link rel="stylesheet" href="/css/pages/${this.cssForPage}.css">`;
    }

    headerHTML() {
        const path = this.data.trimmedPath.split('/')[0];
        let navHTML = '';

        if (this.data.user.isLoggedIn) {
            navHTML = `<a href="/account" class="${path === 'account' ? 'active' : ''}">Account</a>
                    <a href="/logout" class="${path === 'logout' ? 'active' : ''}">Logout</a>`;
        } else {
            navHTML = `<a href="/register" class="${path === 'register' ? 'active' : ''}">Register</a>
                    <a href="/login" class="${path === 'login' ? 'active' : ''}">Login</a>`;
        }

        return `<header>
                    <img src="#" alt="Logo">
                    <nav>
                        <a href="/" class="${path === '' ? 'active' : ''}">Home</a>
                        <a href="/about" class="${path === 'about' ? 'active' : ''}">About</a>
                        <a href="/services" class="${path === 'services' ? 'active' : ''}">Services</a>
                        ${navHTML}
                    </nav>
                </header>`;
    }

    mainHTML() {
        return `MAIN CONTENT`;
    }

    footerHTML() {
        return `<footer>Copyright 2022, Rimantas</footer>`;
    }

    scriptHTML() {
        if (this.jsForPage === '') {
            return '';
        }
        return `<script src="/js/pages/${this.jsForPage}.js" type="module" defer></script>`;
    }

    render() {
        const headers = {};

        if (this.data.user.isLoggedIn) {
            const cookies = [
                'server-35-token=' + this.data.cookies['server-35-token'],
                'path=/',
                'domain=localhost',
                'max-age=' + config.auth.sessionLength,
                // 'Secure',
                'SameSite=Lax',
                'HttpOnly'
            ];
            headers['Set-Cookie'] = cookies.join('; ');
        }

        return [
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                ${this.headHTML()}
            </head>
            <body>
                ${this.headerHTML()}
                <main>
                    ${this.mainHTML()}
                </main>
                ${this.footerHTML()}
                ${this.scriptHTML()}
            </body>
            </html>`,
            headers
        ];
    }
}

export { PageTemplate }