import { IsValid } from '../components/IsValid.js';
import { request } from '../components/request.js';

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
    await request('/api/token', 'POST', data, {
        notificationsDOM,
    });
})