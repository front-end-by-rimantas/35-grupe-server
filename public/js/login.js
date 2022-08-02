import { IsValid } from './components/IsValid.js';

const formDOM = document.querySelector('form');
const notificationsDOM = document.querySelector('.notifications');
const inputsDOM = formDOM.querySelectorAll('input');
const submitDOM = formDOM.querySelector('button');

submitDOM.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = inputsDOM[0].value;
    const pass = inputsDOM[1].value;

    const [emailErr, emailMsg] = IsValid.email(email);
    if (emailErr) {
        return notificationsDOM.textContent = emailMsg;
    }

    const [passErr, passMsg] = IsValid.password(pass);
    if (passErr) {
        return notificationsDOM.textContent = passMsg;
    }

    // surinkti duomenis
    const data = { email, pass };

    // juos issiusti i serverio API
    const msgSend = await fetch('/api/token', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    const response = await msgSend.json();

    notificationsDOM.textContent = response.msg;

    // is serverio gausim atsakyma:
    // - jei gerai - OK
    // - jei NE gerai - klaidos pranesimas
})