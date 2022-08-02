function pageLogin(data) {
    let navHTML = '';

    if (data.user.isLoggedIn) {
        navHTML = `<a href="/account">Account</a>
                    <a href="/logout">Logout</a>`;
    } else {
        navHTML = `<a href="/register">Register</a>
                    <a href="/login">Login</a>`;
    }


    return `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <link rel="stylesheet" href="/css/main.css">
                <link rel="stylesheet" href="/css/register.css">
            </head>

            <body>
                <header>
                    <img src="/img/logo.png" alt="Logo">
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/services">Services</a>
                        ${navHTML} 
                    </nav>
                </header>
                <main>
                    <form>
                        <div class="notifications"></div>
                        <div>
                            <label>Email</label>
                            <input type="text">
                        </div>
                        <div>
                            <label>Password</label>
                            <input type="password">
                        </div>
                        <div>
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </main>
                <script src="/js/login.js" type="module" defer></script>
            </body>

            </html>`;
}

export { pageLogin }